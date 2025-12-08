
import {
    AnalysisResult,
    VoiceoverScript,
    RetirementPlan,
    BrandVoice,
    SocialPlatform,
    MonetizationAssets,
    BrandVoiceScoreAnalysis,
    YouTubePost,
    AbortError
} from "../types";
import { api } from '../utils/apiClient';

// --- Helper Functions ---

const fileToBase64 = (file: File): Promise<{ base64: string, type: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            const type = result.substring(result.indexOf(':') + 1, result.indexOf(';'));
            resolve({ base64, type });
        };
        reader.onerror = error => reject(error);
    });
};

const uploadToR2 = async (file: File): Promise<string> => {
    const { url, publicUrl } = await api.post('/storage/upload-url', {
        fileName: file.name,
        fileType: file.type
    });

    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });

    return publicUrl;
};

const getFilePayload = async (file?: File) => {
    if (!file) return undefined;

    // Use R2 for files larger than 5MB or always for video/audio to be safe
    const isLargeFile = file.size > 5 * 1024 * 1024;
    const isMedia = file.type.startsWith('video/') || file.type.startsWith('audio/');

    if (isLargeFile || isMedia) {
        const fileUrl = await uploadToR2(file);
        return { fileUrl, type: file.type };
    }

    const { base64, type } = await fileToBase64(file);
    return { base64, type };
};

// --- Analysis Functions ---

export const analyzeSalesCall = async (signal: AbortSignal, script: string, brandVoice: BrandVoice, file?: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    // Determine if payload is url or base64
    const body: any = { script, brandVoice };
    if (filePayload) {
        if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
        else body.file = filePayload;
    }
    return api.post('/ai/sales-call', body);
};

export const analyzeSocialMediaContent = async (signal: AbortSignal, script: string, description: string, link: string, brandVoice: BrandVoice, file?: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    const body: any = { script, description, link, brandVoice };
    if (filePayload) {
        if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
        else body.file = filePayload;
    }
    return api.post('/ai/social-media', body);
};

export const analyzeProductAd = async (signal: AbortSignal, script: string, description: string, link: string, brandVoice: BrandVoice, file?: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    const body: any = { script, description, link, brandVoice };
    if (filePayload) {
        if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
        else body.file = filePayload;
    }
    return api.post('/ai/product-ad', body);
};

export const analyzeVideoContent = async (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    if (!filePayload) throw new Error("File is required");
    const body: any = {};
    if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
    else body.file = filePayload;
    return api.post('/ai/video-analysis', body);
};

export const transcribeMedia = async (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    if (!filePayload) throw new Error("File is required");
    const body: any = {};
    if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
    else body.file = filePayload;
    return api.post('/ai/transcription', body);
};

export const analyzeDocument = async (signal: AbortSignal, script: string, description: string, file?: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    const body: any = { script, description };
    if (filePayload) {
        if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
        else body.file = filePayload;
    }
    return api.post('/ai/document', body);
};

export const analyzeFinancialReport = async (signal: AbortSignal, script: string, description: string, file?: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    const body: any = { script, description };
    if (filePayload) {
        if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
        else body.file = filePayload;
    }
    return api.post('/ai/financial-report', body);
};

export const analyzeLiveStream = async (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    if (!filePayload) throw new Error("File is required");
    const body: any = {};
    if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
    else body.file = filePayload;
    return api.post('/ai/live-stream', body);
};

type ABTestInput = { script: string; file?: File };

export const analyzeABTest = async (signal: AbortSignal, contentA: ABTestInput, contentB: ABTestInput): Promise<AnalysisResult> => {
    const fileAPayload = await getFilePayload(contentA.file);
    const fileBPayload = await getFilePayload(contentB.file);

    return api.post('/ai/ab-test', {
        contentA: { script: contentA.script, file: fileAPayload },
        contentB: { script: contentB.script, file: fileBPayload }
    });
};

export const scoreBrandVoiceAlignment = async (signal: AbortSignal, text: string, brandVoice: BrandVoice): Promise<AnalysisResult> => {
    return api.post('/ai/brand-voice-score', { text, brandVoice });
};

export const analyzeAndRepurposeContent = async (signal: AbortSignal, script: string, file?: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    const body: any = { script };
    if (filePayload) {
        if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
        else body.file = filePayload;
    }
    return api.post('/ai/repurpose', body);
};

