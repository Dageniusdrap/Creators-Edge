
import { Request, Response } from 'express';
import * as gemini from './gemini';
import { AuthRequest } from './auth';

// Helper to extract file data safely
const getFile = (reqBody: any) => {
    if (reqBody.file && reqBody.file.base64 && reqBody.file.type) {
        return {
            base64: reqBody.file.base64,
            type: reqBody.file.type
        };
    }
    return undefined;
};

export const analyzeSalesCall = async (req: Request, res: Response) => {
    try {
        const { script, brandVoice } = req.body;
        const file = getFile(req.body);
        const result = await gemini.analyzeSalesCall(script, brandVoice, file?.base64, file?.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze sales call" });
    }
};

export const analyzeSocialMediaContent = async (req: Request, res: Response) => {
    try {
        const { script, description, link, brandVoice } = req.body;
        const file = getFile(req.body);
        const result = await gemini.analyzeSocialMediaContent(script, description, link, brandVoice, file?.base64, file?.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze social media content" });
    }
};

export const analyzeProductAd = async (req: Request, res: Response) => {
    try {
        const { script, description, link, brandVoice } = req.body;
        const file = getFile(req.body);
        const result = await gemini.analyzeProductAd(script, description, link, brandVoice, file?.base64, file?.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze product ad" });
    }
};

export const analyzeVideoContent = async (req: Request, res: Response) => {
    try {
        const file = getFile(req.body);
        const { fileUrl } = req.body;

        if (!file && !fileUrl) throw new Error("File or File URL is required for video analysis");

        const result = await gemini.analyzeVideoContent(file?.base64 || '', file?.type || '', fileUrl);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze video" });
    }
};

export const transcribeMedia = async (req: Request, res: Response) => {
    try {
        const file = getFile(req.body);
        if (!file) throw new Error("File is required for transcription");
        const result = await gemini.transcribeMedia(file.base64, file.type);
        res.json(result);
    } catch (error: any) {
        console.error("Transcribe Error:", error);
        res.status(500).json({ error: error.message || "Failed to transcribe media" });
    }
};

export const analyzeDocument = async (req: Request, res: Response) => {
    try {
        const { script, description } = req.body;
        const file = getFile(req.body);
        const result = await gemini.analyzeDocument(script, description, file?.base64, file?.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze document" });
    }
};

export const analyzeFinancialReport = async (req: Request, res: Response) => {
    try {
        const { script, description } = req.body;
        const file = getFile(req.body);
        const result = await gemini.analyzeFinancialReport(script, description, file?.base64, file?.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze financial report" });
    }
};

export const analyzeLiveStream = async (req: Request, res: Response) => {
    try {
        const file = getFile(req.body);
        if (!file) throw new Error("File is required for live stream analysis");
        const result = await gemini.analyzeLiveStream(file.base64, file.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze live stream" });
    }
};

export const analyzeABTest = async (req: Request, res: Response) => {
    try {
        const { contentA, contentB } = req.body;
        // contentA and contentB are objects that might have 'file' properties inside them
        // Expected format from frontend needs to be checked or adjusted.
        // Let's assume frontend sends { script, file: { base64, type } } for A and B.

        const preparedContentA = {
            script: contentA.script,
            fileBase64: contentA.file?.base64,
            fileType: contentA.file?.type
        };
        const preparedContentB = {
            script: contentB.script,
            fileBase64: contentB.file?.base64,
            fileType: contentB.file?.type
        };

        const result = await gemini.analyzeABTest(preparedContentA, preparedContentB);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze A/B test" });
    }
};

export const scoreBrandVoiceAlignment = async (req: Request, res: Response) => {
    try {
        const { text, brandVoice } = req.body;
        const result = await gemini.scoreBrandVoiceAlignment(text, brandVoice);
        res.json(result);
    } catch (error: any) {
        console.error("Scoring Error:", error);
        res.status(500).json({ error: error.message || "Failed to score brand voice" });
    }
};

export const analyzeAndRepurposeContent = async (req: Request, res: Response) => {
    try {
        const { script } = req.body;
        const file = getFile(req.body);
        const result = await gemini.analyzeAndRepurposeContent(script, file?.base64, file?.type);
        res.json(result);
    } catch (error: any) {
        console.error("Repurpose Error:", error);
        res.status(500).json({ error: error.message || "Failed to repurpose content" });
    }
};

export const analyzeThumbnail = async (req: Request, res: Response) => {
    try {
        const file = getFile(req.body);
        if (!file) throw new Error("File is required for thumbnail analysis");
        const result = await gemini.analyzeThumbnail(file.base64, file.type);
        res.json(result);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Failed to analyze thumbnail" });
    }
};

export const generateMonetizationAssets = async (req: Request, res: Response) => {
    try {
        const { result, brandVoice } = req.body;
        const assets = await gemini.generateMonetizationAssets(result, brandVoice);
        res.json({ monetizationAssets: assets });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate monetization assets" });
    }
};

// --- Generation Handlers ---

export const generateImprovedContent = async (req: Request, res: Response) => {
    try {
        const { result, brandVoice } = req.body;
        const content = await gemini.generateImprovedContent(result, brandVoice);
        res.json({ content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate improved content" });
    }
};

export const generateSocialPost = async (req: Request, res: Response) => {
    try {
        const { result, platform } = req.body;
        const content = await gemini.generateSocialPost(result, platform);
        res.json({ content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate social post" });
    }
};

export const generateYouTubePost = async (req: Request, res: Response) => {
    try {
        const { result, brandVoice } = req.body;
        const post = await gemini.generateYouTubePost(result, brandVoice);
        res.json(post);
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate YouTube post" });
    }
};

export const generateProductAdScript = async (req: Request, res: Response) => {
    try {
        const { result } = req.body;
        const content = await gemini.generateProductAdScript(result);
        res.json({ content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate product ad script" });
    }
};

export const generateKeyTakeaways = async (req: Request, res: Response) => {
    try {
        const { result } = req.body;
        const takeaways = await gemini.generateKeyTakeaways(result);
        res.json(takeaways);
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate key takeaways" });
    }
};

export const generateDescription = async (req: Request, res: Response) => {
    try {
        const { result, brandVoice } = req.body;
        const content = await gemini.generateDescription(result, brandVoice);
        res.json({ content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate description" });
    }
};

export const generateViralScript = async (req: Request, res: Response) => {
    try {
        const { prompt, link, brandVoice } = req.body;
        const content = await gemini.generateViralScript(prompt, link, brandVoice);
        res.json({ content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate viral script" });
    }
};

export const generateSocialPostFromScript = async (req: Request, res: Response) => {
    try {
        const { script, brandVoice } = req.body;
        const content = await gemini.generateSocialPostFromScript(script, brandVoice);
        res.json({ content });
    } catch (error: any) {
        console.error("Generation Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate social post from script" });
    }
};

export const brainstormVideoIdeas = async (req: Request, res: Response) => {
    try {
        const { keyword } = req.body;
        const ideas = await gemini.brainstormVideoIdeas(keyword);
        res.json(ideas);
    } catch (error: any) {
        console.error("Brainstorm Error:", error);
        res.status(500).json({ error: error.message || "Failed to brainstorm ideas" });
    }
};

export const refineTranscriptLine = async (req: Request, res: Response) => {
    try {
        const { text, instruction } = req.body;
        const content = await gemini.refineTranscriptLine(text, instruction);
        res.json({ content });
    } catch (error: any) {
        console.error("Refine Error:", error);
        res.status(500).json({ error: error.message || "Failed to refine text" });
    }
};

export const generateRetirementPlan = async (req: AuthRequest, res: Response) => {
    try {
        const { inputs } = req.body;
        if (!inputs) return res.status(400).json({ error: "Inputs required" });

        const result = await gemini.generateRetirementPlan(inputs);
        res.json(result);
    } catch (error: any) {
        console.error("Retirement plan gen error:", error);
        res.status(500).json({ error: "Failed to generate retirement plan" });
    }
};

export const summarizeLiveSession = async (req: AuthRequest, res: Response) => {
    try {
        const { transcript } = req.body;
        if (!transcript) return res.status(400).json({ error: "Transcript required" });

        const content = await gemini.summarizeLiveSessionText(transcript);
        res.json({ content });
    } catch (error: any) {
        console.error("Live session summary error:", error);
        res.status(500).json({ error: "Failed to summarize live session" });
    }
};
import * as imageGen from './imageGen';

export const generateImage = async (req: Request, res: Response) => {
    try {
        const { prompt, aspectRatio, model } = req.body;
        const image = await imageGen.generateImageMultiProvider(prompt, aspectRatio, model);
        res.json({ image });
    } catch (error: any) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate image" });
    }
};

export const generateVideo = async (req: Request, res: Response) => {
    try {
        const { prompt, aspectRatio, model } = req.body;
        const result = await imageGen.submitVideo(prompt, aspectRatio, model);
        res.json(result);
    } catch (error: any) {
        console.error("Video Gen Error:", error);
        res.status(500).json({ error: error.message || "Failed to submit video generation" });
    }
};

export const getVideoStatus = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        const { model } = req.query; // falModelId

        if (!requestId || !model) {
            return res.status(400).json({ error: "Missing requestId or model parameter" });
        }

        const status = await imageGen.checkVideoStatus(model as string, requestId);
        res.json(status);
    } catch (error: any) {
        console.error("Video Status Error:", error);
        res.status(500).json({ error: error.message || "Failed to check video status" });
    }
};
