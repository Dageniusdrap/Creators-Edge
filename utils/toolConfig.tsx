import React from 'react';
import { VideoCameraIcon } from '../components/icons/VideoCameraIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import { MagicWandIcon } from '../components/icons/MagicWandIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { TuningForkIcon } from '../components/icons/TuningForkIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { BroadcastIcon } from '../components/icons/BroadcastIcon';
import { PiggyBankIcon } from '../components/icons/PiggyBankIcon';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { CurrencyDollarIcon } from '../components/icons/CurrencyDollarIcon';
import { FilmIcon } from '../components/icons/FilmIcon';
import { ScaleIcon } from '../components/icons/ScaleIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { CycleIcon } from '../components/icons/CycleIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { KeyIcon } from '../components/icons/KeyIcon';
import { HomeIcon } from '../components/icons/HomeIcon';
import type { AppAnalysisType } from '../types';

export const toolConfig: Record<AppAnalysisType | 'home', { label: string, icon: React.FC<any>, description: string, category: string }> = {
  home: { label: 'Home', icon: HomeIcon, description: 'Your creative workspace and starting point.', category: 'home' },
  contentGeneration: { label: 'Generate', icon: MagicWandIcon, description: 'Create brand-new content from scratch, from viral video scripts to professional voiceovers.', category: 'main' },
  repurposeContent: { label: 'Repurpose', icon: CycleIcon, description: 'Turn one piece of long-form content into a multi-platform content suite automatically.', category: 'main' },
  abTest: { label: 'A/B Test', icon: ScaleIcon, description: 'Compare two pieces of content side-by-side to see which one will perform better.', category: 'main' },
  liveDebugger: { label: 'Live Debug', icon: MicrophoneIcon, description: 'Get real-time feedback and transcription with a live conversational AI session.', category: 'main' },
  videoAnalysis: { label: 'Video', icon: VideoCameraIcon, description: "Get an expert analysis of your video, including hook quality, editing suggestions, and refined captions to boost performance.", category: 'main' },
  thumbnailAnalysis: { label: 'Thumbnail Grader', icon: EyeIcon, description: 'Analyze your video thumbnail for clarity, emotional impact, and text readability to maximize clicks.', category: 'main' },
  transcription: { label: 'Transcription', icon: FilmIcon, description: 'Extract a full transcript and key takeaways from any video or audio file.', category: 'main' },
  liveStream: { label: 'Live Stream', icon: BroadcastIcon, description: 'Analyze recorded live streams to find peak engagement moments and monetization opportunities.', category: 'main' },
  documentAnalysis: { label: 'Document', icon: DocumentTextIcon, description: 'Evaluate text documents for clarity, tone, and key takeaways. Perfect for refining articles or reports.', category: 'main' },
  financialReport: { label: 'Financial Report', icon: CurrencyDollarIcon, description: 'Analyze financial documents like earnings reports or market analyses. Extract key metrics, summarize findings, and assess sentiment.', category: 'main' },
  socialMedia: { label: 'Social', icon: UsersIcon, description: 'Analyze the effectiveness of your social media posts, including hooks, visuals, and calls-to-action.', category: 'main' },
  salesCall: { label: 'Sales Call', icon: TrendingUpIcon, description: "Get expert sales coaching and viral marketing ideas from your calls. The AI analyzes sales techniques and identifies content moments that could go viral, complete with performance predictions.", category: 'main' },
  productAd: { label: 'Product Ad', icon: SparklesIcon, description: 'Get feedback on your product ad scripts or videos to maximize clarity, impact, and conversions.', category: 'main' },
  brandVoiceScore: { label: 'Brand Voice Score', icon: TargetIcon, description: 'Check how well any piece of text aligns with your saved brand voice.', category: 'other' },
  retirementPlanner: { label: 'Retirement', icon: PiggyBankIcon, description: 'Plan your financial future with an AI-powered retirement calculator and strategy generator.', category: 'other' },
  brandVoice: { label: 'Brand Voice', icon: TuningForkIcon, description: 'Define and save your unique brand voice to ensure all AI-generated content is consistent and on-brand.', category: 'settings' },
  apiKeys: { label: 'API Keys', icon: KeyIcon, description: 'Manage your Google AI Studio API key for premium features.', category: 'settings' },
  pricing: { label: 'Pricing', icon: () => <span className="text-2xl font-bold">$</span>, description: 'View and manage your subscription plan to unlock more features and higher limits.', category: 'settings' }
};