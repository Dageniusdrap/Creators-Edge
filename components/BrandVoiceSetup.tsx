import React, { useState, useEffect } from 'react';
import { TuningForkIcon } from './icons/TuningForkIcon';
import { useAppContext } from '../context/AppContext';
import type { BrandVoice } from '../types';

const TONES = ['Witty', 'Professional', 'Casual', 'Inspirational', 'Humorous', 'Authoritative', 'Friendly', 'Serious', 'Energetic'];

const Section: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div>
        <h3 className="text-md font-semibold text-gray-200">{title}</h3>
        <p className="text-xs text-gray-400 mb-2">{description}</p>
        {children}
    </div>
);

export const BrandVoiceSetup: React.FC = () => {
    const { brandVoice, setBrandVoice, addNotification } = useAppContext();
    const [currentVoice, setCurrentVoice] = useState<BrandVoice>(brandVoice);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    useEffect(() => {
        setCurrentVoice(brandVoice);
    }, [brandVoice]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setBrandVoice(currentVoice);
            addNotification('Brand voice saved successfully!', 'success');
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            addNotification('Failed to save brand voice.', 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const toggleTone = (tone: string) => {
        const newTones = currentVoice.tones.includes(tone)
            ? currentVoice.tones.filter(t => t !== tone)
            : [...currentVoice.tones, tone];
        setCurrentVoice({ ...currentVoice, tones: newTones });
    };
    
    const hasChanges = JSON.stringify(currentVoice) !== JSON.stringify(brandVoice);

    return (
        <div className="glass-card p-6 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center">
                <TuningForkIcon className="h-6 w-6 mr-3" />
                Define Your Brand Voice
            </h2>
            <p className="text-sm text-gray-300 mb-6">
                Teach the AI your unique style. The more detail you provide, the better the AI can match your voice in all generated content.
            </p>

            <div className="space-y-6">
                <Section title="Tone & Style" description="Select the tones that best describe your brand's personality.">
                    <div className="flex flex-wrap gap-2">
                        {TONES.map(tone => (
                            <button
                                key={tone}
                                onClick={() => toggleTone(tone)}
                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${currentVoice.tones.includes(tone) ? 'bg-indigo-600 text-white font-semibold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                            >
                                {tone}
                            </button>
                        ))}
                    </div>
                </Section>
                
                <Section title="Target Audience" description="Who are you talking to? Describe your ideal reader or viewer.">
                    <textarea
                        className="w-full h-24 p-3 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow text-white"
                        placeholder="e.g., Tech entrepreneurs, early-stage startup founders, and aspiring indie hackers aged 25-40."
                        value={currentVoice.audience}
                        onChange={(e) => setCurrentVoice({ ...currentVoice, audience: e.target.value })}
                    />
                </Section>

                <Section title="Keywords & Jargon" description="List any specific terms, phrases, or acronyms the AI should use or be aware of.">
                     <input
                        type="text"
                        className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow text-white"
                        placeholder="e.g., MRR, SaaS, product-market fit, churn rate"
                        value={currentVoice.keywords}
                        onChange={(e) => setCurrentVoice({ ...currentVoice, keywords: e.target.value })}
                    />
                </Section>

                <Section title="Writing Sample" description="Paste a short example of your content that best represents your voice. (Max 1000 characters)">
                    <textarea
                        maxLength={1000}
                        className="w-full h-32 p-3 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow text-white"
                        placeholder="e.g., 'Stop burning cash on features nobody wants. In this video, we're breaking down how to find true product-market fit, fast. No fluff, just actionable steps.'"
                        value={currentVoice.example}
                        onChange={(e) => setCurrentVoice({ ...currentVoice, example: e.target.value })}
                    />
                </Section>
            </div>


            <button
                className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
            >
                {isSaving ? 'Saving...' : (isSaved ? 'Saved!' : 'Save Brand Voice')}
            </button>
        </div>
    );
};