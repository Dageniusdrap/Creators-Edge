import { Router } from 'express';
import { authenticateToken } from './auth';
import * as handlers from './handlers';
import passport from 'passport';
import { generateToken } from './utils';

const router = Router();

// --- Auth Routes ---
router.post('/auth/signup', handlers.signup);
router.post('/auth/login', handlers.login);
router.get('/auth/me', authenticateToken, handlers.getMe);

// Social Auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = generateToken((req.user as any).id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/?token=${token}`);
});

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = generateToken((req.user as any).id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/?token=${token}`);
});

// --- Project Routes ---
router.get('/projects', authenticateToken, handlers.getProjects);
router.post('/projects', authenticateToken, handlers.createProject);
router.delete('/projects/:id', authenticateToken, handlers.deleteProject);

// --- Asset Routes ---
router.post('/projects/:projectId/assets', authenticateToken, handlers.createAsset);
router.delete('/projects/:projectId/assets/:assetId', authenticateToken, handlers.deleteAsset);

// --- Social Routes ---
router.post('/social/youtube', authenticateToken, handlers.analyzeYoutube);

// --- Storage Routes ---
router.post('/storage/upload-url', authenticateToken, handlers.getUploadUrl);

// --- Payment Routes ---
router.post('/payment/checkout', authenticateToken, handlers.createCheckout);
router.post('/payment/verify', authenticateToken, handlers.verifyPayment);

// --- AI Routes ---
import * as aiHandlers from './aiHandlers';

router.post('/ai/sales-call', authenticateToken, aiHandlers.analyzeSalesCall);
router.post('/ai/social-media', authenticateToken, aiHandlers.analyzeSocialMediaContent);
router.post('/ai/product-ad', authenticateToken, aiHandlers.analyzeProductAd);
router.post('/ai/video-analysis', authenticateToken, aiHandlers.analyzeVideoContent);
router.post('/ai/transcription', authenticateToken, aiHandlers.transcribeMedia);
router.post('/ai/document', authenticateToken, aiHandlers.analyzeDocument);
router.post('/ai/financial-report', authenticateToken, aiHandlers.analyzeFinancialReport);
router.post('/ai/live-stream', authenticateToken, aiHandlers.analyzeLiveStream);
router.post('/ai/ab-test', authenticateToken, aiHandlers.analyzeABTest);
router.post('/ai/brand-voice-score', authenticateToken, aiHandlers.scoreBrandVoiceAlignment);
router.post('/ai/repurpose', authenticateToken, aiHandlers.analyzeAndRepurposeContent);
router.post('/ai/thumbnail', authenticateToken, aiHandlers.analyzeThumbnail);
router.post('/ai/monetization-assets', authenticateToken, aiHandlers.generateMonetizationAssets);

// Generation Routes
router.post('/ai/generate/improved-content', authenticateToken, aiHandlers.generateImprovedContent);
router.post('/ai/generate/social-post', authenticateToken, aiHandlers.generateSocialPost);
router.post('/ai/generate/youtube-post', authenticateToken, aiHandlers.generateYouTubePost);
router.post('/ai/generate/product-ad-script', authenticateToken, aiHandlers.generateProductAdScript);
router.post('/ai/generate/key-takeaways', authenticateToken, aiHandlers.generateKeyTakeaways);
router.post('/ai/generate/description', authenticateToken, aiHandlers.generateDescription);
router.post('/ai/generate/viral-script', authenticateToken, aiHandlers.generateViralScript);
router.post('/ai/generate/social-from-script', authenticateToken, aiHandlers.generateSocialPostFromScript);
router.post('/ai/brainstorm', authenticateToken, aiHandlers.brainstormVideoIdeas);
// ... (other ai routes)
router.post('/ai/refine', authenticateToken, aiHandlers.refineTranscriptLine);
router.post('/ai/generate/retirement-plan', authenticateToken, aiHandlers.generateRetirementPlan);
router.post('/ai/summarize-live-session', authenticateToken, aiHandlers.summarizeLiveSession);

// Image & Video
router.post('/ai/generate/image', authenticateToken, aiHandlers.generateImage);
router.post('/ai/generate/video', authenticateToken, aiHandlers.generateVideo);
router.get('/ai/generate/video/status/:requestId', authenticateToken, aiHandlers.getVideoStatus);

export default router;