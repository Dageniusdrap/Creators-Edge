import React from 'react';

export type AppAnalysisType = 'salesCall' | 'socialMedia' | 'productAd' | 'contentGeneration' | 'brandVoice' | 'pricing' | 'videoAnalysis' | 'documentAnalysis' | 'liveStream' | 'retirementPlanner' | 'liveDebugger' | 'financialReport' | 'transcription' | 'abTest' | 'brandVoiceScore' | 'repurposeContent' | 'thumbnailAnalysis' | 'apiKeys';

// Define GenerationType
export type GenerationType = 'script' | 'image' | 'video' | 'speech';

// Add 'home' to the AnalysisType union
export type AnalysisType = AppAnalysisType | 'home';

export interface SuggestedAction {
    label: string;
    action: 'generate_social' | 'generate_ad' | 'brainstorm_hooks' | 'refine_cta' | 'repurpose' | 'generate_script';
    payload?: any;
}

export interface TranscriptEntry {
    speaker: string;
    text: string;
    startTime?: number;
    endTime?: number;
    tags?: string[];
}

export interface PerformanceScore {
    metric: string;
    value: number;
}

export interface PerformanceMetricPoint {
    label: string;
    scores: PerformanceScore[];
}

export interface FeedbackCardData {
    strengths: string[];
    opportunities: string[];
}

export interface AudioAnalysis {
    qualityScore: number;
    qualityCritique: string;
    qualitySuggestion: string;
    pacingWPM: number;
    fillerWordCount: number;
    sentiment: string;
}

export interface SpeechAnalysis {
    pacingWPM: number;
    fillerWordCount: number;
    dominantTone: string;
}

export interface KeywordAnalysis {
    keywords: string[];
    topics: string[];
}

export interface MomentsSummary {
    objections: number;
    actionItems: number;
    keyDecisions: number;
}

export interface AudienceRetentionPredictionPoint {
    timeLabel: string;
    retentionPercent: number;
    reason: string;
}

export interface ViralityCurvePoint {
    timeLabel: string; // e.g., "1h", "6h", "24h", "7d"
    predictedViews: number;
}

export interface SalesCallAnalysis {
    summary: string;
    overallPerformance: string;
    rapportBuilding: string;
    needsDiscovery: string;
    productPresentation: string;
    objectionHandling: string;
    closingEffectiveness: string;
    clarityScore: number;
    confidenceScore: number;
    speechAnalyses?: { [speakerId: string]: SpeechAnalysis };
    strengths: string[];
    weaknesses: string[];
    areasOfImprovement: string[];
    momentsSummary?: MomentsSummary;
    brandVoiceAlignment?: {
        score: number;
        analysis: string;
    };
    talkTimeRatio?: { // Renamed for clarity and flexibility
        [speakerId: string]: number; // e.g., { 'A': 65, 'B': 35 }
    };
    talkToListenRatio?: { // Keep for backward compatibility if needed, but prefer talkTimeRatio
        salesperson: number;
        client: number;
        analysis: string;
    };
    viralitySuggestions: {
        title: string;
        description: string;
        hooks: string[];
        keyViralMoment?: string;
        viralityScore?: number;
        timeline: {
            hours: string;
            day: string;
            week: string;
        };
    };
    // New Professional Features
    questionAnalysis?: {
        openEnded: number;
        closedEnded: number;
    };
    sentimentArc?: {
        timeLabel: string; // "Start", "Middle", "End" or timestamps
        clientSentiment: number; // Score from 0-10
    }[];
    nextStepsClarity?: {
        score: number; // 0-10
        critique: string;
    };
    [key: string]: any;
}

