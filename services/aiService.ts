
import { GoogleGenAI, Modality, Type, VideoGenerationReferenceType } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import { pcmToMp3Blob, decode } from '../utils/audio';
import {
  AnalysisResult,
  VoiceoverScript,
  RetirementPlan,
  BrandVoice,
  SocialPlatform,
  MonetizationAssets,
  BrandVoiceScoreAnalysis,
  YouTubePost,
  AbortError // IMPORTED
} from "../types";
import {
    getSalesCallPrompt,
    getSocialMediaPrompt,
    getProductAdPrompt,
    getVideoAnalysisPrompt,
    getTranscriptionPrompt,
    getDocumentPrompt,
    getFinancialReportPrompt,
    getLiveStreamPrompt,
    getImprovedContentPrompt,
    getSocialPostPrompt,
    getProductAdScriptPrompt,
    getKeyTakeawaysPrompt,
    getDescriptionPrompt,
    getViralScriptPrompt,
    getSocialPostFromScriptPrompt,
    getABTestPrompt,
    getMonetizationAssetsPrompt,
    getRefineTextPrompt,
    getBrandVoiceScorePrompt,
    getRepurposeContentPrompt,
    getThumbnailAnalysisPrompt,
    getBrainstormIdeasPrompt,
    getLiveSessionDebriefPrompt,
    getYouTubePostPrompt,
} from '../utils/ai';
import {
    salesCallFullSchema,
    socialMediaFullSchema,
    productAdFullSchema,
    videoAnalysisFullSchema,
    transcriptionFullSchema,
    documentFullSchema,
    financialReportFullSchema,
    liveStreamFullSchema,
    retirementPlanSchema,
    abTestFullSchema,
    monetizationAssetsSchema,
    brandVoiceScoreFullSchema,
    repurposeContentFullSchema,
    thumbnailAnalysisFullSchema,
    youTubePostSchema,
} from '../utils/schemas';

// --- Helper: Securely get API Key ---
const getApiKey = (): string => {
  // Try Vite environment variable first (standard for production)
  // Use optional chaining to avoid runtime errors if import.meta.env is missing
  if ((import.meta as any)?.env?.VITE_API_KEY) {
      return (import.meta as any).env.VITE_API_KEY;
  }
  // Fallback to process.env (mostly for local dev if configured that way)
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
  }
  return '';
};

// Ensure Key Check wrapper
const withApiKey = <T>(fn: () => Promise<T>): Promise<T> => {
    const key = getApiKey();
    if (!key) {
        return Promise.reject(new Error("API Key is missing. Please configure VITE_API_KEY in your environment."));
    }
    return fn();
};


// --- Helper Functions ---

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  let mimeType = file.type;
  
  // Fallback for missing MIME types or specific cases not handled by browser
  if (!mimeType || mimeType === '') {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'md') mimeType = 'text/plain';
      else if (ext === 'm4a') mimeType = 'audio/mp4';
      else if (ext === 'mp3') mimeType = 'audio/mpeg';
      else if (ext === 'wav') mimeType = 'audio/wav';
      else if (ext === 'mp4') mimeType = 'video/mp4';
      else if (ext === 'pdf') mimeType = 'application/pdf';
      else mimeType = 'text/plain'; // Default fallback
  }

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: mimeType,
    },
  };
};

const cleanJsonString = (text: string): string => {
    if (!text) return "{}";

    // First, check for markdown code blocks which are the most common cause of issues
    const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(markdownRegex);
    
    if (match && match[1]) {
        text = match[1].trim();
    }

    // 1. Try to find the first '[' or '{' and the last ']' or '}'
    const firstBracket = text.indexOf('{');
    const firstSquare = text.indexOf('[');
    
    let startIndex = -1;
    if (firstBracket !== -1 && firstSquare !== -1) {
        startIndex = Math.min(firstBracket, firstSquare);
    } else if (firstBracket !== -1) {
        startIndex = firstBracket;
    } else if (firstSquare !== -1) {
        startIndex = firstSquare;
    }

    if (startIndex === -1) return text.trim(); // No JSON found, return original

    const lastBracket = text.lastIndexOf('}');
    const lastSquare = text.lastIndexOf(']');
    
    let endIndex = -1;
    if (lastBracket !== -1 && lastSquare !== -1) {
        endIndex = Math.max(lastBracket, lastSquare);
    } else if (lastBracket !== -1) {
        endIndex = lastBracket;
    } else if (lastSquare !== -1) {
        endIndex = lastSquare;
    }

    if (endIndex === -1 || endIndex < startIndex) return text.trim();

    return text.substring(startIndex, endIndex + 1);
};

