
import { GoogleGenAI, Type } from "@google/genai";
import {
    getSalesCallPrompt,
    getSocialMediaPrompt,
    getProductAdPrompt,
    getVideoAnalysisPrompt,
    getTranscriptionPrompt,
    getDocumentPrompt,
    getFinancialReportPrompt,
    getLiveStreamPrompt,
    getABTestPrompt,
    getBrandVoiceScorePrompt,
    getRepurposeContentPrompt,
    getThumbnailAnalysisPrompt,
    getMonetizationAssetsPrompt,
    getImprovedContentPrompt,
    getSocialPostPrompt,
    getYouTubePostPrompt,
    getProductAdScriptPrompt,
    getKeyTakeawaysPrompt,
    getDescriptionPrompt,
    getViralScriptPrompt,
    getSocialPostFromScriptPrompt,
    getRefineTextPrompt,
    getBrainstormIdeasPrompt,
    getRetirementPlanPrompt,
    getLiveSessionDebriefPrompt
} from './utils/ai';
import {
    salesCallFullSchema,
    socialMediaFullSchema,
    productAdFullSchema,
    videoAnalysisFullSchema,
    transcriptionFullSchema,
    documentFullSchema,
    financialReportFullSchema,
    liveStreamFullSchema,
    abTestFullSchema,
    brandVoiceScoreFullSchema,
    repurposeContentFullSchema,
    thumbnailAnalysisFullSchema,
    monetizationAssetsSchema,
    retirementPlanSchema
} from './utils/schemas';
import { BrandVoice } from './types';

const getApiKey = () => {
    return process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.API_KEY || '';
};

// Helper: Convert base64 to generative part
const base64ToGenerativePart = (base64Data: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64Data,
            mimeType: mimeType,
        },
    };
};

const cleanJsonString = (text: string): string => {
    if (!text) return "{}";
    const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(markdownRegex);
    if (match && match[1]) text = match[1].trim();

    const firstBracket = text.indexOf('{');
    const firstSquare = text.indexOf('[');
    let startIndex = -1;
    if (firstBracket !== -1 && firstSquare !== -1) startIndex = Math.min(firstBracket, firstSquare);
    else if (firstBracket !== -1) startIndex = firstBracket;
    else if (firstSquare !== -1) startIndex = firstSquare;

    if (startIndex === -1) return text.trim();

    const lastBracket = text.lastIndexOf('}');
    const lastSquare = text.lastIndexOf(']');
    let endIndex = -1;
    if (lastBracket !== -1 && lastSquare !== -1) endIndex = Math.max(lastBracket, lastSquare);
    else if (lastBracket !== -1) endIndex = lastBracket;
    else if (lastSquare !== -1) endIndex = lastSquare;

    if (endIndex === -1 || endIndex < startIndex) return text.trim();

    return text.substring(startIndex, endIndex + 1);
};

const callGeminiJson = async (prompt: string, schema: any, fileBase64?: string, fileType?: string) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Server API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [{ text: prompt }];

    if (fileBase64 && fileType) {
        parts.unshift(base64ToGenerativePart(fileBase64, fileType));
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    const rawText = response.text || "{}";
    const jsonText = cleanJsonString(rawText);

    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", rawText);
        throw new Error("AI returned invalid JSON format.");
    }
};

const callGeminiText = async (prompt: string) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Server API Key missing");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || '';
};

export const generateJson = async (prompt: string, schema: any, fileBase64?: string, fileType?: string) => {
    return callGeminiJson(prompt, schema, fileBase64, fileType);
};

export const generateText = async (prompt: string) => {
    return callGeminiText(prompt);
};

export const analyzeSalesCall = async (script: string, brandVoice: BrandVoice, fileBase64?: string, fileType?: string) => {
    const prompt = getSalesCallPrompt(script, brandVoice, !!fileBase64);
    return callGeminiJson(prompt, salesCallFullSchema, fileBase64, fileType);
};

export const analyzeSocialMediaContent = async (script: string, description: string, link: string, brandVoice: BrandVoice, fileBase64?: string, fileType?: string) => {
    const prompt = getSocialMediaPrompt(script, description, link, brandVoice);
    return callGeminiJson(prompt, socialMediaFullSchema, fileBase64, fileType);
};

export const analyzeProductAd = async (script: string, description: string, link: string, brandVoice: BrandVoice, fileBase64?: string, fileType?: string) => {
    const prompt = getProductAdPrompt(script, description, link, brandVoice);
    return callGeminiJson(prompt, productAdFullSchema, fileBase64, fileType);
};

export const analyzeVideoContent = async (fileBase64: string, fileType: string) => {
    const prompt = getVideoAnalysisPrompt();
    return callGeminiJson(prompt, videoAnalysisFullSchema, fileBase64, fileType);
};

export const transcribeMedia = async (fileBase64: string, fileType: string) => {
    const prompt = getTranscriptionPrompt();
    return callGeminiJson(prompt, transcriptionFullSchema, fileBase64, fileType);
};

export const analyzeDocument = async (script: string, description: string, fileBase64?: string, fileType?: string) => {
    const prompt = getDocumentPrompt(script, description);
    return callGeminiJson(prompt, documentFullSchema, fileBase64, fileType);
};

