import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './utils';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
  // Explicitly add properties to avoid TS errors if base Request type is restricted
  body: any;
  params: any;
  headers: any;
  query: any;
}

export const authenticateToken = (req: AuthRequest, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = { id: decoded.userId };
  next();
};