const callGeminiJson = async (signal: AbortSignal, prompt: string, schema: any, file?: File): Promise<any> => {
  return withApiKey(async () => {
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      const parts: any[] = [{ text: prompt }];
      if (file) {
        parts.unshift(await fileToGenerativePart(file));
      }

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts },
          config: {
              responseMimeType: 'application/json',
              responseSchema: schema,
          },
      });

      if (signal.aborted) throw new AbortError('Operation aborted');

      const rawText = response.text || "{}";
      const jsonText = cleanJsonString(rawText);
      
      try {
          return JSON.parse(jsonText);
      } catch (e) {
          console.error("Failed to parse JSON from Gemini:", rawText);
          throw new Error("AI returned invalid JSON format. Please try again.");
      }
  });
};

const callGeminiStream = async (signal: AbortSignal, prompt: string, onChunk: (chunk: string) => void): Promise<void> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const stream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        for await (const chunk of stream) {
            if (signal.aborted) throw new AbortError('Operation aborted');
            onChunk(chunk.text || '');
        }
    });
};

const callGeminiText = async (signal: AbortSignal, prompt: string): Promise<string> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        if (signal.aborted) throw new AbortError('Operation aborted');
        return response.text || '';
    });
};

// --- Analysis Functions ---

export const summarizeLiveSession = (signal: AbortSignal, fullTranscript: string, onChunk: (chunk: string) => void) => {
    const prompt = getLiveSessionDebriefPrompt(fullTranscript);
    return callGeminiStream(signal, prompt, onChunk);
};

export const analyzeThumbnail = (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const prompt = getThumbnailAnalysisPrompt();
    return callGeminiJson(signal, prompt, thumbnailAnalysisFullSchema, file);
};

export const analyzeAndRepurposeContent = (signal: AbortSignal, script: string, file?: File): Promise<AnalysisResult> => {
    const content = script || "Analyze the provided file.";
    const prompt = getRepurposeContentPrompt(content);
    return callGeminiJson(signal, prompt, repurposeContentFullSchema, file);
}

export const analyzeSalesCall = (signal: AbortSignal, script: string, brandVoice: BrandVoice, file?: File): Promise<AnalysisResult> => {
  const prompt = getSalesCallPrompt(script, brandVoice, !!file);
  return callGeminiJson(signal, prompt, salesCallFullSchema, file);
};
export const analyzeSocialMediaContent = (signal: AbortSignal, script: string, description: string, link: string, brandVoice: BrandVoice, file?: File): Promise<AnalysisResult> => {
    const prompt = getSocialMediaPrompt(script, description, link, brandVoice);
    return callGeminiJson(signal, prompt, socialMediaFullSchema, file);
}
export const analyzeProductAd = (signal: AbortSignal, script: string, description: string, link: string, brandVoice: BrandVoice, file?: File): Promise<AnalysisResult> => {
    const prompt = getProductAdPrompt(script, description, link, brandVoice);
    return callGeminiJson(signal, prompt, productAdFullSchema, file);
}
export const analyzeVideoContent = (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const prompt = getVideoAnalysisPrompt();
    return callGeminiJson(signal, prompt, videoAnalysisFullSchema, file);
}
export const transcribeMedia = (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const prompt = getTranscriptionPrompt();
    return callGeminiJson(signal, prompt, transcriptionFullSchema, file);
}
export const analyzeDocument = (signal: AbortSignal, script: string, description: string, file?: File): Promise<AnalysisResult> => {
    const prompt = getDocumentPrompt(script, description);
    return callGeminiJson(signal, prompt, documentFullSchema, file);
}
export const analyzeFinancialReport = (signal: AbortSignal, script: string, description: string, file?: File): Promise<AnalysisResult> => {
    const prompt = getFinancialReportPrompt(script, description);
    return callGeminiJson(signal, prompt, financialReportFullSchema, file);
}
export const analyzeLiveStream = (signal: AbortSignal, file: File): Promise<AnalysisResult> => {
    const prompt = getLiveStreamPrompt();
    return callGeminiJson(signal, prompt, liveStreamFullSchema, file);
}
type ABTestInput = { script: string; file?: File };