export interface SocialMediaAnalysis {
    hookEffectiveness: {
        score: number;
        critique: string;
        suggestion: string;
    };
    visualAppeal: {
        score: number;
        critique: string;
        suggestion: string;
    };
    callToAction: {
        score: number;
        critique: string;
        suggestion: string;
    };
    brandConsistency: {
        score: number;
        critique: string;
    };
    overallScore: number;
    engagementPrediction: string;
    captionAndHashtags: {
        critique: string;
        suggestedCaption: string;
        suggestedHashtags: string[];
    };
    suggestedImprovements: string[];
    viralityScore: number;
    viralitySuggestions: {
        hooks: string[];
        strategies: string[];
        timeline: {
            hours: string;
            day: string;
            week: string;
        };
    };
    targetAudience: string;
    // New Professional Features
    abTestSuggestions?: {
        hooks: string[];
        ctas: string[];
    };
    optimalPostingTime?: string;
    contentFormatSuggestion?: string; // e.g., "Reel", "Carousel", "Static Image"
    accessibility?: {
        score: number;
        critique: string;
    };
    [key: string]: any;
}


export interface AdAnalysis {
    clarityOfMessage: string;
    targetAudienceAlignment: string;
    emotionalImpact: string;
    overallScore: number;
    visualPacing: string;
    hookEffectiveness: {
        score: number;
        critique: string;
        suggestion: string;
    };
    audioAnalysis: AudioAnalysis;
    ctaEffectiveness: {
        score: number;
        critique: string;
        suggestion: string;
    };
    thumbnailSuggestion: {
        score: number;
        critique: string;
        suggestion: string;
    };
    suggestedDescription: string;
    viralityScore: number;
    editingSuggestions?: EditingSuggestion[];
    // New Professional Features
    problemSolutionFramework?: {
        score: number;
        critique: string;
    };
    brandMentionAnalysis?: {
        critique: string;
        suggestions: string[];
    };
    adPlatformSuitability?: string[]; // e.g., "TikTok", "YouTube Pre-roll", "Instagram Story"
    [key: string]: any;
}
export type ProductAdAnalysis = AdAnalysis;

export interface EditingSuggestion {
    timestamp: string;
    type: 'Cut' | 'Effect' | 'Text' | 'Audio';
    suggestion: string;
}

export interface VideoAnalysis {
    visualPacing: string;
    audioAnalysis?: AudioAnalysis;
    messageClarity: string;
    brandConsistency: string;
    engagementPotential: string;
    editingStyle: string;
    thumbnailSuggestion: {
        score: number;
        critique: string;
        suggestion: string;
    };
    captionQuality: {
        score: number;
        critique: string;
        suggestion: string;
    };
    viralityScore: number;
    overallScore: number;
    suggestedAudience: string;
    hookQuality: {
        score: number;
        critique: string;
        suggestion: string;
    };
    monetizationPotential: string;
    suggestedImprovements: string[];
    audienceRetentionPrediction?: AudienceRetentionPredictionPoint[];
    momentsSummary?: MomentsSummary;
    ctaEffectiveness?: {
        score: number;
        critique: string;
        suggestion: string;
        placementAnalysis: string;
        wordingAnalysis: string;
    };
    keyViralMoment?: string;
    viralityTimeline?: { hours: string; day: string; week: string; };
    viralityCurve?: ViralityCurvePoint[];
    technicalQuality?: {
        resolutionClarity: { score: number; critique: string; suggestion: string; };
        lighting: { score: number; critique: string; suggestion: string; };
        colorGrading: { score: number; critique: string; suggestion: string; };
    };
    viralitySuggestions?: {
        hooks: string[];
    };
    engagementStrategy?: string[];
    suggestedDescription?: string;
    suggestedTitles?: string[];
    suggestedTags?: string[];
    editingSuggestions?: EditingSuggestion[];
    [key: string]: any;
}

export interface LiveStreamAnalysis {
    peakEngagementMoments: string[];
    averageViewerSentiment: string;
    pacingAndFlow: string;
    audienceInteraction: string;
    keyTakeaways: string[];
    monetizationOpportunities: string[];
    overallScore: number;
    [key: string]: string | number | string[];
}


export interface DocumentAnalysis {
    summary: string;
    keyPoints: string[];
    tone: string;
    clarityScore: number;
    suggestedTitle: string;
    targetAudience: string;
    // New Professional Features
    readabilityScore?: {
        score: number; // Flesch-Kincaid score
        gradeLevel: string;
    };
    actionabilityScore?: {
        score: number;
        critique: string;
    };
    contentReframing?: {
        audience: string;
        summary: string;
    }[];
    [key: string]: any;
}

