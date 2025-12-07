import { Type } from '@google/genai';

const transcriptEntrySchema = {
  type: Type.OBJECT,
  properties: {
    speaker: { type: Type.STRING },
    text: { type: Type.STRING },
    startTime: { type: Type.NUMBER },
    endTime: { type: Type.NUMBER },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

const feedbackCardSchema = {
  type: Type.OBJECT,
  properties: {
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

const speechAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        pacingWPM: { type: Type.NUMBER },
        fillerWordCount: { type: Type.NUMBER },
        dominantTone: { type: Type.STRING },
    },
};

const momentsSummarySchema = {
    type: Type.OBJECT,
    properties: {
        objections: { type: Type.NUMBER },
        actionItems: { type: Type.NUMBER },
        keyDecisions: { type: Type.NUMBER },
    },
};

const salesCallAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    overallPerformance: { type: Type.STRING },
    rapportBuilding: { type: Type.STRING },
    needsDiscovery: { type: Type.STRING },
    productPresentation: { type: Type.STRING },
    objectionHandling: { type: Type.STRING },
    closingEffectiveness: { type: Type.STRING },
    clarityScore: { type: Type.NUMBER },
    confidenceScore: { type: Type.NUMBER },
    speechAnalyses: { type: Type.OBJECT, properties: { A: speechAnalysisSchema, B: speechAnalysisSchema } },
    momentsSummary: momentsSummarySchema,
    brandVoiceAlignment: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, analysis: { type: Type.STRING } } },
    talkTimeRatio: { type: Type.OBJECT, properties: { A: { type: Type.NUMBER }, B: { type: Type.NUMBER } } },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    areasOfImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
    viralitySuggestions: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyViralMoment: { type: Type.STRING },
            viralityScore: { type: Type.NUMBER },
            timeline: { type: Type.OBJECT, properties: { hours: { type: Type.STRING }, day: { type: Type.STRING }, week: { type: Type.STRING } } },
        }
    },
    // New Professional Features
    questionAnalysis: { type: Type.OBJECT, properties: { openEnded: { type: Type.NUMBER }, closedEnded: { type: Type.NUMBER } } },
    sentimentArc: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { timeLabel: { type: Type.STRING }, clientSentiment: { type: Type.NUMBER } } } },
    nextStepsClarity: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING } } },
  },
};

const socialMediaAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        hookEffectiveness: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        visualAppeal: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        callToAction: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        brandConsistency: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING } } },
        overallScore: { type: Type.NUMBER },
        engagementPrediction: { type: Type.STRING },
        captionAndHashtags: { type: Type.OBJECT, properties: { critique: { type: Type.STRING }, suggestedCaption: { type: Type.STRING }, suggestedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
        viralityScore: { type: Type.NUMBER },
        viralitySuggestions: { type: Type.OBJECT, properties: { hooks: { type: Type.ARRAY, items: { type: Type.STRING } }, strategies: { type: Type.ARRAY, items: { type: Type.STRING } }, timeline: { type: Type.OBJECT, properties: { hours: { type: Type.STRING }, day: { type: Type.STRING }, week: { type: Type.STRING } } } } },
        targetAudience: { type: Type.STRING },
        // New Professional Features
        abTestSuggestions: { type: Type.OBJECT, properties: { hooks: { type: Type.ARRAY, items: { type: Type.STRING } }, ctas: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        optimalPostingTime: { type: Type.STRING },
        contentFormatSuggestion: { type: Type.STRING },
        accessibility: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING } } },
    }
};

const audioAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        qualityScore: { type: Type.NUMBER },
        qualityCritique: { type: Type.STRING },
        qualitySuggestion: { type: Type.STRING },
        pacingWPM: { type: Type.NUMBER },
        fillerWordCount: { type: Type.NUMBER },
        sentiment: { type: Type.STRING },
    },
};

const editingSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        timestamp: { type: Type.STRING },
        type: { type: Type.STRING },
        suggestion: { type: Type.STRING },
    }
};

const adAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        clarityOfMessage: { type: Type.STRING },
        targetAudienceAlignment: { type: Type.STRING },
        emotionalImpact: { type: Type.STRING },
        overallScore: { type: Type.NUMBER },
        visualPacing: { type: Type.STRING },
        hookEffectiveness: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        audioAnalysis: audioAnalysisSchema,
        ctaEffectiveness: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        thumbnailSuggestion: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        suggestedDescription: { type: Type.STRING },
        viralityScore: { type: Type.NUMBER },
        editingSuggestions: { type: Type.ARRAY, items: editingSuggestionSchema },
        // New Professional Features
        problemSolutionFramework: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING } } },
        brandMentionAnalysis: { type: Type.OBJECT, properties: { critique: { type: Type.STRING }, suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        adPlatformSuitability: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};

const audienceRetentionPredictionPointSchema = {
    type: Type.OBJECT,
    properties: {
        timeLabel: { type: Type.STRING },
        retentionPercent: { type: Type.NUMBER },
        reason: { type: Type.STRING },
    },
};

const viralityCurvePointSchema = {
    type: Type.OBJECT,
    properties: {
        timeLabel: { type: Type.STRING },
        predictedViews: { type: Type.NUMBER },
    },
};

const videoAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        visualPacing: { type: Type.STRING },
        audioAnalysis: audioAnalysisSchema,
        messageClarity: { type: Type.STRING },
        brandConsistency: { type: Type.STRING },
        engagementPotential: { type: Type.STRING },
        editingStyle: { type: Type.STRING },
        thumbnailSuggestion: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        captionQuality: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        viralityScore: { type: Type.NUMBER },
        overallScore: { type: Type.NUMBER },
        suggestedAudience: { type: Type.STRING },
        hookQuality: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        monetizationPotential: { type: Type.STRING },
        suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
        audienceRetentionPrediction: { type: Type.ARRAY, items: audienceRetentionPredictionPointSchema },
        momentsSummary: momentsSummarySchema,
        ctaEffectiveness: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING }, placementAnalysis: { type: Type.STRING }, wordingAnalysis: { type: Type.STRING } } },
        keyViralMoment: { type: Type.STRING },
        viralityCurve: { type: Type.ARRAY, items: viralityCurvePointSchema },
        technicalQuality: { type: Type.OBJECT, properties: { resolutionClarity: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } }, lighting: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } }, colorGrading: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } } } },
        viralitySuggestions: { type: Type.OBJECT, properties: { hooks: { type: Type.ARRAY, items: { type: Type.STRING } } } },
        engagementStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedDescription: { type: Type.STRING },
        suggestedTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
        editingSuggestions: { type: Type.ARRAY, items: editingSuggestionSchema },
    }
};

const liveStreamAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        peakEngagementMoments: { type: Type.ARRAY, items: { type: Type.STRING } },
        averageViewerSentiment: { type: Type.STRING },
        pacingAndFlow: { type: Type.STRING },
        audienceInteraction: { type: Type.STRING },
        keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
        monetizationOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        overallScore: { type: Type.NUMBER },
    }
};

const documentAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING },
        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        tone: { type: Type.STRING },
        clarityScore: { type: Type.NUMBER },
        suggestedTitle: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
        // New Professional Features
        readabilityScore: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, gradeLevel: { type: Type.STRING } } },
        actionabilityScore: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING } } },
        contentReframing: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { audience: { type: Type.STRING }, summary: { type: Type.STRING } } } },
    }
};

const financialReportAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING },
        keyMetrics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, value: { type: Type.STRING }, analysis: { type: Type.STRING } } } },
        overallSentiment: { type: Type.STRING },
        sentimentAnalysis: { type: Type.STRING },
        keyRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        // New Professional Features
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        eli5Summary: { type: Type.STRING },
        forwardLookingAnalysis: { type: Type.OBJECT, properties: { tone: { type: Type.STRING }, summary: { type: Type.STRING } } },
    }
};

const performanceMetricPointSchema = {
    type: Type.OBJECT,
    properties: {
        label: { type: Type.STRING },
        scores: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    metric: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                }
            }
        }
    }
};

const abTestResultSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.NUMBER },
        critique: { type: Type.STRING },
        keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};

const abTestAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        contentA: abTestResultSchema,
        contentB: abTestResultSchema,
        comparisonSummary: { type: Type.STRING },
        winner: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        hybridSuggestion: { type: Type.STRING },
    }
};

const brandVoiceScoreAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER },
        analysis: { type: Type.STRING },
    }
};

export const repurposeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        shortFormScripts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    script: { type: Type.STRING }
                },
                required: ['title', 'script']
            }
        },
        blogPost: { type: Type.STRING },
        linkedInPost: { type: Type.STRING },
        twitterThread: { type: Type.STRING }
    },
    required: ['shortFormScripts', 'blogPost', 'linkedInPost', 'twitterThread']
};

const thumbnailAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        clarity: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        emotionalImpact: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        textReadability: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, critique: { type: Type.STRING }, suggestion: { type: Type.STRING } } },
        overallScore: { type: Type.NUMBER },
        improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};


