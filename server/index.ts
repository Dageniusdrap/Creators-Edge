import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initDb } from './store';
import routes from './routes';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend requests
app.use(cors());

// Increase payload limit for base64 images/audio uploads
app.use(express.json({ limit: '50mb' }) as express.RequestHandler);
app.use(express.urlencoded({ extended: true, limit: '50mb' }) as express.RequestHandler);

// Rate Limiting: Prevent abuse (300 requests per 15 minutes per IP)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300, 
	standardHeaders: true, 
	legacyHeaders: false, 
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// Apply the rate limiting middleware to all API calls
app.use('/api', limiter as express.RequestHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API Routes
app.use('/api', routes);

// --- PRODUCTION SETUP ---
// Serve static frontend files if in production mode
if (process.env.NODE_ENV === 'production') {
  // Serve the 'dist' directory from the ROOT project folder
  // Using process.cwd() is safer for resolving paths in the Docker container
  const distPath = path.join((process as any).cwd(), 'dist');
  console.log(`Production mode: Serving static files from ${distPath}`);
  app.use(express.static(distPath) as express.RequestHandler);

  // Handle React routing: return index.html for any unknown non-API paths
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Initialize DB and start server
const startServer = async () => {
  try {
    await initDb(); // Ensure tables exist (SQLite or Postgres)
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    // In production, letting the process crash will trigger a restart by the cloud provider
    (process as any).exit(1); 
  }
};

startServer();