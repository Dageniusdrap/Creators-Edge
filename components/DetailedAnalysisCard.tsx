import React, { useState } from 'react';
import { ScoreGauge } from './ScoreGauge';
import {
    VideoAnalysis,
    SalesCallAnalysis,
    SocialMediaAnalysis,
    DocumentAnalysis,
    FinancialReportAnalysis,
    LiveStreamAnalysis,
    AdAnalysis as ProductAdAnalysis,
    EditingSuggestion,
    ABTestAnalysis,
    RepurposeAnalysis,
    ShortFormScript,
    ThumbnailAnalysis,
    BrandVoiceScoreAnalysis,
} from '../types';
import { FilmStripIcon } from './icons/FilmStripIcon';
import { SoundBarsIcon } from './icons/SoundBarsIcon';
import { TextIcon } from './icons/TextIcon';
import { CutIcon } from './icons/CutIcon';
import { AudioIcon } from './icons/AudioIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SentimentArcGraph } from './SentimentArcGraph';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClockIcon } from './icons/ClockIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

interface DetailedAnalysisCardProps {
    title: string;
    data: any;
}

const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="space-y-2" open={defaultOpen}>
        <summary className="font-semibold text-lg text-gray-700 dark:text-gray-300 cursor-pointer">{title}</summary>
        <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-4 pt-2">{children}</div>
    </details>
);

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</h5>
        <div className="text-sm text-gray-800 dark:text-gray-200">{value}</div>
    </div>
);

const ScoreItem: React.FC<{ label: string; score: number; critique: string; suggestion?: string }> = ({ label, score, critique, suggestion }) => (
    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <div className="flex justify-between items-center">
            <h5 className="font-semibold text-gray-700 dark:text-gray-300">{label}</h5>
            <span className={`font-bold text-lg ${score > 7 ? 'text-green-500' : score > 4 ? 'text-yellow-500' : 'text-red-500'}`}>{score.toFixed(1)}/10</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1"><strong className="text-gray-600 dark:text-gray-300">Critique:</strong> {critique}</p>
        {suggestion && <p className="text-xs text-green-600 dark:text-green-400 mt-1"><strong className="text-green-700 dark:text-green-300">Suggestion:</strong> {suggestion}</p>}
    </div>
);

const SuggestionList: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
);

const EditingSuggestionCard: React.FC<{ suggestion: EditingSuggestion }> = ({ suggestion }) => {
    const icons: Record<string, React.FC<any>> = {
        'Cut': CutIcon,
        'Effect': FilmStripIcon,
        'Text': TextIcon,
        'Audio': AudioIcon,
    };
    const Icon = icons[suggestion.type] || FilmStripIcon;
    return (
        <div className="flex items-start space-x-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md">
            <Icon className="h-5 w-5 flex-shrink-0 text-indigo-400 mt-0.5" />
            <div>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-1 rounded">{suggestion.timestamp}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.suggestion}</p>
            </div>
        </div>
    );
};

const DefaultDetails: React.FC<{ data: any }> = ({ data }) => (
    <div className="p-4 space-y-3">
        {Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' || Array.isArray(value)) return null;
            return <InfoItem key={key} label={formatKey(key)} value={String(value)} />;
        })}
        {data.keyPoints && <Section title="Key Points"><SuggestionList items={data.keyPoints} /></Section>}
        {data.keyTakeaways && <Section title="Key Takeaways"><SuggestionList items={data.keyTakeaways} /></Section>}
        {data.monetizationOpportunities && <Section title="Monetization Opportunities"><SuggestionList items={data.monetizationOpportunities} /></Section>}
    </div>
);