export const analyzeThumbnail = async (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const filePayload = await getFilePayload(file);
    if (!filePayload) throw new Error("File is required");
    const body: any = {};
    if ('fileUrl' in filePayload) body.fileUrl = filePayload.fileUrl;
    else body.file = filePayload;
    return api.post('/ai/thumbnail', body);
};

export const generateMonetizationAssets = async (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice): Promise<MonetizationAssets> => {
    const response = await api.post('/ai/monetization-assets', { result, brandVoice });
    return response.monetizationAssets;
};

// --- Generation Functions ---

// Note: Streaming is currently simulated by awaiting the full response from backend
// and then calling onChunk with the result.

export const generateImprovedContent = async (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const { content } = await api.post('/ai/generate/improved-content', { result, brandVoice });
    onChunk(content);
};

export const generateSocialPost = async (signal: AbortSignal, result: AnalysisResult, platform: SocialPlatform, onChunk: (chunk: string) => void) => {
    const { content } = await api.post('/ai/generate/social-post', { result, platform });
    onChunk(content);
};

export const generateYouTubePost = async (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice): Promise<YouTubePost> => {
    return api.post('/ai/generate/youtube-post', { result, brandVoice });
};

export const generateProductAd = async (signal: AbortSignal, result: AnalysisResult, onChunk: (chunk: string) => void) => {
    const { content } = await api.post('/ai/generate/product-ad-script', { result });
    onChunk(content);
};

export const generateKeyTakeaways = async (signal: AbortSignal, result: AnalysisResult): Promise<string[]> => {
    return api.post('/ai/generate/key-takeaways', { result });
};

export const generateDescription = async (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const { content } = await api.post('/ai/generate/description', { result, brandVoice });
    onChunk(content);
};

export const generateViralScript = async (signal: AbortSignal, prompt: string, link: string, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const { content } = await api.post('/ai/generate/viral-script', { prompt, link, brandVoice });
    onChunk(content);
};

export const generateSocialPostFromScript = async (signal: AbortSignal, script: string, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const { content } = await api.post('/ai/generate/social-from-script', { script, brandVoice });
    onChunk(content);
};

export const brainstormVideoIdeas = async (signal: AbortSignal, keyword: string): Promise<string[]> => {
    return api.post('/ai/brainstorm', { keyword });
};

export const refineTranscriptLine = async (signal: AbortSignal, text: string, instruction: string): Promise<string> => {
    const { content } = await api.post('/ai/refine', { text, instruction });
    return content;
};

export const summarizeLiveSession = async (signal: AbortSignal, fullTranscript: string, onChunk: (chunk: string) => void) => {
    // Non-streaming for now
    const { content } = await api.post('/ai/summarize-live-session', { transcript: fullTranscript });
    onChunk(content);
};

// --- Missing Ones from original file which I didn't move to backend yet ---
// generateImage
// editImage
// generateSpeechFromText
// generateSpeech
// generateVideo
// extendVideo

export const generateRetirementPlan = async (signal: AbortSignal, inputs: any): Promise<RetirementPlan> => {
    return api.post('/ai/generate/retirement-plan', { inputs });
};

export const generateImage = async (signal: AbortSignal, prompt: string, model: string, aspectRatio: string, mimeType: string, negativePrompt?: string): Promise<string> => {
    // We are routing this to our backend now
    const { image } = await api.post('/ai/generate/image', { prompt, aspectRatio, model });
    return image;
};

export const editImage = async (signal: AbortSignal, base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    // Placeholder
    throw new Error("Image editing not available in this version.");
};

export const generateSpeechFromText = async (signal: AbortSignal, text: string, voice: string, style: string): Promise<Blob> => {
    // Placeholder
    throw new Error("Speech generation not available in this version.");
};

export const generateSpeech = async (signal: AbortSignal, scripts: VoiceoverScript[]): Promise<string | null> => {
    // Placeholder
    throw new Error("Speech generation not available in this version.");
};

export const generateVideo = async (signal: AbortSignal, prompt: string, model: string, aspectRatio: string, resolution: string, frames: File[]) => {
    // Placeholder
    throw new Error("Video generation not available in this version.");
};

export const extendVideo = async (signal: AbortSignal, prompt: string, previousOperation: any) => {
    // Placeholder
    throw new Error("Video extension not available in this version.");
};