export interface FinancialReportAnalysis {
    summary: string;
    keyMetrics: {
        metric: string;
        value: string;
        analysis: string;
    }[];
    overallSentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
    sentimentAnalysis: string;
    keyRisks: string[];
    keyOpportunities: string[];
    // New Professional Features
    redFlags?: string[];
    eli5Summary?: string; // "Explain Like I'm 5"
    forwardLookingAnalysis?: {
        tone: 'Optimistic' | 'Pessimistic' | 'Neutral';
        summary: string;
    };
}

export interface ABTestResult {
    overallScore: number;
    critique: string;
    keyStrengths: string[];
}

export interface ABTestAnalysis {
    contentA: ABTestResult;
    contentB: ABTestResult;
    comparisonSummary: string;
    winner: 'Content A' | 'Content B';
    reasoning: string;
    hybridSuggestion: string;
}

export interface BrandVoiceScoreAnalysis {
    score: number;
    analysis: string;
}

export interface ShortFormScript {
    title: string;
    script: string;
}

export interface RepurposeAnalysis {
    shortFormScripts: ShortFormScript[];
    blogPost: string;
    linkedInPost: string;
    twitterThread: string;
}

export interface ThumbnailAnalysis {
    clarity: {
        score: number;
        critique: string;
        suggestion: string;
    };
    emotionalImpact: {
        score: number;
        critique: string;
        suggestion: string;
    };
    textReadability: {
        score: number;
        critique: string;
        suggestion: string;
    };
    overallScore: number;
    improvementSuggestions: string[];
}

export interface AnalysisResult {
    transcript?: TranscriptEntry[];
    performanceMetrics?: PerformanceMetricPoint[];
    feedbackCard?: FeedbackCardData;
    keywordAnalysis?: KeywordAnalysis;
    salesCallAnalysis?: SalesCallAnalysis;
    socialMediaAnalysis?: SocialMediaAnalysis;
    adAnalysis?: AdAnalysis;
    videoAnalysis?: VideoAnalysis;
    liveStreamAnalysis?: LiveStreamAnalysis;
    documentAnalysis?: DocumentAnalysis;
    financialReportAnalysis?: FinancialReportAnalysis;
    abTestAnalysis?: ABTestAnalysis;
    brandVoiceScoreAnalysis?: BrandVoiceScoreAnalysis;
    repurposeAnalysis?: RepurposeAnalysis;
    thumbnailAnalysis?: ThumbnailAnalysis;
    keyTakeaways?: string[];
}

export interface RetirementPhase {
    title: string;
    summary: string;
    recommendations: string[];
}

export interface RetirementProjectionPoint {
    year: number;
    value: number;
}

export interface RetirementPlan {
    isFeasible: boolean;
    summary: string;
    projectedNestEgg: number;
    projectedMonthlyIncome: number;
    recommendations: string[];
    accumulationPhase: RetirementPhase;
    decumulationPhase: RetirementPhase;
    projections: RetirementProjectionPoint[];
}


export interface VoiceoverScript {
    id: number;
    speaker: string;
    script: string;
    voice: string;
    style?: string;
}

export interface ViralScript {
    titles: string[];
    description: string;
    tags: string[];
    thumbnailConcepts: string[];
    script: string;
    storyboard: string;
    monetization: string;
    socialPost?: string;
    storyboardImages?: { scene: string; imageUrl: string | null | 'error'; }[];
}

export interface YouTubePost {
    title: string;
    description: string;
    tags: string[];
    shortHook?: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    plan: 'Free' | 'Creator' | 'Pro';
    role: 'user' | 'owner';
    activated?: boolean;
}

export interface AnalysisHistoryItem {
    result: AnalysisResult;
    analysisType: AppAnalysisType;
    timestamp: string;
    fileName?: string;
    fileNameB?: string;
}

