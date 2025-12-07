import React, { useState, useRef } from 'react';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ScoreGauge } from './ScoreGauge';
import { SpeakerPhoneIcon } from './icons/SpeakerPhoneIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ExportIcon } from './icons/ExportIcon';
import { KeyTakeawaysCard } from './KeyTakeawaysCard';
import { SocialPostCard } from './SocialPostCard';
import { ProductAdCard } from './ProductAdCard';
import { MonetizationAssetsCard } from './MonetizationAssetsCard';
import { GeneratedContentCard } from './GeneratedContentCard';
import { GeneratedContentSkeleton } from './skeletons/GeneratedContentSkeleton';
import { useAppContext } from '../context/AppContext';
import { exportCoachingAsTxt, exportViralityAsTxt } from '../utils/export';
import { motion } from 'framer-motion';
import { PencilIcon } from './icons/PencilIcon';
import { ShareIcon } from './icons/ShareIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { YouTubePostCard } from './YouTubePostCard';
import type { SocialPlatform, SuggestedAction } from '../types';


const SocialPlatformSelector: React.FC<{ onSelect: (platform: SocialPlatform) => void, onCancel: () => void }> = ({ onSelect, onCancel }) => (
    <div className="flex justify-around bg-black/20 p-1 rounded-md">
        <button onClick={() => onSelect('X')} className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-white/10">X</button>
        <button onClick={() => onSelect('LinkedIn')} className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-white/10">LinkedIn</button>
        <button onClick={() => onSelect('Instagram')} className="px-3 py-1 text-sm rounded-md text-gray-300 hover:bg-white/10">Instagram</button>
    </div>
);