export const analyzeFinancialReport = async (script: string, description: string, fileBase64?: string, fileType?: string) => {
    const prompt = getFinancialReportPrompt(script, description);
    return callGeminiJson(prompt, financialReportFullSchema, fileBase64, fileType);
};

export const analyzeLiveStream = async (fileBase64: string, fileType: string) => {
    const prompt = getLiveStreamPrompt();
    return callGeminiJson(prompt, liveStreamFullSchema, fileBase64, fileType);
};

export const analyzeABTest = async (contentA: { script: string, fileBase64?: string, fileType?: string }, contentB: { script: string, fileBase64?: string, fileType?: string }) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Server API Key missing");

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [];

    if (contentA.fileBase64 && contentA.fileType) {
        parts.push(base64ToGenerativePart(contentA.fileBase64, contentA.fileType));
    }
    if (contentB.fileBase64 && contentB.fileType) {
        parts.push(base64ToGenerativePart(contentB.fileBase64, contentB.fileType));
    }

    const textPrompt = getABTestPrompt(
        contentA.fileBase64 ? `(See first uploaded file)` : contentA.script,
        contentB.fileBase64 ? `(See second uploaded file)` : contentB.script
    );
    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            responseMimeType: 'application/json',
            responseSchema: abTestFullSchema,
        },
    });

    const rawText = response.text || "{}";
    const jsonText = cleanJsonString(rawText);
    return JSON.parse(jsonText);
};

export const scoreBrandVoiceAlignment = async (text: string, brandVoice: BrandVoice) => {
    const prompt = getBrandVoiceScorePrompt(text, brandVoice);
    return callGeminiJson(prompt, brandVoiceScoreFullSchema);
};

export const analyzeAndRepurposeContent = async (script: string, fileBase64?: string, fileType?: string) => {
    const content = script || "Analyze the provided file.";
    const prompt = getRepurposeContentPrompt(content);
    return callGeminiJson(prompt, repurposeContentFullSchema, fileBase64, fileType);
};

export const analyzeThumbnail = async (fileBase64: string, fileType: string) => {
    const prompt = getThumbnailAnalysisPrompt();
    return callGeminiJson(prompt, thumbnailAnalysisFullSchema, fileBase64, fileType);
};

export const generateMonetizationAssets = async (result: any, brandVoice: BrandVoice) => {
    const prompt = getMonetizationAssetsPrompt(result, brandVoice);
    const response = await callGeminiJson(prompt, { type: Type.OBJECT, properties: { monetizationAssets: monetizationAssetsSchema } });
    return response.monetizationAssets;
};

// --- Generation Functions (Non-streaming for now) ---
// Since we are moving to backend, streaming requires SSE. 
// For simplicity in this step, we will return the full text. 
// The frontend handles text chunking, but for now we'll just await the whole thing.

export const generateImprovedContent = async (result: any, brandVoice: BrandVoice) => {
    const prompt = getImprovedContentPrompt(result, brandVoice);
    return callGeminiText(prompt);
};

export const generateSocialPost = async (result: any, platform: any) => {
    const prompt = getSocialPostPrompt(result, platform);
    return callGeminiText(prompt);
};

export const generateYouTubePost = async (result: any, brandVoice: BrandVoice) => {
    const prompt = getYouTubePostPrompt(result, brandVoice);
    // Note: Schema for YouTubePost is not strictly enforced in the Service but let's try to parse it if it returns JSON
    // The prompt asks for JSON.
    return callGeminiJson(prompt, {
        type: Type.OBJECT, properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            shortHook: { type: Type.STRING },
        }
    });
};

export const generateProductAdScript = async (result: any) => {
    const prompt = getProductAdScriptPrompt(result);
    return callGeminiText(prompt);
};

export const generateKeyTakeaways = async (result: any) => {
    const prompt = getKeyTakeawaysPrompt(result);
    const text = await callGeminiText(prompt);
    try {
        return JSON.parse(cleanJsonString(text));
    } catch {
        return [];
    }
};

export const generateDescription = async (result: any, brandVoice: BrandVoice) => {
    const prompt = getDescriptionPrompt(result, brandVoice);
    return callGeminiText(prompt);
};

export const generateViralScript = async (promptText: string, link: string, brandVoice: BrandVoice) => {
    const prompt = getViralScriptPrompt(promptText, link, brandVoice);
    return callGeminiText(prompt);
};

export const generateSocialPostFromScript = async (script: string, brandVoice: BrandVoice) => {
    const prompt = getSocialPostFromScriptPrompt(script, brandVoice);
    return callGeminiText(prompt);
};

export const brainstormVideoIdeas = async (keyword: string) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Server API Key missing");
    const ai = new GoogleGenAI({ apiKey });
    const prompt = getBrainstormIdeasPrompt(keyword);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    const rawText = response.text || "[]";
    const jsonText = cleanJsonString(rawText);
    try {
        return JSON.parse(jsonText);
    } catch {
        return [];
    }
};

export const refineTranscriptLine = async (text: string, instruction: string) => {
    const prompt = getRefineTextPrompt(text, instruction);
    return callGeminiText(prompt);
};

export const generateRetirementPlan = async (inputs: any) => {
    const prompt = getRetirementPlanPrompt(inputs);
    return await generateJson(prompt, retirementPlanSchema);
};

export const summarizeLiveSessionText = async (transcript: string) => {
    const prompt = getLiveSessionDebriefPrompt(transcript);
    return await generateText(prompt);
};