export interface PromptHistoryItem {
    prompt: string;
    timestamp: string;
    type: GenerationType; // Use the defined GenerationType
    link?: string;
    imageModel?: 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image' | 'fal-flux' | 'stability-core' | 'sd3' | 'recraft-v3';
    aspectRatio?: string;
    imageStylePresets?: string[];
    imageMimeType?: 'image/jpeg' | 'image/png';
    videoModel?: 'veo-3.1-fast-generate-preview' | 'veo-3.1-generate-preview' | 'hunyuan-video' | 'luma-ray' | 'runway-gen3' | 'kling' | 'fal';
    resolution?: '720p' | '1080p';
    videoDuration?: number;
    videoStylePresets?: string[];
    referenceFrameCount?: number;
    voiceoverScripts?: VoiceoverScript[];
    voice?: string;
    style?: string;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface BrandVoice {
    tones: string[];
    audience: string;
    keywords: string;
    example: string;
}

export type SocialPlatform = 'X' | 'LinkedIn' | 'Instagram';

export interface SocialPost {
    platform: SocialPlatform;
    content: string;
}

export interface MonetizationAssets {
    sponsorPitch: string;
    affiliateCopy: string;
    merchandiseIdeas: string[];
}

export type ProjectAssetType = AppAnalysisType | GenerationType;

export interface ProjectAsset {
    id: string;
    type: ProjectAssetType;
    name: string;
    timestamp: string;
    data: AnalysisResult | ViralScript | string; // string for image/video/audio URLs
    sourceFile?: {
        name: string;
        type: string;
    };
    sourceFileB?: {
        name: string;
        type: string;
    };
}

export interface Project {
    id: string;
    user_id?: string;
    name: string;
    createdAt?: string; // Standardize optionality if fetched from DB where properties might be snake_case converted
    assets: ProjectAsset[];
}

export type SessionState = Partial<Record<AnalysisType | GenerationType, { [key: string]: any }>>
interface AppContextType {
    // State
    analysisType: AnalysisType;
    selectedFile: File | null;
    selectedFileB: File | null;
    fileUrl: string | null;
    contentInputs: { script: string; description: string; link: string };
    contentInputsB: { script: string; description: string; link: string };
    isUploading: boolean;
    isAnalyzing: boolean;
    analysisResult: AnalysisResult | null;
    viralScriptResult: ViralScript | null; // For export hub
    brandVoiceScoreAnalysis: BrandVoiceScoreAnalysis | null;
    uploadProgress: number | null;
    notifications: Notification[];
    improvedContent: string | null;
    isGeneratingImproved: boolean;
    socialPost: SocialPost | null;
    isGeneratingSocialPost: boolean;
    productAd: string | null;
    isGeneratingProductAd: boolean;
    youTubePost: YouTubePost | null;
    isGeneratingYouTubePost: boolean;
    monetizationAssets: MonetizationAssets | null;
    isGeneratingMonetizationAssets: boolean;
    keyTakeaways: string[] | null;
    isGeneratingKeyTakeaways: boolean;
    generatedDescription: string | null;
    isGeneratingDescription: boolean;
    feedbackAudio: { url: string; blob: Blob } | null;
    isGeneratingAudio: boolean;
    scriptAudio: { url: string; blob: Blob } | null;
    isGeneratingScriptAudio: boolean;
    initialGenerationProps: { prompt: string; type: GenerationType, settings?: any } | null;
    retirementPlan: RetirementPlan | null;
    brandVoice: BrandVoice;
    setBrandVoice: (voice: BrandVoice) => Promise<void>;
    isAuthenticated: boolean;
    currentUser: User | null;
    isHistoryOpen: boolean;
    setIsHistoryOpen: (isOpen: boolean) => void;
    isTourActive: boolean;
    overlayContent: React.ReactNode | null;
    setOverlayContent: (content: React.ReactNode | null) => void;
    highlightedTimeLabel: string | null;
    setHighlightedTimeLabel: (label: string | null) => void;
    speakerARole: 'me' | 'client';
    setSpeakerARole: (role: 'me' | 'client') => void;
    speakerBRole: 'me' | 'client';
    setSpeakerBRole: (role: 'me' | 'client') => void;
    analysisHistory: AnalysisHistoryItem[];
    promptHistory: PromptHistoryItem[];
    setPromptHistory: React.Dispatch<React.SetStateAction<PromptHistoryItem[]>>;
    setContentInputs: React.Dispatch<React.SetStateAction<{ script: string; description: string; link: string }>>;
    setContentInputsB: React.Dispatch<React.SetStateAction<{ script: string; description: string; link: string }>>;
    loadingMessages: string[];
    isExportHubOpen: boolean;
    setIsExportHubOpen: (isOpen: boolean) => void;
    generatedReframedContent: { audience: string; summary: string; } | null;
    isGeneratingReframedContent: boolean;
    isProjectsModalOpen: boolean;
    projects: Project[];
    activeProjectId: string | null;
    saveConfirmation: string;
    sessionState: SessionState;
    suggestedActions: SuggestedAction[] | null;
    abortControllerRef: React.MutableRefObject<AbortController>;
    withApiErrorHandling: <R>(apiCall: (signal: AbortSignal, ...args: any[]) => Promise<R>, ...args: any[]) => Promise<R>;

