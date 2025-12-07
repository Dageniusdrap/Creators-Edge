import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { initDb } from './store';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy (Required for Railway/Vercel/Heroku)
app.set('trust proxy', 1);

// --- Security & Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"], // Allow necessary scripts
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      mediaSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"], // Allow Google AI calls (if backend proxies, this might not be needed client-side, but good for safety)
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(morgan(isProduction ? 'combined' : 'dev'));

// Enable CORS (Allow all for now, restrict in production if domain known)
app.use(cors());

// Increase payload limit for base64 images/audio uploads
app.use(express.json({ limit: '50mb' }));
import session from 'express-session';
import passport from 'passport';
import { setupPassport } from './auth';

// ... (previous middlewares)

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_key_change_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // Secure in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
setupPassport();

// Rate Limiting: Prevent abuse (300 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

app.use('/api', limiter);

// --- Routes ---

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// Mount API Routes
app.use('/api', routes);

// --- PRODUCTION SETUP ---
// Serve static frontend files if in production mode AND dist exists
if (isProduction) {
  const distPath = path.join(process.cwd(), 'dist');

  // Check if dist exists (it might not on Railway if split deploy)
  const fs = require('fs');
  if (fs.existsSync(distPath)) {
    console.log(`Production mode: Serving static files from ${distPath}`);
    app.use(express.static(distPath));

    // Handle React routing: return index.html for any unknown non-API paths
    app.get('*', (req: Request, res: Response) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  } else {
    console.log('Production mode: dist/ directory not found. Assuming split deployment (Frontend on Vercel).');
    app.get('/', (req, res) => {
      res.send('Backend is running! Frontend should be on Vercel.');
    });
  }
}

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: isProduction ? undefined : err.message });
});

// Initialize DB and start server
const startServer = async () => {
  try {
    await initDb(); // Ensure tables exist
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
};

startServer();