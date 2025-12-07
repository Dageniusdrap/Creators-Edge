import { Request, Response } from 'express';
import { db } from './store';
import { hashPassword, comparePassword, generateToken } from './utils';
import { AuthRequest } from './auth';
import crypto from 'crypto';

// --- Auth Handlers ---

export const signup = async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    const existingUser = await db('users').where({ email: normalizedEmail }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    // 1. Create user
    await db('users').insert({
      id: userId,
      email: normalizedEmail,
      password: hashedPassword,
      name: name || normalizedEmail.split('@')[0],
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
    const user = { id: userId, email: normalizedEmail, name, plan: 'Free', role: 'user', activated: true };
    
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    const user = await db('users').where({ email: normalizedEmail }).first();
    if (!user) {
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

export const getMe = async (req: AuthRequest, res: any) => {
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

// --- Project Handlers ---

export const getProjects = async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.id;
    const projects = await db('projects').where({ user_id: userId }).orderBy('created_at', 'desc');
    
    // Hydrate projects with their assets
    const projectsWithAssets = await Promise.all(projects.map(async (p) => {
      const assets = await db('assets').where({ project_id: p.id }).orderBy('created_at', 'desc');
      // Parse asset data if stored as string
      const parsedAssets = assets.map(a => ({
        ...a,
        data: typeof a.data === 'string' ? JSON.parse(a.data) : a.data,
        // Ensure sourceFile is parsed if it exists
        sourceFile: a.source_file_name ? { name: a.source_file_name, type: a.source_file_type } : undefined
      }));
      return { ...p, assets: parsedAssets };
    }));

    res.json(projectsWithAssets);
  } catch (error) {
    console.error('Get Projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name is required' });

    const id = crypto.randomUUID();
    const newProject = {
      id,
      user_id: userId,
      name,
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

export const deleteProject = async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.id;
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

// --- Asset Handlers ---

export const createAsset = async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;
    const { type, name, data, sourceFile } = req.body;

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

export const deleteAsset = async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.id;
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