// --- Specific Schemas for each Analysis Type ---

export const salesCallFullSchema = {
  type: Type.OBJECT,
  properties: {
    transcript: { type: Type.ARRAY, items: transcriptEntrySchema },
    performanceMetrics: { type: Type.ARRAY, items: performanceMetricPointSchema },
    feedbackCard: feedbackCardSchema,
    salesCallAnalysis: salesCallAnalysisSchema,
  }
};

export const socialMediaFullSchema = {
  type: Type.OBJECT,
  properties: {
    transcript: { type: Type.ARRAY, items: transcriptEntrySchema },
    feedbackCard: feedbackCardSchema,
    socialMediaAnalysis: socialMediaAnalysisSchema,
  }
};

export const productAdFullSchema = {
  type: Type.OBJECT,
  properties: {
    transcript: { type: Type.ARRAY, items: transcriptEntrySchema },
    feedbackCard: feedbackCardSchema,
    adAnalysis: adAnalysisSchema,
  }
};

export const videoAnalysisFullSchema = {
  type: Type.OBJECT,
  properties: {
    transcript: { type: Type.ARRAY, items: transcriptEntrySchema },
    feedbackCard: feedbackCardSchema,
    videoAnalysis: videoAnalysisSchema,
  }
};

export const transcriptionFullSchema = {
    type: Type.OBJECT,
    properties: {
        transcript: { type: Type.ARRAY, items: transcriptEntrySchema },
        documentAnalysis: documentAnalysisSchema,
        feedbackCard: feedbackCardSchema,
    }
};

export const documentFullSchema = {
  type: Type.OBJECT,
  properties: {
    feedbackCard: feedbackCardSchema,
    documentAnalysis: documentAnalysisSchema,
  }
};

export const financialReportFullSchema = {
    type: Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        financialReportAnalysis: financialReportAnalysisSchema,
    }
};

export const liveStreamFullSchema = {
    type: Type.OBJECT,
    properties: {
        transcript: { type: Type.ARRAY, items: transcriptEntrySchema },
        feedbackCard: feedbackCardSchema,
        liveStreamAnalysis: liveStreamAnalysisSchema,
    }
};

export const abTestFullSchema = {
  type: Type.OBJECT,
  properties: {
    feedbackCard: feedbackCardSchema,
    abTestAnalysis: abTestAnalysisSchema,
  },
};

export const brandVoiceScoreFullSchema = {
    type: Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema,
        brandVoiceScoreAnalysis: brandVoiceScoreAnalysisSchema,
    }
};

export const repurposeContentFullSchema = {
    type: Type.OBJECT,
    properties: {
        feedbackCard: feedbackCardSchema, // Can include a generic one
        repurposeAnalysis: repurposeAnalysisSchema
    },
    required: ['feedbackCard', 'repurposeAnalysis']
};

export const thumbnailAnalysisFullSchema = {
  type: Type.OBJECT,
  properties: {
    feedbackCard: feedbackCardSchema,
    thumbnailAnalysis: thumbnailAnalysisSchema,
  },
};


// --- Other Schemas ---

export const viralScriptSchema = {
  type: Type.OBJECT,
  properties: {
    titles: { type: Type.ARRAY, items: { type: Type.STRING } },
    description: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    thumbnailConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
    script: { type: Type.STRING },
    storyboard: { type: Type.STRING },
    monetization: { type: Type.STRING },
  },
};

export const youTubePostSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        shortHook: { type: Type.STRING },
    },
    required: ['title', 'description', 'tags']
};

export const retirementPlanSchema = {
    type: Type.OBJECT,
    properties: {
        isFeasible: { type: Type.BOOLEAN },
        summary: { type: Type.STRING },
        projectedNestEgg: { type: Type.NUMBER },
        projectedMonthlyIncome: { type: Type.NUMBER },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        accumulationPhase: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'summary', 'recommendations']
        },
        decumulationPhase: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'summary', 'recommendations']
        },
        projections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    year: { type: Type.NUMBER },
                    value: { type: Type.NUMBER }
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

export const monetizationAssetsSchema = {
  type: Type.OBJECT,
  properties: {
    sponsorPitch: { type: Type.STRING, description: "A professional email to a potential sponsor." },
    affiliateCopy: { type: Type.STRING, description: "A short paragraph for an affiliate link." },
    merchandiseIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3 creative merchandise ideas." },
  },
  required: ['sponsorPitch', 'affiliateCopy', 'merchandiseIdeas'],
};