"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monetizationAssetsSchema = exports.retirementPlanSchema = exports.youTubePostSchema = exports.viralScriptSchema = exports.thumbnailAnalysisFullSchema = exports.repurposeContentFullSchema = exports.brandVoiceScoreFullSchema = exports.abTestFullSchema = exports.liveStreamFullSchema = exports.financialReportFullSchema = exports.documentFullSchema = exports.transcriptionFullSchema = exports.videoAnalysisFullSchema = exports.productAdFullSchema = exports.socialMediaFullSchema = exports.salesCallFullSchema = exports.repurposeAnalysisSchema = void 0;
const genai_1 = require("@google/genai");
const transcriptEntrySchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        speaker: { type: genai_1.Type.STRING },
        text: { type: genai_1.Type.STRING },
        startTime: { type: genai_1.Type.NUMBER },
        endTime: { type: genai_1.Type.NUMBER },
        tags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    },
};
const feedbackCardSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        strengths: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        opportunities: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    },
};
const speechAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        pacingWPM: { type: genai_1.Type.NUMBER },
        fillerWordCount: { type: genai_1.Type.NUMBER },
        dominantTone: { type: genai_1.Type.STRING },
    },
};
const momentsSummarySchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        objections: { type: genai_1.Type.NUMBER },
        actionItems: { type: genai_1.Type.NUMBER },
        keyDecisions: { type: genai_1.Type.NUMBER },
    },
};
const salesCallAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        summary: { type: genai_1.Type.STRING },
        overallPerformance: { type: genai_1.Type.STRING },
        rapportBuilding: { type: genai_1.Type.STRING },
        needsDiscovery: { type: genai_1.Type.STRING },
        productPresentation: { type: genai_1.Type.STRING },
        objectionHandling: { type: genai_1.Type.STRING },
        closingEffectiveness: { type: genai_1.Type.STRING },
        clarityScore: { type: genai_1.Type.NUMBER },
        confidenceScore: { type: genai_1.Type.NUMBER },
        speechAnalyses: { type: genai_1.Type.OBJECT, properties: { A: speechAnalysisSchema, B: speechAnalysisSchema } },
        momentsSummary: momentsSummarySchema,
        brandVoiceAlignment: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, analysis: { type: genai_1.Type.STRING } } },
        talkTimeRatio: { type: genai_1.Type.OBJECT, properties: { A: { type: genai_1.Type.NUMBER }, B: { type: genai_1.Type.NUMBER } } },
        strengths: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        weaknesses: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        areasOfImprovement: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        viralitySuggestions: {
            type: genai_1.Type.OBJECT,
            properties: {
                title: { type: genai_1.Type.STRING },
                description: { type: genai_1.Type.STRING },
                hooks: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                keyViralMoment: { type: genai_1.Type.STRING },
                viralityScore: { type: genai_1.Type.NUMBER },
                timeline: { type: genai_1.Type.OBJECT, properties: { hours: { type: genai_1.Type.STRING }, day: { type: genai_1.Type.STRING }, week: { type: genai_1.Type.STRING } } },
            }
        },
        // New Professional Features
        questionAnalysis: { type: genai_1.Type.OBJECT, properties: { openEnded: { type: genai_1.Type.NUMBER }, closedEnded: { type: genai_1.Type.NUMBER } } },
        sentimentArc: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.OBJECT, properties: { timeLabel: { type: genai_1.Type.STRING }, clientSentiment: { type: genai_1.Type.NUMBER } } } },
        nextStepsClarity: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING } } },
    },
};
const socialMediaAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        hookEffectiveness: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        visualAppeal: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        callToAction: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        brandConsistency: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING } } },
        overallScore: { type: genai_1.Type.NUMBER },
        engagementPrediction: { type: genai_1.Type.STRING },
        captionAndHashtags: { type: genai_1.Type.OBJECT, properties: { critique: { type: genai_1.Type.STRING }, suggestedCaption: { type: genai_1.Type.STRING }, suggestedHashtags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } } } },
        suggestedImprovements: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        viralityScore: { type: genai_1.Type.NUMBER },
        viralitySuggestions: { type: genai_1.Type.OBJECT, properties: { hooks: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } }, strategies: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } }, timeline: { type: genai_1.Type.OBJECT, properties: { hours: { type: genai_1.Type.STRING }, day: { type: genai_1.Type.STRING }, week: { type: genai_1.Type.STRING } } } } },
        targetAudience: { type: genai_1.Type.STRING },
        // New Professional Features
        abTestSuggestions: { type: genai_1.Type.OBJECT, properties: { hooks: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } }, ctas: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } } } },
        optimalPostingTime: { type: genai_1.Type.STRING },
        contentFormatSuggestion: { type: genai_1.Type.STRING },
        accessibility: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING } } },
    }
};
const audioAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        qualityScore: { type: genai_1.Type.NUMBER },
        qualityCritique: { type: genai_1.Type.STRING },
        qualitySuggestion: { type: genai_1.Type.STRING },
        pacingWPM: { type: genai_1.Type.NUMBER },
        fillerWordCount: { type: genai_1.Type.NUMBER },
        sentiment: { type: genai_1.Type.STRING },
    },
};
const editingSuggestionSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        timestamp: { type: genai_1.Type.STRING },
        type: { type: genai_1.Type.STRING },
        suggestion: { type: genai_1.Type.STRING },
    }
};
const adAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        clarityOfMessage: { type: genai_1.Type.STRING },
        targetAudienceAlignment: { type: genai_1.Type.STRING },
        emotionalImpact: { type: genai_1.Type.STRING },
        overallScore: { type: genai_1.Type.NUMBER },
        visualPacing: { type: genai_1.Type.STRING },
        hookEffectiveness: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        audioAnalysis: audioAnalysisSchema,
        ctaEffectiveness: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        thumbnailSuggestion: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        suggestedDescription: { type: genai_1.Type.STRING },
        viralityScore: { type: genai_1.Type.NUMBER },
        editingSuggestions: { type: genai_1.Type.ARRAY, items: editingSuggestionSchema },
        // New Professional Features
        problemSolutionFramework: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING } } },
        brandMentionAnalysis: { type: genai_1.Type.OBJECT, properties: { critique: { type: genai_1.Type.STRING }, suggestions: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } } } },
        adPlatformSuitability: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    }
};
const audienceRetentionPredictionPointSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        timeLabel: { type: genai_1.Type.STRING },
        retentionPercent: { type: genai_1.Type.NUMBER },
        reason: { type: genai_1.Type.STRING },
    },
};
const viralityCurvePointSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        timeLabel: { type: genai_1.Type.STRING },
        predictedViews: { type: genai_1.Type.NUMBER },
    },
};
const videoAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        visualPacing: { type: genai_1.Type.STRING },
        audioAnalysis: audioAnalysisSchema,
        messageClarity: { type: genai_1.Type.STRING },
        brandConsistency: { type: genai_1.Type.STRING },
        engagementPotential: { type: genai_1.Type.STRING },
        editingStyle: { type: genai_1.Type.STRING },
        thumbnailSuggestion: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        captionQuality: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        viralityScore: { type: genai_1.Type.NUMBER },
        overallScore: { type: genai_1.Type.NUMBER },
        suggestedAudience: { type: genai_1.Type.STRING },
        hookQuality: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        monetizationPotential: { type: genai_1.Type.STRING },
        suggestedImprovements: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        audienceRetentionPrediction: { type: genai_1.Type.ARRAY, items: audienceRetentionPredictionPointSchema },
        momentsSummary: momentsSummarySchema,
        ctaEffectiveness: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING }, placementAnalysis: { type: genai_1.Type.STRING }, wordingAnalysis: { type: genai_1.Type.STRING } } },
        keyViralMoment: { type: genai_1.Type.STRING },
        viralityCurve: { type: genai_1.Type.ARRAY, items: viralityCurvePointSchema },
        technicalQuality: { type: genai_1.Type.OBJECT, properties: { resolutionClarity: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } }, lighting: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } }, colorGrading: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } } } },
        viralitySuggestions: { type: genai_1.Type.OBJECT, properties: { hooks: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } } } },
        engagementStrategy: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        suggestedDescription: { type: genai_1.Type.STRING },
        suggestedTitles: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        suggestedTags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        editingSuggestions: { type: genai_1.Type.ARRAY, items: editingSuggestionSchema },
    }
};
const liveStreamAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        peakEngagementMoments: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        averageViewerSentiment: { type: genai_1.Type.STRING },
        pacingAndFlow: { type: genai_1.Type.STRING },
        audienceInteraction: { type: genai_1.Type.STRING },
        keyTakeaways: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        monetizationOpportunities: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        overallScore: { type: genai_1.Type.NUMBER },
    }
};
const documentAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        summary: { type: genai_1.Type.STRING },
        keyPoints: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        tone: { type: genai_1.Type.STRING },
        clarityScore: { type: genai_1.Type.NUMBER },
        suggestedTitle: { type: genai_1.Type.STRING },
        targetAudience: { type: genai_1.Type.STRING },
        // New Professional Features
        readabilityScore: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, gradeLevel: { type: genai_1.Type.STRING } } },
        actionabilityScore: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING } } },
        contentReframing: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.OBJECT, properties: { audience: { type: genai_1.Type.STRING }, summary: { type: genai_1.Type.STRING } } } },
    }
};
const financialReportAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        summary: { type: genai_1.Type.STRING },
        keyMetrics: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.OBJECT, properties: { metric: { type: genai_1.Type.STRING }, value: { type: genai_1.Type.STRING }, analysis: { type: genai_1.Type.STRING } } } },
        overallSentiment: { type: genai_1.Type.STRING },
        sentimentAnalysis: { type: genai_1.Type.STRING },
        keyRisks: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        keyOpportunities: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        // New Professional Features
        redFlags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        eli5Summary: { type: genai_1.Type.STRING },
        forwardLookingAnalysis: { type: genai_1.Type.OBJECT, properties: { tone: { type: genai_1.Type.STRING }, summary: { type: genai_1.Type.STRING } } },
    }
};
const performanceMetricPointSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        label: { type: genai_1.Type.STRING },
        scores: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    metric: { type: genai_1.Type.STRING },
                    value: { type: genai_1.Type.NUMBER }
                }
            }
        }
    }
};
const abTestResultSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        overallScore: { type: genai_1.Type.NUMBER },
        critique: { type: genai_1.Type.STRING },
        keyStrengths: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    }
};
const abTestAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        contentA: abTestResultSchema,
        contentB: abTestResultSchema,
        comparisonSummary: { type: genai_1.Type.STRING },
        winner: { type: genai_1.Type.STRING },
        reasoning: { type: genai_1.Type.STRING },
        hybridSuggestion: { type: genai_1.Type.STRING },
    }
};
const brandVoiceScoreAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        score: { type: genai_1.Type.NUMBER },
        analysis: { type: genai_1.Type.STRING },
    }
};
exports.repurposeAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        shortFormScripts: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    title: { type: genai_1.Type.STRING },
                    script: { type: genai_1.Type.STRING }
                },
                required: ['title', 'script']
            }
        },
        blogPost: { type: genai_1.Type.STRING },
        linkedInPost: { type: genai_1.Type.STRING },
        twitterThread: { type: genai_1.Type.STRING }
    },
    required: ['shortFormScripts', 'blogPost', 'linkedInPost', 'twitterThread']
};
const thumbnailAnalysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        clarity: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        emotionalImpact: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        textReadability: { type: genai_1.Type.OBJECT, properties: { score: { type: genai_1.Type.NUMBER }, critique: { type: genai_1.Type.STRING }, suggestion: { type: genai_1.Type.STRING } } },
        overallScore: { type: genai_1.Type.NUMBER },
        improvementSuggestions: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
    }
};
// --- Specific Schemas for each Analysis Type ---
exports.salesCallFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        transcript: { type: genai_1.Type.ARRAY, items: transcriptEntrySchema },
        performanceMetrics: { type: genai_1.Type.ARRAY, items: performanceMetricPointSchema },
        feedbackCard: feedbackCardSchema,
        salesCallAnalysis: salesCallAnalysisSchema,
    }
};
exports.socialMediaFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        transcript: { type: genai_1.Type.ARRAY, items: transcriptEntrySchema },
        feedbackCard: feedbackCardSchema,
        socialMediaAnalysis: socialMediaAnalysisSchema,
    }
};
exports.productAdFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        transcript: { type: genai_1.Type.ARRAY, items: transcriptEntrySchema },
        feedbackCard: feedbackCardSchema,
        adAnalysis: adAnalysisSchema,
    }
};
exports.videoAnalysisFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        transcript: { type: genai_1.Type.ARRAY, items: transcriptEntrySchema },
        feedbackCard: feedbackCardSchema,
        videoAnalysis: videoAnalysisSchema,
    }
};
exports.transcriptionFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        transcript: { type: genai_1.Type.ARRAY, items: transcriptEntrySchema },
        documentAnalysis: documentAnalysisSchema,
        feedbackCard: feedbackCardSchema,
    }
};
exports.documentFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        documentAnalysis: documentAnalysisSchema,
    }
};
exports.financialReportFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        financialReportAnalysis: financialReportAnalysisSchema,
    }
};
exports.liveStreamFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        transcript: { type: genai_1.Type.ARRAY, items: transcriptEntrySchema },
        feedbackCard: feedbackCardSchema,
        liveStreamAnalysis: liveStreamAnalysisSchema,
    }
};
exports.abTestFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        abTestAnalysis: abTestAnalysisSchema,
    },
};
exports.brandVoiceScoreFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        brandVoiceScoreAnalysis: brandVoiceScoreAnalysisSchema,
    }
};
exports.repurposeContentFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema, // Can include a generic one
        repurposeAnalysis: exports.repurposeAnalysisSchema
    },
    required: ['feedbackCard', 'repurposeAnalysis']
};
exports.thumbnailAnalysisFullSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        thumbnailAnalysis: thumbnailAnalysisSchema,
    },
};
// --- Other Schemas ---
exports.viralScriptSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        titles: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        description: { type: genai_1.Type.STRING },
        tags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        thumbnailConcepts: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        script: { type: genai_1.Type.STRING },
        storyboard: { type: genai_1.Type.STRING },
        monetization: { type: genai_1.Type.STRING },
    },
};
exports.youTubePostSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        title: { type: genai_1.Type.STRING },
        description: { type: genai_1.Type.STRING },
        tags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        shortHook: { type: genai_1.Type.STRING },
    },
    required: ['title', 'description', 'tags']
};
exports.retirementPlanSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        isFeasible: { type: genai_1.Type.BOOLEAN },
        summary: { type: genai_1.Type.STRING },
        projectedNestEgg: { type: genai_1.Type.NUMBER },
        projectedMonthlyIncome: { type: genai_1.Type.NUMBER },
        recommendations: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
        accumulationPhase: {
            type: genai_1.Type.OBJECT,
            properties: {
                title: { type: genai_1.Type.STRING },
                summary: { type: genai_1.Type.STRING },
                recommendations: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } }
            },
            required: ['title', 'summary', 'recommendations']
        },
        decumulationPhase: {
            type: genai_1.Type.OBJECT,
            properties: {
                title: { type: genai_1.Type.STRING },
                summary: { type: genai_1.Type.STRING },
                recommendations: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } }
            },
            required: ['title', 'summary', 'recommendations']
        },
        projections: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    year: { type: genai_1.Type.NUMBER },
                    value: { type: genai_1.Type.NUMBER }
                },
                required: ['year', 'value']
            }
        }
    },
    required: [
        'isFeasible',
        'summary',
        'projectedNestEgg',
        'projectedMonthlyIncome',
        'recommendations',
        'accumulationPhase',
        'decumulationPhase',
        'projections'
    ]
};
exports.monetizationAssetsSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        sponsorPitch: { type: genai_1.Type.STRING, description: "A professional email to a potential sponsor." },
        affiliateCopy: { type: genai_1.Type.STRING, description: "A short paragraph for an affiliate link." },
        merchandiseIdeas: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING }, description: "A list of 3 creative merchandise ideas." },
    },
    required: ['sponsorPitch', 'affiliateCopy', 'merchandiseIdeas'],
};
