
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db } from './store';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key-change-in-prod', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as AuthRequest).user = user;
    next();
  });
};

const getBackendUrl = () => process.env.BACKEND_URL || '';

export const setupPassport = () => {
  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${getBackendUrl()}/api/auth/google/callback`
    },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0].value;
          if (!email) return done(null, false, { message: 'No email found' });

          // Check if user exists
          let user = await db('users').where({ email }).first();

          if (!user) {
            // Create user
            const id = uuidv4();
            user = {
              id,
              email,
              name: profile.displayName,
              role: 'user',
              plan: 'Free',
              activated: true,
              created_at: new Date()
            };
            await db('users').insert(user);
            // Create default project
            await db('projects').insert({
              id: uuidv4(),
              user_id: id,
              name: 'My First Project',
              created_at: new Date()
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }));
  }

  // GitHub Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${getBackendUrl()}/api/auth/github/callback`,
      scope: ['user:email']
    },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          let email = profile.emails?.[0].value;
          // GitHub might not return email if private, fetch if needed, but 'user:email' scope should help.
          if (!email) {
            // Try to find primary email?
            // For now fallback to failing if no email
            return done(null, false, { message: 'No email found' });
          }

          let user = await db('users').where({ email }).first();

          if (!user) {
            const id = uuidv4();
            user = {
              id,
              email,
              name: profile.displayName || profile.username,
              role: 'user',
              plan: 'Free',
              activated: true,
              created_at: new Date()
            };
            await db('users').insert(user);
            await db('projects').insert({
              id: uuidv4(),
              user_id: id,
              name: 'My First Project'
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }));
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await db('users').where({ id }).first();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

};