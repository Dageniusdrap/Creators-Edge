import { Request, Response } from 'express';
import { db } from './store';
import { hashPassword, comparePassword, generateToken } from './utils';
import { AuthRequest } from './auth';
import crypto from 'crypto';

// --- Type Definitions ---
interface UserResponse {
  id: string;
  email: string;
  name: string;
  plan: string;
  role: string;
  activated: boolean;
}

// --- Helpers ---
const validateExists = (res: Response, fields: Record<string, any>): boolean => {
  const missing = Object.keys(fields).filter(key => !fields[key]);
  if (missing.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    return false;
  }
  return true;
};

// --- Auth Handlers ---

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!validateExists(res, { email, password })) return;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await db('users').where({ email: normalizedEmail }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const cleanName = name ? name.trim() : normalizedEmail.split('@')[0];

    // 1. Create user
    await db('users').insert({
      id: userId,
      email: normalizedEmail,
      password: hashedPassword,
      name: cleanName,
      activated: true
    });

    // 2. Auto-create a default project for the new user (UX Improvement)
    const projectId = crypto.randomUUID();
    await db('projects').insert({
      id: projectId,
      user_id: userId,
      name: 'My First Project',
      created_at: new Date()
    });

    const token = generateToken(userId);
    const user: UserResponse = { id: userId, email: normalizedEmail, name: cleanName, plan: 'Free', role: 'user', activated: true };

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!validateExists(res, { email, password })) return;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    const user = await db('users').where({ email: normalizedEmail }).first();
    if (!user) {
      // Use generic error message for security
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await db('users').where({ id: userId }).first();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- Payment Handlers ---

import { createLemonCheckout, createFlutterwavePayment, configureLemonSqueezy, verifyFlutterwaveTransaction } from './payments';

// Initialize configurations
configureLemonSqueezy();

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { provider, planId, amount } = req.body; // provider: 'lemon' | 'flutterwave'
    const user = req.user as any;
    const userEmail = user?.email || 'guest@example.com';
    const userName = user?.name || 'Guest User';

    let checkoutUrl: string | undefined;

    if (provider === 'lemon') {
      // Needs STORE_ID and VARIANT_ID (planId)
      const storeId = process.env.LEMONSQUEEZY_STORE_ID;
      if (!storeId || !planId) {
        return res.status(400).json({ error: 'Missing LemonSqueezy config (Store ID or Plan ID)' });
      }
      checkoutUrl = await createLemonCheckout(storeId, planId, userEmail);

    } else if (provider === 'flutterwave') {
      // Needs Amount (in UGX usually)
      if (!amount) {
        return res.status(400).json({ error: 'Amount is required for Flutterwave' });
      }
      checkoutUrl = await createFlutterwavePayment(Number(amount), userEmail, userName);

    } else {
      return res.status(400).json({ error: 'Invalid payment provider' });
    }

    if (!checkoutUrl) {
      throw new Error('Failed to generate checkout link');
    }

    res.json({ url: checkoutUrl });

  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate checkout' });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { transaction_id, provider } = req.body;

  try {
    if (provider === 'flutterwave') {
      const isValid = await verifyFlutterwaveTransaction(transaction_id);
      if (isValid) {
        await db('users').where({ id: req.user.id }).update({ plan: 'Pro' });
        return res.json({ success: true, message: "Upgraded to Pro" });
      } else {
        return res.status(400).json({ error: "Transaction invalid or failed" });
      }
    }
    res.status(400).json({ error: "Verification provider not supported or missing" });
  } catch (error: any) {
    console.error('Verify error:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- Project Handlers ---

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const projects = await db('projects').where({ user_id: userId }).orderBy('created_at', 'desc');

    // Hydrate projects with their assets
    const projectsWithAssets = await Promise.all(projects.map(async (p) => {
      const assets = await db('assets').where({ project_id: p.id }).orderBy('created_at', 'desc');
      // Parse asset data if stored as string
      const parsedAssets = assets.map(a => {
        let data = a.data;
        try {
          data = typeof a.data === 'string' ? JSON.parse(a.data) : a.data;
        } catch (e) {
          console.warn(`Failed to parse asset data for asset ${a.id}`, e);
          data = {};
        }

        return {
          ...a,
          data,
          // Ensure sourceFile is parsed if it exists
          sourceFile: a.source_file_name ? { name: a.source_file_name, type: a.source_file_type } : undefined
        };
      });
      return { ...p, assets: parsedAssets };
    }));

    res.json(projectsWithAssets);
  } catch (error) {
    console.error('Get Projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name } = req.body;

    if (!validateExists(res, { name })) return;

    const id = crypto.randomUUID();
    const newProject = {
      id,
      user_id: userId,
      name: name.trim(),
      created_at: new Date()
    };

    await db('projects').insert(newProject);

    // Return structure matching frontend expectation (empty assets array)
    res.status(201).json({ ...newProject, assets: [] });
  } catch (error) {
    console.error('Create Project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const deleted = await db('projects').where({ id, user_id: userId }).del();

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete Project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// --- Social Media Analysis Handlers ---

import { extractVideoId, getVideoDetails } from './youtube';

export const analyzeYoutube = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // 1. Fetch metadata from YouTube
    const videoData = await getVideoDetails(videoId);

    // 2. (Future) We can feed this description/transcript into Gemini here for "AI Analysis"
    // For now, we return the raw data

    res.json({
      success: true,
      data: videoData
    });

  } catch (error: any) {
    console.error('YouTube analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze video' });
  }
};

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { projectId } = req.params;
    const { type, name, data, sourceFile } = req.body;

    if (!validateExists(res, { type, name, data })) return;

    // Verify project ownership
    const project = await db('projects').where({ id: projectId, user_id: userId }).first();
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const id = crypto.randomUUID();
    const newAsset = {
      id,
      project_id: projectId,
      type,
      name,
      data: JSON.stringify(data), // Serialize complex data
      source_file_name: sourceFile?.name,
      source_file_type: sourceFile?.type,
      created_at: new Date()
    };

    await db('assets').insert(newAsset);

    // Return formatted asset
    res.status(201).json({
      ...newAsset,
      data: data, // Return original object
      sourceFile // Return original object
    });
  } catch (error) {
    console.error('Create Asset error:', error);
    res.status(500).json({ error: 'Failed to save asset' });
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { projectId, assetId } = req.params;

    // Verify project ownership
    const project = await db('projects').where({ id: projectId, user_id: userId }).first();
    if (!project) return res.status(403).json({ error: 'Unauthorized' });

    const deleted = await db('assets').where({ id: assetId, project_id: projectId }).del();

    if (!deleted) return res.status(404).json({ error: 'Asset not found' });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete Asset error:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};