import { Router } from 'express';
import { authenticateToken } from './auth';
import * as handlers from './handlers';

const router = Router();

// --- Auth Routes ---
router.post('/auth/signup', handlers.signup);
router.post('/auth/login', handlers.login);
router.get('/auth/me', authenticateToken, handlers.getMe);

// --- Project Routes ---
router.get('/projects', authenticateToken, handlers.getProjects);
router.post('/projects', authenticateToken, handlers.createProject);
router.delete('/projects/:id', authenticateToken, handlers.deleteProject);

// --- Asset Routes ---
router.post('/projects/:projectId/assets', authenticateToken, handlers.createAsset);
router.delete('/projects/:projectId/assets/:assetId', authenticateToken, handlers.deleteAsset);

export default router;