export const analyzeABTest = async (signal: AbortSignal, contentA: ABTestInput, contentB: ABTestInput): Promise<AnalysisResult> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const parts: any[] = [];

        if (contentA.file) {
            parts.push(await fileToGenerativePart(contentA.file));
        }
        if (contentB.file) {
            parts.push(await fileToGenerativePart(contentB.file));
        }
        
        const textPrompt = getABTestPrompt(
            contentA.file ? `(See first uploaded file: ${contentA.file.name})` : contentA.script,
            contentB.file ? `(See second uploaded file: ${contentB.file.name})` : contentB.script
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

        if (signal.aborted) throw new AbortError('Operation aborted');

        const rawText = response.text || "{}";
        const jsonText = cleanJsonString(rawText);
        return JSON.parse(jsonText);
    });
};

export const scoreBrandVoiceAlignment = (signal: AbortSignal, text: string, brandVoice: BrandVoice): Promise<AnalysisResult> => {
    const prompt = getBrandVoiceScorePrompt(text, brandVoice);
    return callGeminiJson(signal, prompt, brandVoiceScoreFullSchema);
};


// --- Generation Functions ---

export const brainstormVideoIdeas = async (signal: AbortSignal, keyword: string): Promise<string[]> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const prompt = getBrainstormIdeasPrompt(keyword);
        
        const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
        });

        if (signal.aborted) throw new AbortError('Operation aborted');

        const rawText = response.text || "[]";
        const jsonText = cleanJsonString(rawText);
        try {
            const ideas = JSON.parse(jsonText);
            if (Array.isArray(ideas) && ideas.every(item => typeof item === 'string')) {
                return ideas;
            }
            throw new Error("AI returned data in an unexpected format.");
        } catch (e) {
            console.error("Failed to parse brainstorm ideas JSON:", jsonText, e);
            throw new Error("Failed to get video ideas from AI.");
        }
    });
};

export const generateImprovedContent = (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const prompt = getImprovedContentPrompt(result, brandVoice);
    return callGeminiStream(signal, prompt, onChunk);
};
export const generateSocialPost = (signal: AbortSignal, result: AnalysisResult, platform: SocialPlatform, onChunk: (chunk: string) => void) => {
    const prompt = getSocialPostPrompt(result, platform);
    return callGeminiStream(signal, prompt, onChunk);
};

export const generateYouTubePost = async (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice): Promise<YouTubePost> => {
    const prompt = getYouTubePostPrompt(result, brandVoice);
    return callGeminiJson(signal, prompt, youTubePostSchema);
};

export const generateProductAd = (signal: AbortSignal, result: AnalysisResult, onChunk: (chunk: string) => void) => {
    const prompt = getProductAdScriptPrompt(result);
    return callGeminiStream(signal, prompt, onChunk);
};
export const generateKeyTakeaways = async (signal: AbortSignal, result: AnalysisResult): Promise<string[]> => {
    const prompt = getKeyTakeawaysPrompt(result);
    const jsonString = await callGeminiText(signal, prompt);
    const cleanString = cleanJsonString(jsonString);
    try {
        return JSON.parse(cleanString);
    } catch (e) {
        console.error("Failed to parse key takeaways JSON:", cleanString);
        throw new Error("AI returned invalid JSON for key takeaways.");
    }
};

export const generateDescription = (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const prompt = getDescriptionPrompt(result, brandVoice);
    return callGeminiStream(signal, prompt, onChunk);
};

export const generateViralScript = (signal: AbortSignal, prompt: string, link: string, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const p = getViralScriptPrompt(prompt, link, brandVoice);
    return callGeminiStream(signal, p, onChunk);
};

