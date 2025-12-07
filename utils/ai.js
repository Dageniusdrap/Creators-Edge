"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefineTextPrompt = exports.getMonetizationAssetsPrompt = exports.getSocialPostFromScriptPrompt = exports.getViralScriptPrompt = exports.getDescriptionPrompt = exports.getKeyTakeawaysPrompt = exports.getProductAdScriptPrompt = exports.getYouTubePostPrompt = exports.getSocialPostPrompt = exports.getImprovedContentPrompt = exports.getBrandVoiceScorePrompt = exports.getABTestPrompt = exports.getLiveStreamPrompt = exports.getFinancialReportPrompt = exports.getTranscriptionPrompt = exports.getVideoAnalysisPrompt = exports.getProductAdPrompt = exports.getSocialMediaPrompt = exports.getSalesCallPrompt = exports.getDocumentPrompt = exports.getRepurposeContentPrompt = exports.getBrainstormIdeasPrompt = exports.getThumbnailAnalysisPrompt = exports.getLiveSessionDebriefPrompt = exports.formatBrandVoice = void 0;
const formatBrandVoice = (brandVoice) => `
The user's brand voice is defined as follows. Ensure your response strictly adheres to this voice.
- Tones: ${brandVoice.tones.join(', ')}
- Target Audience: ${brandVoice.audience}
- Keywords/Jargon: ${brandVoice.keywords}
- Writing Sample: "${brandVoice.example}"
`;
exports.formatBrandVoice = formatBrandVoice;
const getLiveSessionDebriefPrompt = (transcript) => `
You are a professional presentation and speech coach. Based on the following transcript from a practice session, provide a concise and encouraging debrief.
Your response should be formatted in simple markdown.
Start with an overall summary (2-3 sentences).
Then include a section titled "## Key Strengths" with a bulleted list.
Then include a section titled "## Actionable Areas for Improvement" with a bulleted list.
Be specific but always maintain a positive and encouraging tone.

Transcript:
---
${transcript}
---
`;
exports.getLiveSessionDebriefPrompt = getLiveSessionDebriefPrompt;
const getThumbnailAnalysisPrompt = () => `
    Act as an expert YouTube strategist and graphic designer. Analyze the provided thumbnail image.
    Your analysis must be incredibly detailed, providing scores, critiques, and actionable suggestions for every field in the 'thumbnailAnalysis' part of the schema.

    - **clarity**: How quickly can a viewer understand what the video is about? Is the subject clear? Is it cluttered?
    - **emotionalImpact**: Does the thumbnail evoke curiosity, excitement, or another strong emotion? Are facial expressions effective?
    - **textReadability**: If there's text, is it large, bold, and easy to read on both mobile and desktop? Does it use minimal, high-impact words?
    - **overallScore**: A holistic score based on the above factors.
    - **improvementSuggestions**: A list of specific, actionable suggestions to improve the thumbnail's click-through rate (CTR).

    Your response MUST be a single JSON object that conforms to the schema provided.
`;
exports.getThumbnailAnalysisPrompt = getThumbnailAnalysisPrompt;
const getBrainstormIdeasPrompt = (keyword) => `
    Act as a viral video ideation expert. Brainstorm 5 compelling video ideas based on the keyword: "${keyword}".
    For each idea, provide a catchy, high-CTR title and a one-sentence concept.
    Format your response as a JSON array of strings, where each string is formatted as: "Title: Concept".
    Example: ["Epic Time-Lapse: Concept", "The Ultimate Gadget: Concept"]
`;
exports.getBrainstormIdeasPrompt = getBrainstormIdeasPrompt;
const getRepurposeContentPrompt = (content) => `
    Act as an expert content strategist and repurposing specialist for a top creator. Your task is to take a single piece of long-form content and atomize it into a suite of high-impact, multi-platform assets.

    **Source Content:**
    ---
    ${content}
    ---

    **Your Task:**
    Analyze the source content to identify the most engaging, viral, and valuable moments. Then, generate the following assets, ensuring each is tailored for its specific platform. Your response must be a single JSON object that conforms to the schema provided.

    1.  **shortFormScripts (Array of 2-3):**
        *   Identify 2-3 distinct "viral moments" or core ideas from the source content.
        *   For each, write a complete, ready-to-film script for a short-form video (TikTok, Reels, Shorts).
        *   Each script should be under 60 seconds, have a powerful hook, and a clear call-to-action.
        *   Provide a descriptive 'title' for each script idea.

    2.  **blogPost (String):**
        *   Write a well-structured, SEO-friendly summary blog post (400-600 words) based on the source content.
        *   Include a compelling title, an introduction, subheadings for key points, and a concluding paragraph.
        *   Use markdown for formatting (e.g., # Title, ## Subheading).

    3.  **linkedInPost (String):**
        *   Write a professional post for LinkedIn.
        *   Structure it with a strong opening hook, use bullet points or a short narrative to share a key insight from the content, and end with a question to encourage professional discussion.
        *   Include 3-5 relevant professional hashtags.

    4.  **twitterThread (String):**
        *   Write an engaging Twitter/X thread (3-5 tweets).
        *   The first tweet must be a powerful hook to grab attention.
        *   Each subsequent tweet should build on the last.
        *   Use line breaks and emojis to make it readable.
        *   The final tweet should summarize the point and have a call to action.
        *   Separate each tweet with "---".
`;
exports.getRepurposeContentPrompt = getRepurposeContentPrompt;
const getDocumentPrompt = (script, description) => `
    Act as a senior editor and content strategist. Analyze the following document.
    - If a file is provided, use its content. Otherwise, use the script text.
    - The user has provided this context/goal: "${description}".
    - Your analysis should be comprehensive, providing a summary, key points, tone analysis, and suggestions.
    - Adhere strictly to the 'documentAnalysis' section of the provided JSON schema for your response.
    - NEW: Calculate a Flesch-Kincaid 'readabilityScore' and grade level.
    - NEW: Provide an 'actionabilityScore' assessing how clear and actionable the document is.
    - NEW: Include a 'contentReframing' section summarizing the document for two different audiences: a technical expert and a complete beginner.
    - Ensure all fields are filled.
    ${script ? `\n\nDocument Content:\n---\n${script}` : ''}
`;
exports.getDocumentPrompt = getDocumentPrompt;
const getSalesCallPrompt = (script, brandVoice, hasFile) => {
    const basePrompt = `
        Act as an expert sales coach and a viral marketing strategist. Analyze the following sales call transcript.
        Your analysis must be extremely detailed and provide actionable coaching advice.
        ${(0, exports.formatBrandVoice)(brandVoice)}
        
        Your response MUST be a single JSON object that conforms to the schema.
        Specifically, you must:
        1.  Create a full transcript with speaker labels ('A' for salesperson, 'B' for client), text, and precise start/end timestamps.
        2.  Tag transcript entries with relevant labels like 'Action Item', 'Objection', 'Rapport Building', 'Needs Discovery', 'Viral Moment', 'Positive Sentiment', 'Negative Sentiment', 'Key Decision'.
        3.  Generate performance metrics for 'Clarity', 'Confidence', 'Client Engagement', and 'Sentiment' over time segments.
        4.  Provide 'strengths' and 'opportunities' for the feedback card.
        5.  Fill out the 'salesCallAnalysis' section in extreme detail, covering every sub-field.
        6.  Calculate the talkTimeRatio based on the transcript timestamps.
        7.  Provide creative 'viralitySuggestions' based on moments from the call.
        8.  NEW: Perform a 'questionAnalysis', counting the number of open-ended vs. closed-ended questions asked by the salesperson (Speaker A).
        9.  NEW: Generate a 'sentimentArc' for the client (Speaker B) with scores from 0-10 at the start, middle, and end of the call.
        10. NEW: Provide a 'nextStepsClarity' score and critique based on how well the call concluded.
    `;
    return hasFile
        ? `First, transcribe the provided audio/video file of a two-person sales call precisely, including timestamps for each speaker's turn. Then, using that transcript, perform the following analysis: ${basePrompt}`
        : `Analyze the provided sales call transcript: ${basePrompt}\n\nTranscript:\n---\n${script}`;
};
exports.getSalesCallPrompt = getSalesCallPrompt;
const getSocialMediaPrompt = (script, description, link, brandVoice) => `
    Act as a social media expert and virality coach. Analyze the provided content intended for a social media platform.
    ${(0, exports.formatBrandVoice)(brandVoice)}
    - Context/Description: "${description}".
    - Content Link (for context): "${link}".
    - If a file is provided, transcribe it and use that as the primary content. Otherwise, use the script text.
    - Your analysis must be incredibly detailed, providing scores, critiques, and actionable suggestions for every field in the 'socialMediaAnalysis' part of the schema.
    - The 'suggestedCaption' should be ready to copy-paste, including emojis and line breaks, and match the brand voice.
    - The 'suggestedHashtags' should be optimized for discoverability.
    - The 'viralitySuggestions' must be creative and specific.
    - Fill out all other relevant parts of the JSON schema like 'feedbackCard' and 'transcript'.
    - NEW: Provide 'abTestSuggestions' with 2 alternative hooks and 2 alternative CTAs.
    - NEW: Suggest an 'optimalPostingTime' based on the content and target audience.
    - NEW: Suggest the best 'contentFormatSuggestion' (e.g., Reel, Carousel, Static Image).
    - NEW: Provide an 'accessibility' score and critique, considering caption clarity and potential for alt text.
`;
exports.getSocialMediaPrompt = getSocialMediaPrompt;
const getProductAdPrompt = (script, description, link, brandVoice) => `
    Act as an expert ad creative director. Analyze the provided product advertisement script or video.
     ${(0, exports.formatBrandVoice)(brandVoice)}
    - Context/Goal: "${description}".
    - Content Link (for context): "${link}".
    - If a file is provided, transcribe it and use that as the primary content. Otherwise, use the script text.
    - Provide a thorough analysis covering all fields in the 'adAnalysis' section of the JSON schema.
    - Pay special attention to 'hookEffectiveness', 'ctaEffectiveness', and provide specific 'editingSuggestions' with timestamps.
    - Ensure all suggestions align with the brand voice.
    - Fill out all other relevant parts of the JSON schema.
    - NEW: Score and critique the ad's use of the 'problemSolutionFramework'.
    - NEW: Provide a 'brandMentionAnalysis' on the timing and frequency of brand mentions.
    - NEW: Suggest the best 'adPlatformSuitability' (e.g., "TikTok", "YouTube Pre-roll", "Instagram Story").
    ${script ? `\n\nAd Script:\n---\n${script}` : ''}
`;
exports.getProductAdPrompt = getProductAdPrompt;
const getVideoAnalysisPrompt = () => `
    Act as a world-class YouTube strategist and video content expert. Analyze the provided video.
    1.  First, create a precise, timestamped transcript of the video.
    2.  Then, perform an exhaustive analysis covering EVERY field in the 'videoAnalysis' section of the provided JSON schema.
    3.  Be extremely specific and actionable in your critiques and suggestions, especially for 'hookQuality', 'thumbnailSuggestion', 'ctaEffectiveness', 'editingSuggestions', and 'technicalQuality'.
    4.  The 'audienceRetentionPrediction' should identify specific potential drop-off points with clear reasons.
    5.  The 'viralityCurve' should be a realistic prediction of views over time.
    6.  The 'suggestedTitles', 'suggestedDescription', and 'suggestedTags' should be fully optimized for SEO and click-through rate.
    7.  Fill out all other relevant parts of the JSON schema, including 'feedbackCard'.
`;
exports.getVideoAnalysisPrompt = getVideoAnalysisPrompt;
const getTranscriptionPrompt = () => `
    Your primary function is to transcribe the provided video with high accuracy, including speaker labels (if discernible) and precise start/end timestamps for each segment.
    Your secondary function is to provide a brief summary and a list of key takeaways based on the transcript.
    - Generate a full 'transcript' array.
    - Generate a 'documentAnalysis' object containing the summary and key points.
    - Generate a 'feedbackCard' with strengths and opportunities based on the content's structure and clarity.
    - Populate ONLY these three fields in the JSON response: 'transcript', 'documentAnalysis', 'feedbackCard'.
`;
exports.getTranscriptionPrompt = getTranscriptionPrompt;
const getFinancialReportPrompt = (script, description) => `
    Act as a senior financial analyst with a skeptical eye. Analyze the provided financial document (e.g., earnings report, market analysis).
    - Context: "${description}".
    - Use the file content if provided, otherwise use the text script.
    - Your response must strictly follow the 'financialReportAnalysis' schema.
    - Extract and analyze the 3-5 most important 'keyMetrics'.
    - Determine the 'overallSentiment' and justify it in 'sentimentAnalysis'.
    - Identify key risks and opportunities.
    - Provide a concise executive 'summary'.
    - NEW: Actively search for and list any potential 'redFlags' in the report (e.g., vague language, declining margins, unusual accounting). If none, return an empty array.
    - NEW: Provide an 'eli5Summary' (Explain Like I'm 5) of the report's main conclusion.
    - NEW: Provide a 'forwardLookingAnalysis' of the guidance or outlook section, noting its tone and summarizing its content.
    - Fill out all other relevant parts of the JSON schema.
    ${script ? `\n\nDocument Content:\n---\n${script}` : ''}
`;
exports.getFinancialReportPrompt = getFinancialReportPrompt;
const getLiveStreamPrompt = () => `
    Act as a live stream growth consultant. First, transcribe the provided live stream recording. Then, using the transcript, analyze it for engagement and strategy.
    - Your response must fill out the 'liveStreamAnalysis' section of the JSON schema.
    - Identify 'peakEngagementMoments' based on speech patterns, excitement, or key questions.
    - Determine the 'averageViewerSentiment'.
    - Analyze the 'pacingAndFlow' and 'audienceInteraction'.
    - List 'keyTakeaways' and 'monetizationOpportunities'.
    - Provide an 'overallScore'.
    - Also generate the 'transcript' and 'feedbackCard' sections.
`;
exports.getLiveStreamPrompt = getLiveStreamPrompt;
const getABTestPrompt = (contentA, contentB) => `
    Act as an expert content strategist. You will be given two pieces of content, "Content A" and "Content B".
    Your task is to perform a detailed A/B test analysis.

    - Analyze each piece of content individually for its overall quality, hook, clarity, and potential for engagement.
    - Compare them head-to-head in the 'comparisonSummary'.
    - Declare a 'winner' ('Content A' or 'Content B') and provide clear 'reasoning'.
    - Create a 'hybridSuggestion' that combines the best elements of both.
    - Provide 'feedbackCard' data summarizing strengths and opportunities across both pieces.
    - Your response MUST be a single JSON object that conforms to the schema provided.

    Content A:
    ---
    ${contentA}
    ---

    Content B:
    ---
    ${contentB}
    ---
`;
exports.getABTestPrompt = getABTestPrompt;
const getBrandVoiceScorePrompt = (text, brandVoice) => `
    Act as a brand strategist. Analyze the following text to determine how well it aligns with the user's defined brand voice.
    
    ${(0, exports.formatBrandVoice)(brandVoice)}

    **Text to Analyze:**
    ---
    ${text}
    ---

    **Task:**
    Your response must be a single JSON object.
    1.  Provide a 'score' from 0.0 to 10.0 indicating the level of alignment.
    2.  Provide a concise 'analysis' explaining the score, noting what aligns well and what could be improved.
`;
exports.getBrandVoiceScorePrompt = getBrandVoiceScorePrompt;
// --- Generation Prompts ---
const getImprovedContentPrompt = (result, brandVoice) => {
    const originalContent = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    const feedback = `Strengths: ${result.feedbackCard.strengths.join('. ')}. Opportunities: ${result.feedbackCard.opportunities.join('. ')}.`;
    return `
        Rewrite the following content based on the provided feedback, ensuring it matches the specified brand voice.

        ${(0, exports.formatBrandVoice)(brandVoice)}
        
        **AI Feedback:** ${feedback}

        **Original Content:**
        ---
        ${originalContent}
        ---

        **Task:** Provide only the rewritten, improved content as raw text. Do not use JSON.
    `;
};
exports.getImprovedContentPrompt = getImprovedContentPrompt;
const getSocialPostPrompt = (result, platform) => {
    const content = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    return `
    Based on the following content, create an engaging social media post for ${platform}. 
    Adapt the tone, length, and format appropriately for that platform. 
    - For X (formerly Twitter), be concise and punchy, use 2-3 relevant hashtags, and include a strong call-to-action.
    - For LinkedIn, be professional and insightful, structure with bullet points or a short story, use 3-5 professional hashtags, and pose a question to the audience.
    - For Instagram, write a visually descriptive and engaging caption, include a mix of 5-10 popular and niche hashtags, and encourage sharing or saving.

    Content:\n${content}\n\n**Task:** Provide only the social media post as raw text. Do not use JSON.`;
};
exports.getSocialPostPrompt = getSocialPostPrompt;
const getYouTubePostPrompt = (result, brandVoice) => {
    const content = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    const videoTitle = result.videoAnalysis?.suggestedTitles?.[0] || '';
    const suggestedDescription = result.videoAnalysis?.suggestedDescription || '';
    const suggestedTags = result.videoAnalysis?.suggestedTags?.join(', ') || '';
    return `
        Act as a professional YouTube strategist and content marketer.
        Based on the following content, existing analysis, and brand voice, generate an optimized YouTube post.
        
        ${(0, exports.formatBrandVoice)(brandVoice)}

        **Content & Analysis Summary:**
        ---
        ${content}
        ${videoTitle ? `\nOriginal Video Title Context: ${videoTitle}` : ''}
        ${suggestedDescription ? `\nOriginal Description Context: ${suggestedDescription}` : ''}
        ${suggestedTags ? `\nOriginal Tags Context: ${suggestedTags}` : ''}
        ---
        
        **Your Task:**
        Generate a JSON object for a YouTube post that includes:
        -   **title:** A catchy, SEO-optimized title for a YouTube video. (Max 70 characters)
        -   **description:** A detailed, engaging, and SEO-friendly description for the YouTube video. Include a hook, key takeaways, and a call to action. Use markdown for basic formatting if needed. (Max 5000 characters)
        -   **tags:** A list of 5-10 relevant and high-performing YouTube tags (keywords).
        -   **shortHook:** A very short, attention-grabbing phrase (1-2 sentences) suitable for a YouTube Short or Reel using this content.

        Your response MUST be a single JSON object that conforms to the provided schema.
    `;
};
exports.getYouTubePostPrompt = getYouTubePostPrompt;
const getProductAdScriptPrompt = (result) => {
    const content = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    return `Turn the key ideas from the following content into a script for a 30-second product advertisement video.\n\nContent:\n${content}\n\n**Task:** Provide only the ad script as raw text. Do not use JSON.`;
};
exports.getProductAdScriptPrompt = getProductAdScriptPrompt;
const getKeyTakeawaysPrompt = (result) => {
    const content = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    return `Extract the 3-5 most important key takeaways from the following content. Respond ONLY with a JSON array of strings (e.g., ["Takeaway 1", "Takeaway 2"]).\n\nContent:\n${content}`;
};
exports.getKeyTakeawaysPrompt = getKeyTakeawaysPrompt;
const getDescriptionPrompt = (result, brandVoice) => {
    const content = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    return `Write a compelling, SEO-friendly description for a YouTube video or podcast episode based on the following content. Match the specified brand voice.\n\n${(0, exports.formatBrandVoice)(brandVoice)}\n\n**Content:**\n${content}\n\n**Task:** Provide only the description as raw text. Do not use JSON.`;
};
exports.getDescriptionPrompt = getDescriptionPrompt;
const getViralScriptPrompt = (prompt, link, brandVoice) => `
    As a viral marketing expert, create a script for a short, engaging video based on the following prompt.
    The script should have a strong hook, be highly shareable, and align with the brand voice.
    
    ${(0, exports.formatBrandVoice)(brandVoice)}
    Prompt: "${prompt}"
    ${link ? `Inspiration Link for context: ${link}` : ''}

    Your output MUST be a markdown-formatted script including these sections:
    - ## 1. Clickable Titles (3 options)
    - ## 2. SEO Description
    - ## 3. Discoverability Tags
    - ## 4. Thumbnail Concepts (2-3 ideas)
    - ## 5. Engaging Video Script (with scene descriptions, e.g., "[SCENE: A close up on a laptop screen...]")
    - ## 6. Frame Flow / Storyboard (as a numbered list of scenes, e.g., "1. A wide shot of...")
    - ## 7. Monetization Strategy
    
    Do not wrap the output in a JSON object. Return only the raw markdown text.
`;
exports.getViralScriptPrompt = getViralScriptPrompt;
const getSocialPostFromScriptPrompt = (script, brandVoice) => `
    Based on the following video script, write an engaging social media post (e.g., for X/Twitter or LinkedIn) to promote it.
    The post should be concise, include a hook, and a few relevant hashtags.
    It must match the specified brand voice.

    ${(0, exports.formatBrandVoice)(brandVoice)}

    **Video Script:**
    ---
    ${script}
    ---

    **Task:** Provide only the social media post as raw text. Do not use JSON.
`;
exports.getSocialPostFromScriptPrompt = getSocialPostFromScriptPrompt;
const getMonetizationAssetsPrompt = (result, brandVoice) => {
    const content = result.transcript?.map(t => t.text).join('\n') || result.documentAnalysis?.summary || '';
    return `
        Based on the following content, generate a "Monetization Assist" toolkit for a content creator.
        Your response must be a JSON object conforming to the provided schema.
        
        ${(0, exports.formatBrandVoice)(brandVoice)}

        **Content/Analysis Summary:**
        ---
        ${content}
        ---

        **Task:** Generate the following assets:
        1.  **sponsorPitch:** A professional, concise email to a potential sponsor that is ready to be sent.
        2.  **affiliateCopy:** A short, punchy paragraph for an affiliate link, suitable for a video description.
        3.  **merchandiseIdeas:** A list of 3 creative, specific merchandise ideas related to the content.
    `;
};
exports.getMonetizationAssetsPrompt = getMonetizationAssetsPrompt;
const getRefineTextPrompt = (text, instruction) => `
    Rewrite the following text based on the instruction.
    Instruction: "${instruction}"
    Text: "${text}"
    
    Provide ONLY the rewritten text. Do not add any extra commentary or formatting.
`;
exports.getRefineTextPrompt = getRefineTextPrompt;