export const CoachingCard: React.FC = () => {
    const { 
        analysisResult,
        improvedContent,
        isGeneratingImproved,
        keyTakeaways,
        isGeneratingKeyTakeaways,
        generatedDescription,
        isGeneratingDescription,
        feedbackAudio,
        isGeneratingAudio,
        handleGenerateImprovedContent,
        handleGenerateSocialPost,
        handleGenerateYouTubePost,
        handleGenerateProductAd,
        handleGenerateKeyTakeaways,
        handleGenerateDescription,
        handleListenToFeedback,
        handleCancel,
        handleGenerateVideoFromScript,
        handleListenToScript,
        isGeneratingScriptAudio,
        scriptAudio,
        handleGenerateMonetizationAssets,
        monetizationAssets,
        isGeneratingMonetizationAssets,
        suggestedActions,
        handleRunSuggestedAction,
    } = useAppContext();
    
    const [activeTab, setActiveTab] = useState<'insights' | 'toolkit'>('insights');
    const [voice, setVoice] = useState('Kore');
    const [style, setStyle] = useState('Default');
    const [showSocialSelector, setShowSocialSelector] = useState(false);
    
    if (!analysisResult) return null;

    const { feedbackCard, salesCallAnalysis, videoAnalysis } = analysisResult;
    const overallScore = salesCallAnalysis?.clarityScore ?? videoAnalysis?.overallScore;
    const viralityScore = salesCallAnalysis?.viralitySuggestions?.viralityScore ?? videoAnalysis?.viralityScore;
    
    const PROFESSIONAL_VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
    const VOICE_STYLES = ['Default', 'Cheerful', 'Animated', 'Energetic', 'Calm', 'Authoritative', 'Serious', 'Whispering', 'Storyteller', 'News Anchor'];

    const handleSocialClick = () => setShowSocialSelector(!showSocialSelector);
    const handleSocialSelect = (platform: SocialPlatform) => {
        handleGenerateSocialPost(platform);
        setShowSocialSelector(false);
    };

    const generationActions = [
        { id: 'improve', label: 'Improve Content', icon: PencilIcon, action: handleGenerateImprovedContent },
        { id: 'takeaways', label: 'Get Key Takeaways', icon: ListBulletIcon, action: handleGenerateKeyTakeaways },
        { id: 'description', label: 'Generate Description', icon: DocumentTextIcon, action: handleGenerateDescription },
        { id: 'social', label: 'Generate Social Post', icon: ShareIcon, action: handleSocialClick },
        { id: 'youtube', label: 'Generate YouTube Post', icon: YoutubeIcon, action: handleGenerateYouTubePost }, // NEW
        { id: 'ad', label: 'Generate Ad Script', icon: MegaphoneIcon, action: handleGenerateProductAd },
        { id: 'monetize', label: 'Generate Monetization Assets', icon: CurrencyDollarIcon, action: handleGenerateMonetizationAssets },
    ];

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">AI Coaching Hub</h3>
                { (overallScore || viralityScore) && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        {overallScore && <ScoreGauge score={overallScore} label="Clarity Score" />}
                        {viralityScore && <ScoreGauge score={viralityScore} label="Virality Score" />}
                    </div>
                )}
            </div>

            <div className="flex bg-black/20 rounded-lg p-1">
                <button onClick={() => setActiveTab('insights')} className={`w-1/2 py-2 text-sm font-semibold rounded-md relative transition-colors ${activeTab !== 'insights' ? 'text-gray-300 hover:text-white' : ''}`}>
                    {activeTab === 'insights' && <motion.div layoutId="coachingTab" className="absolute inset-0 bg-white/10 rounded-md shadow" />}
                    <span className="relative z-10">AI Insights</span>
                </button>
                <button onClick={() => setActiveTab('toolkit')} className={`w-1/2 py-2 text-sm font-semibold rounded-md relative transition-colors ${activeTab !== 'toolkit' ? 'text-gray-300 hover:text-white' : ''}`}>
                    {activeTab === 'toolkit' && <motion.div layoutId="coachingTab" className="absolute inset-0 bg-white/10 rounded-md shadow" />}
                    <span className="relative z-10">Generation Toolkit</span>
                </button>
            </div>

            {activeTab === 'insights' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4">
                    {suggestedActions && suggestedActions.length > 0 && (
                        <div className="p-4 bg-indigo-900/40 rounded-lg">
                            <h4 className="flex items-center text-lg font-semibold text-indigo-300 mb-3">
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Suggested Next Steps
                            </h4>
                            <div className="space-y-2">
                                {suggestedActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleRunSuggestedAction(action)}
                                        className="w-full text-left p-2 text-sm font-medium text-indigo-200 bg-indigo-500/30 rounded-md hover:bg-indigo-500/50"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {feedbackCard?.strengths && feedbackCard.strengths.length > 0 && (
                        <div>
                            <h4 className="flex items-center text-lg font-semibold text-green-400 mb-2">
                                <ThumbsUpIcon className="h-5 w-5 mr-2" />
                                Strengths
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                                {feedbackCard.strengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    {feedbackCard?.opportunities && feedbackCard.opportunities.length > 0 && (
                        <div>
                            <h4 className="flex items-center text-lg font-semibold text-yellow-400 mb-2">
                                <LightbulbIcon className="h-5 w-5 mr-2" />
                                Opportunities
                            </h4>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                                {feedbackCard.opportunities.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    <div className="p-4 bg-black/20 rounded-lg space-y-3">
                        {/* Audio Feedback UI */}
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-300">Listen to this Feedback</label>
                            {isGeneratingAudio ? (
                                <button onClick={() => handleCancel()} className="flex items-center px-3 py-1 text-xs font-medium text-red-400 bg-red-900/50 rounded-md hover:bg-red-900">
                                    <XCircleIcon className="h-4 w-4 mr-1" /> Cancel
                                </button>
                            ) : (
                                <button onClick={() => handleListenToFeedback(voice, style)} className="flex items-center px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-900/50 rounded-md hover:bg-indigo-900" aria-label="Listen to feedback">
                                    <SpeakerPhoneIcon className="h-4 w-4 mr-1" /> Listen
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                {PROFESSIONAL_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                            <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                {VOICE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {feedbackAudio?.url && (
                            <div className="pt-2 flex items-center gap-2">
                                <audio src={feedbackAudio.url} controls className="w-full" />
                                <a href={feedbackAudio.url} download="feedback_audio.mp3" className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:bg-white/20" aria-label="Download audio">
                                    <DownloadIcon className="h-5 w-5" />
                                </a>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {activeTab === 'toolkit' && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-3">
                    {generationActions.map(({ id, label, icon: Icon, action }) => (
                        <div key={id}>
                            <button
                                onClick={action}
                                className="w-full flex items-center p-3 text-left bg-black/20 rounded-lg hover:bg-indigo-500/20 transition-colors"
                            >
                                <Icon className="h-5 w-5 mr-3 text-indigo-400" />
                                <span className="font-semibold text-sm text-gray-200">{label}</span>
                            </button>
                            {id === 'social' && showSocialSelector && (
                                <div className="p-2 bg-black/20 rounded-b-lg">
                                    <SocialPlatformSelector onSelect={handleSocialSelect} onCancel={() => setShowSocialSelector(false)} />
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Generated Content Display */}
                    {isGeneratingImproved && <GeneratedContentSkeleton />}
                    {improvedContent && <GeneratedContentCard content={improvedContent} title="Improved Content" onGenerateVideoFromScript={handleGenerateVideoFromScript} onListenToScript={handleListenToScript} isGeneratingScriptAudio={isGeneratingScriptAudio} scriptAudio={scriptAudio} onCancel={() => handleCancel()} />}
                    
                    {isGeneratingKeyTakeaways && <GeneratedContentSkeleton />}
                    {keyTakeaways && <KeyTakeawaysCard takeaways={keyTakeaways} />}

                    {isGeneratingDescription && <GeneratedContentSkeleton />}
                    {generatedDescription && <GeneratedContentCard content={generatedDescription} title="Generated Description" onGenerateVideoFromScript={handleGenerateVideoFromScript} onListenToScript={handleListenToScript} isGeneratingScriptAudio={isGeneratingScriptAudio} scriptAudio={scriptAudio} onCancel={() => handleCancel()} />}
                    
                    <SocialPostCard />
                    <YouTubePostCard /> {/* NEW */}
                    <ProductAdCard />

                    {isGeneratingMonetizationAssets && <GeneratedContentSkeleton />}
                    {monetizationAssets && <MonetizationAssetsCard assets={monetizationAssets} />}
                </motion.div>
            )}
        </div>
    );
};