export const generateSocialPostFromScript = (signal: AbortSignal, script: string, brandVoice: BrandVoice, onChunk: (chunk: string) => void) => {
    const prompt = getSocialPostFromScriptPrompt(script, brandVoice);
    return callGeminiStream(signal, prompt, onChunk);
};

export const generateRetirementPlan = (signal: AbortSignal, inputs: any): Promise<RetirementPlan> => {
    const prompt = `
        Analyze the following user data and generate a retirement plan. Your response must be a JSON object conforming to the retirementPlanSchema.
        User data: ${JSON.stringify(inputs)}
        Assume a ${inputs.investmentStyle === 'Conservative' ? '4%' : inputs.investmentStyle === 'Moderate' ? '6%' : '8%'} annual return on investment.
    `;
    return callGeminiJson(signal, prompt, {type: Type.OBJECT, properties: retirementPlanSchema.properties});
};

export const generateImage = async (signal: AbortSignal, prompt: string, model: string, aspectRatio: string, mimeType: string, negativePrompt?: string): Promise<string> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        let base64ImageBytes: string;
        let finalMimeType = mimeType;
        
        let fullPrompt = prompt;
        if (negativePrompt && negativePrompt.trim()) {
            fullPrompt += `\n\nNegative prompt: ${negativePrompt.trim()}`;
        }

        if (model === 'imagen-4.0-generate-001') {
            const response = await ai.models.generateImages({
                model,
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: mimeType,
                    aspectRatio: aspectRatio,
                },
            });
            if (signal.aborted) throw new AbortError('Operation aborted');
            base64ImageBytes = response.generatedImages[0].image.imageBytes;
        } else { // gemini-2.5-flash-image
            const response = await ai.models.generateContent({
                model,
                contents: { parts: [{ text: fullPrompt }] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            if (signal.aborted) throw new AbortError('Operation aborted');
            const part = response.candidates![0].content.parts.find(p => p.inlineData);
            if (!part || !part.inlineData) throw new Error("No image data in response");
            base64ImageBytes = part.inlineData.data;
            finalMimeType = part.inlineData.mimeType;
        }
        return `data:${finalMimeType};base64,${base64ImageBytes}`;
    });
};

export const editImage = async (signal: AbortSignal, base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: { responseModalities: [Modality.IMAGE] },
        });

        if (signal.aborted) throw new AbortError('Operation aborted');
        const part = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
        if (!part || !part.inlineData) throw new Error("No image data returned from API.");
        
        const newBase64 = part.inlineData.data;
        const newMimeType = part.inlineData.mimeType;
        return `data:${newMimeType};base64,${newBase64}`;
    });
};

export const generateSpeechFromText = async (signal: AbortSignal, text: string, voice: string, style: string): Promise<Blob> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const promptText = style && style !== 'Default' ? `Say with a ${style.toLowerCase()} tone: ${text}` : text;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: promptText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                    },
                },
            },
        });
        if (signal.aborted) throw new AbortError('Operation aborted');
        const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioBase64) throw new Error("No audio data in response");
        const audioBytes = decode(audioBase64);
        return pcmToMp3Blob(new Int16Array(audioBytes.buffer), 24000, 1);
    });
};

export const generateSpeech = async (signal: AbortSignal, scripts: VoiceoverScript[]): Promise<string | null> => {
    return withApiKey(async () => {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        if (scripts.length > 2) throw new Error("Multi-speaker TTS supports a maximum of 2 speakers.");
        
        let response: GenerateContentResponse;
        if (scripts.length === 2) {
            const prompt = `TTS the following conversation between ${scripts[0].speaker} and ${scripts[1].speaker}:\n` +
                scripts.map(s => `${s.speaker}: ${s.script}`).join('\n');
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        multiSpeakerVoiceConfig: {
                            speakerVoiceConfigs: scripts.map(s => ({
                                speaker: s.speaker,
                                voiceConfig: { prebuiltVoiceConfig: { voiceName: s.voice } }
                            }))
                        }
                    }
                }
            });
        } else {
            const script = scripts[0];
            const promptText = script.style && script.style !== 'Default'
                ? `Say with a ${script.style.toLowerCase()} tone: ${script.script}`
                : script.script;
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: promptText }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: script.voice } } },
                },
            });
        }

        if (signal.aborted) throw new AbortError('Operation aborted');
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    });
};