const FinancialReportDetails: React.FC<{ data: FinancialReportAnalysis }> = ({ data }) => (
    <div className="p-4 space-y-6">
        <InfoItem label="Overall Sentiment" value={<span className={`font-bold text-lg ${data.overallSentiment === 'Positive' ? 'text-green-500' : data.overallSentiment === 'Negative' ? 'text-red-500' : 'text-yellow-500'}`}>{data.overallSentiment}</span>} />
        <InfoItem label="Executive Summary" value={<p>{data.summary}</p>} />
        {data.eli5Summary && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300 flex items-center"><LightbulbIcon className="h-4 w-4 mr-2" />Explain Like I'm 5</h5>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">{data.eli5Summary}</p>
            </div>
        )}
        {data.forwardLookingAnalysis && (
            <Section title="Forward-Looking Analysis">
                <InfoItem label="Tone" value={<span className={`font-semibold ${data.forwardLookingAnalysis.tone === 'Optimistic' ? 'text-green-400' : data.forwardLookingAnalysis.tone === 'Pessimistic' ? 'text-red-400' : 'text-yellow-400'}`}>{data.forwardLookingAnalysis.tone}</span>} />
                <InfoItem label="Summary" value={<p>{data.forwardLookingAnalysis.summary}</p>} />
            </Section>
        )}
        <Section title="Key Metrics" defaultOpen>
            <div className="space-y-4">
                {data.keyMetrics.map((item, i) => (
                    <InfoItem key={i} label={item.metric} value={<><span className="font-bold text-lg text-white">{item.value}</span> <p className="text-xs text-gray-400 italic mt-1">{item.analysis}</p></>} />
                ))}
            </div>
        </Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Key Opportunities">
                <SuggestionList items={data.keyOpportunities} />
            </Section>
            <Section title="Key Risks">
                <ul className="list-disc list-inside space-y-1 text-sm text-red-400">
                    {data.keyRisks.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </Section>
        </div>
        {data.redFlags && data.redFlags.length > 0 && (
            <Section title="Potential Red Flags">
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-400">
                    {data.redFlags.map((item, i) => <li key={i} className="flex items-start"><ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" /><span>{item}</span></li>)}
                </ul>
            </Section>
        )}
    </div>
);

const SalesCallAnalysisDetails: React.FC<{ data: SalesCallAnalysis }> = ({ data }) => {
    const { speakerARole, speakerBRole } = data; // Unpack roles passed through `data`
    const meRatio = speakerARole === 'me' ? data.talkTimeRatio?.A : data.talkTimeRatio?.B;
    const clientRatio = speakerBRole === 'me' ? data.talkTimeRatio?.A : data.talkTimeRatio?.B;
    const questionData = data.questionAnalysis ? [{ name: 'Questions', Open: data.questionAnalysis.openEnded, Closed: data.questionAnalysis.closedEnded }] : [];

    return (
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreGauge score={data.clarityScore} label="Clarity" />
                <ScoreGauge score={data.confidenceScore} label="Confidence" />
                {data.brandVoiceAlignment && <ScoreGauge score={data.brandVoiceAlignment.score} label="Brand Align" />}
                {data.nextStepsClarity && <ScoreGauge score={data.nextStepsClarity.score} label="Next Steps" />}
            </div>
            {data.sentimentArc && data.sentimentArc.length > 0 && (
                <Section title="Client Sentiment Arc" defaultOpen>
                    <div className="h-48">
                        <SentimentArcGraph data={data.sentimentArc} />
                    </div>
                </Section>
            )}
            {meRatio !== undefined && clientRatio !== undefined && (
                <Section title="Talk Time Ratio">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 flex overflow-hidden">
                        <div className="bg-indigo-500 h-4" style={{ width: `${meRatio}%` }} title={`Me: ${meRatio}%`} />
                        <div className="bg-green-500 h-4" style={{ width: `${clientRatio}%` }} title={`Client: ${clientRatio}%`} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span className="font-semibold text-indigo-400">Me: {meRatio}%</span>
                        <span className="font-semibold text-green-400">Client: {clientRatio}%</span>
                    </div>
                </Section>
            )}
            {data.questionAnalysis && (
                <Section title="Salesperson's Question Analysis">
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={questionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="Open" stackId="a" fill="#34d399" name="Open-Ended" />
                                <Bar dataKey="Closed" stackId="a" fill="#fbbf24" name="Closed-Ended" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-around text-xs mt-1">
                        <span className="font-semibold text-green-400">Open-Ended: {data.questionAnalysis.openEnded}</span>
                        <span className="font-semibold text-yellow-400">Closed-Ended: {data.questionAnalysis.closedEnded}</span>
                    </div>
                </Section>
            )}
            <Section title="Coaching Breakdown">
                <InfoItem label="Overall Performance" value={<p>{data.overallPerformance}</p>} />
                <InfoItem label="Rapport Building" value={<p>{data.rapportBuilding}</p>} />
                <InfoItem label="Needs Discovery" value={<p>{data.needsDiscovery}</p>} />
                <InfoItem label="Objection Handling" value={<p>{data.objectionHandling}</p>} />
                <InfoItem label="Closing Effectiveness" value={<p>{data.closingEffectiveness}</p>} />
            </Section>
            <Section title="Areas for Improvement">
                <SuggestionList items={data.areasOfImprovement} />
            </Section>
        </div>
    );
};

const VideoAnalysisDetails: React.FC<{ data: VideoAnalysis }> = ({ data }) => (
    <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreGauge score={data.overallScore} label="Overall Score" />
            <ScoreGauge score={data.viralityScore} label="Virality Score" />
            <ScoreGauge score={data.hookQuality.score} label="Hook Quality" />
            <ScoreGauge score={data.thumbnailSuggestion.score} label="Thumbnail" />
        </div>
        <Section title="Core Analysis" defaultOpen>
            <InfoItem label="Message Clarity" value={<p>{data.messageClarity}</p>} />
            <InfoItem label="Editing Style" value={<p>{data.editingStyle}</p>} />
            <InfoItem label="Suggested Audience" value={<p>{data.suggestedAudience}</p>} />
        </Section>
        <Section title="Actionable Suggestions" defaultOpen>
            <ScoreItem label="Hook" {...data.hookQuality} />
            <ScoreItem label="Thumbnail" {...data.thumbnailSuggestion} />
            {data.ctaEffectiveness && <ScoreItem label="Call-to-Action" {...data.ctaEffectiveness} />}
        </Section>
        {data.editingSuggestions && data.editingSuggestions.length > 0 && (
            <Section title="Editing Suggestions">
                <div className="space-y-2">
                    {data.editingSuggestions.map((s, i) => <EditingSuggestionCard key={i} suggestion={s} />)}
                </div>
            </Section>
        )}
        {data.suggestedTitles && <Section title="Suggested Titles"><SuggestionList items={data.suggestedTitles} /></Section>}
        {data.suggestedTags && <Section title="Suggested Tags"><div className="flex flex-wrap gap-2">{data.suggestedTags.map(t => <span key={t} className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">{t}</span>)}</div></Section>}
    </div>
);

const SocialMediaAnalysisDetails: React.FC<{ data: SocialMediaAnalysis }> = ({ data }) => (
    <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreGauge score={data.overallScore} label="Overall" />
            <ScoreGauge score={data.viralityScore} label="Virality" />
            <ScoreGauge score={data.hookEffectiveness.score} label="Hook" />
            <ScoreGauge score={data.callToAction.score} label="CTA" />
        </div>
        <Section title="Content Breakdown" defaultOpen>
            <ScoreItem label="Hook" {...data.hookEffectiveness} />
            <ScoreItem label="Visual Appeal" {...data.visualAppeal} />
            <ScoreItem label="Call to Action" {...data.callToAction} />
            {data.accessibility && <ScoreItem label="Accessibility" {...data.accessibility} />}
        </Section>
        {data.abTestSuggestions && (
            <Section title="A/B Test Ideas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">Alternative Hooks</h5>
                        <SuggestionList items={data.abTestSuggestions.hooks} />
                    </div>
                    <div>
                        <h5 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">Alternative CTAs</h5>
                        <SuggestionList items={data.abTestSuggestions.ctas} />
                    </div>
                </div>
            </Section>
        )}
        {(data.optimalPostingTime || data.contentFormatSuggestion) && (
            <Section title="Strategy">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.optimalPostingTime && <InfoItem label="Optimal Posting Time" value={<div className="flex items-center"><ClockIcon className="h-4 w-4 mr-2" /><span>{data.optimalPostingTime}</span></div>} />}
                    {data.contentFormatSuggestion && <InfoItem label="Suggested Format" value={<div className="flex items-center"><DocumentDuplicateIcon className="h-4 w-4 mr-2" /><span>{data.contentFormatSuggestion}</span></div>} />}
                </div>
            </Section>
        )}
        {data.captionAndHashtags && (
            <Section title="Caption & Hashtags">
                <InfoItem label="Critique" value={<p>{data.captionAndHashtags.critique}</p>} />
                <InfoItem label="Suggested Caption" value={<pre className="text-sm bg-gray-100 dark:bg-gray-900/50 p-2 rounded-md whitespace-pre-wrap font-sans">{data.captionAndHashtags.suggestedCaption}</pre>} />
                <InfoItem label="Suggested Hashtags" value={<div className="flex flex-wrap gap-1">{data.captionAndHashtags.suggestedHashtags.map(t => <span key={t} className="text-xs text-blue-400">{t}</span>)}</div>} />
            </Section>
        )}
    </div>
);

const ProductAdAnalysisDetails: React.FC<{ data: ProductAdAnalysis }> = ({ data }) => (
    <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreGauge score={data.overallScore} label="Overall" />
            <ScoreGauge score={data.viralityScore} label="Virality" />
            <ScoreGauge score={data.hookEffectiveness.score} label="Hook" />
            <ScoreGauge score={data.ctaEffectiveness.score} label="CTA" />
        </div>
        <Section title="Core Analysis" defaultOpen>
            <InfoItem label="Clarity of Message" value={<p>{data.clarityOfMessage}</p>} />
            <InfoItem label="Target Audience Alignment" value={<p>{data.targetAudienceAlignment}</p>} />
            <InfoItem label="Emotional Impact" value={<p>{data.emotionalImpact}</p>} />
        </Section>
        {data.problemSolutionFramework && <Section title="Creative Framework"><ScoreItem label="Problem/Solution Framework" {...data.problemSolutionFramework} /></Section>}
        {data.brandMentionAnalysis && <Section title="Brand Mentions"><InfoItem label="Analysis" value={<p>{data.brandMentionAnalysis.critique}</p>} /><InfoItem label="Suggestions" value={<SuggestionList items={data.brandMentionAnalysis.suggestions} />} /></Section>}
        {data.adPlatformSuitability && <Section title="Platform Suitability"><InfoItem label="Best For" value={<div className="flex flex-wrap gap-2">{data.adPlatformSuitability.map(p => <span key={p} className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">{p}</span>)}</div>} /></Section>}
    </div>
);

const DocumentAnalysisDetails: React.FC<{ data: DocumentAnalysis }> = ({ data }) => {
    const { handleGenerateReframedContent, generatedReframedContent, isGeneratingReframedContent } = useAppContext();
    const [targetAudience, setTargetAudience] = useState('');

    const handleReframe = () => {
        if (targetAudience.trim()) {
            handleGenerateReframedContent(data.summary, targetAudience);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScoreGauge score={data.clarityScore} label="Clarity" />
                {data.readabilityScore && <ScoreGauge score={data.readabilityScore.score / 10} label={`Readability (${data.readabilityScore.gradeLevel})`} />}
                {data.actionabilityScore && <ScoreGauge score={data.actionabilityScore.score} label="Actionability" />}
            </div>
            <InfoItem label="Summary" value={<p>{data.summary}</p>} />
            {data.keyPoints && <Section title="Key Points"><SuggestionList items={data.keyPoints} /></Section>}
            <Section title="Content Reframing" defaultOpen>
                {data.contentReframing?.map((item, i) => (
                    <InfoItem key={i} label={`For: ${item.audience}`} value={<p className="text-xs italic">{item.summary}</p>} />
                ))}
                {generatedReframedContent && (
                    <InfoItem label={`For: ${generatedReframedContent.audience}`} value={<p className="text-xs italic">{generatedReframedContent.summary}</p>} />
                )}
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g., a 5th grader, a busy CEO"
                        className="flex-grow p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button onClick={handleReframe} disabled={isGeneratingReframedContent} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isGeneratingReframedContent ? 'Reframing...' : 'Reframe'}
                    </button>
                </div>
            </Section>
        </div>
    );
};

const ABTestAnalysisDetails: React.FC<{ data: ABTestAnalysis }> = ({ data }) => (
    <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content A */}
            <div className="p-4 bg-black/10 rounded-lg">
                <h3 className="text-lg font-bold text-center mb-4 text-white">Content A</h3>
                <ScoreGauge score={data.contentA.overallScore} label="Overall Score" />
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-300">Critique:</h4>
                    <p className="text-sm text-gray-400 italic">{data.contentA.critique}</p>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-300">Key Strengths:</h4>
                    <SuggestionList items={data.contentA.keyStrengths} />
                </div>
            </div>
            {/* Content B */}
            <div className="p-4 bg-black/10 rounded-lg">
                <h3 className="text-lg font-bold text-center mb-4 text-white">Content B</h3>
                <ScoreGauge score={data.contentB.overallScore} label="Overall Score" />
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-300">Critique:</h4>
                    <p className="text-sm text-gray-400 italic">{data.contentB.critique}</p>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-300">Key Strengths:</h4>
                    <SuggestionList items={data.contentB.keyStrengths} />
                </div>
            </div>
        </div>

        {/* Comparison Summary */}
        <div className="p-4 bg-indigo-900/30 rounded-lg">
            <h3 className="text-xl font-bold text-center mb-2 text-indigo-300">🏆 AI Recommendation 🏆</h3>
            <p className="text-center font-semibold text-lg text-white mb-2">The winner is: <span className="text-yellow-300">{data.winner}</span></p>
            <InfoItem label="Reasoning" value={<p className="text-sm text-indigo-200">{data.reasoning}</p>} />
        </div>
        <div className="p-4 bg-green-900/30 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-green-300">✨ Hybrid Suggestion</h3>
            <p className="text-sm text-green-200 italic">{data.hybridSuggestion}</p>
        </div>
    </div>
);

const ThumbnailAnalysisDetails: React.FC<{ data: ThumbnailAnalysis }> = ({ data }) => {
    const { handleGenerateThumbnailVariations } = useAppContext();
    const suggestionsString = data.improvementSuggestions.join(', ');

    return (
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreGauge score={data.overallScore} label="Overall" />
                <ScoreGauge score={data.clarity.score} label="Clarity" />
                <ScoreGauge score={data.emotionalImpact.score} label="Impact" />
                <ScoreGauge score={data.textReadability.score} label="Readability" />
            </div>
            <Section title="Detailed Breakdown" defaultOpen>
                <ScoreItem label="Clarity" {...data.clarity} />
                <ScoreItem label="Emotional Impact" {...data.emotionalImpact} />
                <ScoreItem label="Text Readability" {...data.textReadability} />
            </Section>
            <Section title="Actionable Improvements">
                <SuggestionList items={data.improvementSuggestions} />
            </Section>
            <div className="pt-4">
                <button
                    onClick={() => handleGenerateThumbnailVariations(suggestionsString)}
                    className="w-full flex items-center justify-center p-3 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Generate Variations Based on Suggestions
                </button>
            </div>
        </div>
    );
};

const BrandVoiceScoreDetails: React.FC<{ data: BrandVoiceScoreAnalysis }> = ({ data }) => (
    <div className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
                <ScoreGauge score={data.score} label="Alignment Score" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-300">{data.analysis}</p>
            </div>
        </div>
    </div>
);


const RepurposeAnalysisDetails: React.FC<{ data: RepurposeAnalysis }> = ({ data }) => {
    const { handleGenerateVideoFromScript } = useAppContext();
    const [activeTab, setActiveTab] = useState<'tiktok' | 'blog' | 'linkedin' | 'twitter'>('tiktok');
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    const handleCopy = (key: string, content: string) => {
        navigator.clipboard.writeText(content);
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
    };

    const tabs = [
        { id: 'tiktok', label: 'Short-Form Scripts' },
        { id: 'blog', label: 'Blog Post' },
        { id: 'linkedin', label: 'LinkedIn Post' },
        { id: 'twitter', label: 'Twitter Thread' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'tiktok':
                return (
                    <div className="space-y-4">
                        {data.shortFormScripts.map((item, index) => (
                            <div key={index} className="p-4 bg-black/20 rounded-lg">
                                <h5 className="font-semibold text-white">{item.title}</h5>
                                <pre className="mt-2 text-xs text-gray-400 whitespace-pre-wrap font-sans max-h-40 overflow-y-auto">{item.script}</pre>
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => handleCopy(`script-${index}`, item.script)} className="flex items-center px-3 py-1 text-xs font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                                        {copiedStates[`script-${index}`] ? <CheckIcon className="h-4 w-4 mr-1 text-green-500" /> : <DocumentDuplicateIcon className="h-4 w-4 mr-1" />} Copy
                                    </button>
                                    <button onClick={() => handleGenerateVideoFromScript(item.script)} className="flex items-center px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
                                        <VideoCameraIcon className="h-4 w-4 mr-1" /> Send to Generator
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'blog':
            case 'linkedin':
            case 'twitter':
                const contentKey = activeTab === 'blog' ? 'blogPost' : activeTab === 'linkedin' ? 'linkedInPost' : 'twitterThread';
                const content = data[contentKey];
                return (
                    <div className="p-4 bg-black/20 rounded-lg relative">
                        <button onClick={() => handleCopy(contentKey, content)} className="absolute top-2 right-2 flex items-center px-3 py-1 text-xs font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/10">
                            {copiedStates[contentKey] ? <CheckIcon className="h-4 w-4 mr-1 text-green-500" /> : <DocumentDuplicateIcon className="h-4 w-4 mr-1" />} Copy
                        </button>
                        <pre className="text-sm text-gray-400 whitespace-pre-wrap font-sans">{content.replace(/---/g, '\n\n---\n\n')}</pre>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="p-4 space-y-4">
            <div className="border-b border-white/20">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`${tab.id === activeTab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {renderContent()}
        </div>
    );
};

export const DetailedAnalysisCard: React.FC<DetailedAnalysisCardProps> = ({ title, data }) => {
    const { analysisType, addNotification } = useAppContext();
    const [copied, setCopied] = useState(false);

    const formatDataToText = (obj: any, depth = 0): string => {
        let result = '';
        const indent = '  '.repeat(depth);

        for (const [key, value] of Object.entries(obj)) {
            if (value === null || value === undefined) continue;

            const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            if (typeof value === 'object' && !Array.isArray(value)) {
                result += `${indent}${readableKey}:\n${formatDataToText(value, depth + 1)}`;
            } else if (Array.isArray(value)) {
                result += `${indent}${readableKey}:\n`;
                value.forEach(item => {
                    if (typeof item === 'object') {
                        result += `${indent}  - \n${formatDataToText(item, depth + 2)}`;
                    } else {
                        result += `${indent}  - ${item}\n`;
                    }
                });
            } else {
                result += `${indent}${readableKey}: ${value}\n`;
            }
        }
        return result;
    };

    const handleCopyReport = () => {
        const text = `${title}\n\n${formatDataToText(data)}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        addNotification('Full analysis report copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const renderDetails = () => {
        switch (analysisType) {
            case 'repurposeContent':
                return <RepurposeAnalysisDetails data={data} />;
            case 'brandVoiceScore':
                return <BrandVoiceScoreDetails data={data} />;
            case 'salesCall':
                return <SalesCallAnalysisDetails data={data} />;
            case 'videoAnalysis':
                return <VideoAnalysisDetails data={data} />;
            case 'socialMedia':
                return <SocialMediaAnalysisDetails data={data} />;
            case 'productAd':
                return <ProductAdAnalysisDetails data={data} />;
            case 'transcription':
            case 'documentAnalysis':
                return <DocumentAnalysisDetails data={data} />;
            case 'financialReport':
                return <FinancialReportDetails data={data} />;
            case 'abTest':
                return <ABTestAnalysisDetails data={data} />;
            case 'thumbnailAnalysis':
                return <ThumbnailAnalysisDetails data={data} />;
            default:
                // For LiveStreamAnalysis and any others without a custom view
                return <DefaultDetails data={data} />;
        }
    };

    return (
        <>
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button
                    onClick={handleCopyReport}
                    className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                >
                    {copied ? <CheckIcon className="h-4 w-4 mr-1.5 text-green-500" /> : <ClipboardIcon className="h-4 w-4 mr-1.5" />}
                    {copied ? 'Copied' : 'Copy Report'}
                </button>
            </div>
            {renderDetails()}
        </>
    );
};