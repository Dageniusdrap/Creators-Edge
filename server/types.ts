
// Server-side types (No React dependencies)

export type AppAnalysisType = 'salesCall' | 'socialMedia' | 'productAd' | 'contentGeneration' | 'brandVoice' | 'pricing' | 'videoAnalysis' | 'documentAnalysis' | 'liveStream' | 'retirementPlanner' | 'liveDebugger' | 'financialReport' | 'transcription' | 'abTest' | 'brandVoiceScore' | 'repurposeContent' | 'thumbnailAnalysis' | 'apiKeys';

export type GenerationType = 'script' | 'image' | 'video' | 'speech';

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
    talkTimeRatio?: {
        [speakerId: string]: number;
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
    questionAnalysis?: {
        openEnded: number;
        closedEnded: number;
    };
    sentimentArc?: {
        timeLabel: string;
        clientSentiment: number;
    }[];
    nextStepsClarity?: {
        score: number;
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
    abTestSuggestions?: {
        hooks: string[];
        ctas: string[];
    };
    optimalPostingTime?: string;
    contentFormatSuggestion?: string;
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
    editingSuggestions?: any[]; // Simplified
    problemSolutionFramework?: {
        score: number;
        critique: string;
    };
    brandMentionAnalysis?: {
        critique: string;
        suggestions: string[];
    };
    adPlatformSuitability?: string[];
    [key: string]: any;
}
export type ProductAdAnalysis = AdAnalysis;

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
    audienceRetentionPrediction?: any[];
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
    viralityCurve?: any[];
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
    editingSuggestions?: any[];
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
    readabilityScore?: {
        score: number;
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
    redFlags?: string[];
    eli5Summary?: string;
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

export interface BrandVoice {
    tones: string[];
    audience: string;
    keywords: string;
    example: string;
}

export type SocialPlatform = 'X' | 'LinkedIn' | 'Instagram';

export interface ViralScript {
    titles: string[];
    description: string;
    tags: string[];
    thumbnailConcepts: string[];
    script: string;
    storyboard: string;
    monetization: string;
    socialPost?: string;
}

export interface YouTubePost {
    title: string;
    description: string;
    tags: string[];
    shortHook?: string;
}

export interface MonetizationAssets {
    sponsorPitch: string;
    affiliateCopy: string;
    merchandiseIdeas: string[];
}