export const generateVideo = async (signal: AbortSignal, prompt: string, model: string, aspectRatio: string, resolution: string, frames: File[]) => {
    return withApiKey(async () => {
        // Instantiate AI client just-in-time to ensure latest API key is used
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        
        // Strict defensive check for frames to prevent crashes if malformed data is passed
        const safeFrames = Array.isArray(frames) ? frames : [];

        const generationConfig: any = {
            numberOfVideos: 1,
            resolution,
            aspectRatio,
        };

        let imagePayload: any = {};
        if (safeFrames.length === 1) {
            imagePayload = { image: { imageBytes: await fileToBase64(safeFrames[0]), mimeType: safeFrames[0].type } };
        } else if (safeFrames.length === 2) {
            imagePayload = { image: { imageBytes: await fileToBase64(safeFrames[0]), mimeType: safeFrames[0].type } };
            generationConfig.lastFrame = { image: { imageBytes: await fileToBase64(safeFrames[1]), mimeType: safeFrames[1].type } };
        } else if (safeFrames.length > 2) {
            generationConfig.referenceImages = await Promise.all(safeFrames.map(async file => ({
                image: { imageBytes: await fileToBase64(file), mimeType: file.type },
                referenceType: VideoGenerationReferenceType.ASSET,
            })));
        }
        
        let operation = await ai.models.generateVideos({
            model: safeFrames.length > 2 ? 'veo-3.1-generate-preview' : model,
            prompt,
            ...imagePayload,
            config: generationConfig,
        });
        
        while (!operation.done) {
            if (signal.aborted) throw new AbortError('Video generation aborted by user.'); // Check for abortion
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (signal.aborted) throw new AbortError('Video generation aborted by user.');

        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message || 'Unknown error from Veo API'}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Video generation failed, no download link found.");

        // Pass signal to fetch
        const response = await fetch(`${downloadLink}&key=${getApiKey()}`, { signal });
        if (!response.ok) throw new Error("Failed to download generated video.");
        
        const videoBlob = await response.blob();
        
        return {
            url: URL.createObjectURL(videoBlob),
            payload: operation.response?.generatedVideos?.[0]?.video
        };
    });
};

export const extendVideo = async (signal: AbortSignal, prompt: string, previousOperation: any) => {
    return withApiKey(async () => {
        // Instantiate AI client just-in-time to ensure latest API key is used
        const ai = new GoogleGenAI({ apiKey: getApiKey() });

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-generate-preview',
            prompt,
            video: previousOperation,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: previousOperation?.aspectRatio,
            }
        });
        while (!operation.done) {
            if (signal.aborted) throw new AbortError('Video extension aborted by user.'); // Check for abortion
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (signal.aborted) throw new AbortError('Video extension aborted by user.');

        if (operation.error) {
            throw new Error(`Video extension failed: ${operation.error.message || 'Unknown error from Veo API'}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Video extension failed, no download link found.");

        // Pass signal to fetch
        const response = await fetch(`${downloadLink}&key=${getApiKey()}`, { signal });
        if (!response.ok) throw new Error("Failed to download extended video.");
        
        const videoBlob = await response.blob();
        
        return {
            url: URL.createObjectURL(videoBlob),
            payload: operation.response?.generatedVideos?.[0]?.video
        };
    });
};

export const generateMonetizationAssets = async (signal: AbortSignal, result: AnalysisResult, brandVoice: BrandVoice): Promise<MonetizationAssets> => {
    const prompt = getMonetizationAssetsPrompt(result, brandVoice);
    const response = await callGeminiJson(signal, prompt, {type: Type.OBJECT, properties: { monetizationAssets: monetizationAssetsSchema }});
    return response.monetizationAssets;
};

export const refineTranscriptLine = async (signal: AbortSignal, text: string, instruction: string): Promise<string> => {
    const prompt = getRefineTextPrompt(text, instruction);
    return await callGeminiText(signal, prompt);
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};