    // New Generation-specific states
    generatedImage: string | null;
    setGeneratedImage: React.Dispatch<React.SetStateAction<string | null>>;
    generatedVideo: { url: string, payload: any } | null;
    setGeneratedVideo: React.Dispatch<React.SetStateAction<{ url: string, payload: any } | null>>;
    generatedSpeechUrl: string | null;
    setGeneratedSpeechUrl: React.Dispatch<React.SetStateAction<string | null>>;
    setInitialGenerationProps: React.Dispatch<React.SetStateAction<{ prompt: string; type: GenerationType, settings?: any } | null>>;


    // Actions
    handleRunSuggestedAction: (action: SuggestedAction) => void;
    updateSessionState: (type: AnalysisType | GenerationType, newInputs: any) => void;
    handleTypeChange: (type: AnalysisType) => void;
    handleLogout: () => void;
    removeNotification: (id: number) => void;
    addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    handleOnboardingFinish: () => void;
    startTour: () => void;
    handleCancel: () => void;
    handleFileSelect: (file: File) => void;
    handleFileSelectB: (file: File) => void;
    handleClearFile: () => void;
    handleClearFileB: () => void;
    handleAnalysisSubmit: () => void;
    setViralScriptResult: (script: ViralScript | null) => void;
    handleScoreBrandVoiceAlignment: (text: string) => Promise<void>;
    handleGenerateImprovedContent: () => Promise<void>;
    handleGenerateSocialPost: (platform: SocialPlatform) => Promise<void>;
    handleGenerateYouTubePost: () => Promise<void>;
    handleGenerateProductAd: () => Promise<void>;
    handleGenerateMonetizationAssets: () => Promise<void>;
    handleGenerateKeyTakeaways: () => Promise<void>;
    handleGenerateDescription: () => Promise<void>;
    handleListenToFeedback: (voice: string, style: string) => Promise<void>;
    handleListenToScript: (script: string, voice: string, style: string) => Promise<void>;
    handleGenerateVideoFromScript: (script: string) => void;
    onInitialPropsConsumed: () => void;
    attemptGeneration: () => boolean;
    onSuccessfulGeneration: () => void;
    handleGenerateRetirementPlan: (inputs: any) => Promise<void>;
    handleLogin: (email: string, password: string) => Promise<void>;
    handleSignup: (email: string, name: string) => Promise<void>;
    handleGoogleLogin: () => Promise<void>;
    handleGithubLogin: () => Promise<void>;
    handleActivation: (user: User) => void;
    handleSelectFromHistory: (item: AnalysisHistoryItem) => void;
    handleClearAnalysisHistory: () => Promise<void>;
    handleDeleteAnalysisHistoryItem: (timestamp: string) => void;
    handleClearPromptHistory: () => void;
    handleDeletePromptHistoryItem: (timestamp: string) => void;
    handleGenerateReframedContent: (originalSummary: string, targetAudience: string) => Promise<void>;
    handleGenerateThumbnailVariations: (suggestions: string) => void;
    handleProjectsModalToggle: () => void;
    handleCreateProject: (name: string) => void;
    handleSelectProject: (id: string) => void;
    handleSaveAssetToProject: (data: any, type: ProjectAssetType, name: string) => void;
    handleLoadAsset: (asset: ProjectAsset) => void;
    registerLiveSessionCleanup: (cleanupFn: (() => void) | null) => void;
}

// ADDED ABORT ERROR CLASS
export class AbortError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AbortError";
    }
}