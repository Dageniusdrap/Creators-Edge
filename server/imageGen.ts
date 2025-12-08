
import * as fal from "@fal-ai/serverless-client";
import axios from 'axios';
import FormData from 'form-data';

// --- Environment Variables ---
const FAL_KEY = process.env.FAL_KEY;
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// --- Provider Implementations ---

// 1. Fal.ai (Primary - FLUX.1 models)
const generateFalImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    if (!FAL_KEY) throw new Error("FAL_KEY missing");

    // Map aspect ratio descriptive string to image_size object or string
    let imageSize = "square_hd"; // default
    if (aspectRatio === '16:9') imageSize = "landscape_16_9";
    if (aspectRatio === '9:16') imageSize = "portrait_16_9";
    if (aspectRatio === '4:3') imageSize = "landscape_4_3";
    if (aspectRatio === '3:4') imageSize = "portrait_4_3";

    try {
        const result: any = await fal.subscribe("fal-ai/flux/schnell", {
            input: {
                prompt: prompt,
                image_size: imageSize,
                num_inference_steps: 4, // 1-4 for Schnell
                safety_tolerance: "2", // Flexible safety
            },
            logs: true,
            onQueueUpdate: (update: any) => {
                if (update.status === 'IN_PROGRESS') {
                    console.log("[Fal.ai] Generating...");
                }
            },
        });

        if (result.images && result.images.length > 0) {
            return result.images[0].url;
        }
        throw new Error("No image returned from Fal.ai");
    } catch (error: any) {
        console.error("Fal.ai Error:", error);
        throw error;
    }
};

// 2. Stability AI (Fallback 1 - Core Model)
const generateStabilityImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    if (!STABILITY_API_KEY) throw new Error("STABILITY_API_KEY missing");

    const payload = {
        prompt,
        output_format: "webp",
        aspect_ratio: aspectRatio || "1:1"
    };

    const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/core`,
        axios.toFormData(payload, new FormData()),
        {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${STABILITY_API_KEY}`,
                Accept: "image/*"
            },
        },
    );

    if (response.status === 200) {
        // Convert buffer to base64 data URI
        const base64Info = Buffer.from(response.data).toString('base64');
        return `data:image/webp;base64,${base64Info}`;
    } else {
        throw new Error(`Stability AI Error: ${response.status}: ${response.data.toString()}`);
    }
};

// 3. Hugging Face (Fallback 2 - FLUX.1-schnell Serverless)
const generateHuggingFaceImage = async (prompt: string): Promise<string> => {
    // Note: HF Free tier doesn't support extensive params usually, just prompt
    const modelId = "black-forest-labs/FLUX.1-schnell";
    const apiKey = HUGGINGFACE_API_KEY;
    // Allow trying without key for public rate limits if key is missing, though unlikely to work well

    const headers: any = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelId}`,
        {
            headers,
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face Error: ${error}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
};

// --- Main Switcher ---

export const generateImageMultiProvider = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
    let lastError = null;

    // 1. Try Fal.ai
    if (FAL_KEY) {
        try {
            console.log("Attempting generation with Fal.ai...");
            return await generateFalImage(prompt, aspectRatio);
        } catch (e: any) {
            console.warn("Fal.ai failed, switching provider...", e.message);
            lastError = e;
        }
    }

    // 2. Try Stability AI
    if (STABILITY_API_KEY) {
        try {
            console.log("Attempting generation with Stability AI...");
            return await generateStabilityImage(prompt, aspectRatio);
        } catch (e: any) {
            console.warn("Stability AI failed, switching provider...", e.message);
            lastError = e;
        }
    }

    // 3. Try Hugging Face
    // (We permit trying HF even if key is missing as it allows some anon usage, but better with key)
    try {
        console.log("Attempting generation with Hugging Face...");
        return await generateHuggingFaceImage(prompt);
    } catch (e: any) {
        console.warn("Hugging Face failed.", e.message);
        lastError = e;
    }

    throw new Error(`All image generation providers failed. Last error: ${lastError?.message || 'Unknown'}`);
};
