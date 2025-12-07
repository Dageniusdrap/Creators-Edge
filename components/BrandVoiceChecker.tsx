import React, { useState } from 'react';
import { TargetIcon } from './icons/TargetIcon';
import { useAppContext } from '../context/AppContext';
import { ScoreGauge } from './ScoreGauge';
import { SparklesIcon } from './icons/SparklesIcon';
import { Loader } from './Loader';

export const BrandVoiceChecker: React.FC = () => {
    const {
        isAnalyzing,
        brandVoiceScoreAnalysis,
        handleScoreBrandVoiceAlignment
    } = useAppContext();
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (text.trim()) {
            handleScoreBrandVoiceAlignment(text);
        }
    };

    return (
        <div className="glass-card p-6 w-full max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center">
                    <TargetIcon className="h-6 w-6 mr-3" />
                    Brand Voice Score
                </h2>
                <p className="text-sm text-gray-300 mt-2">
                    Paste any text below to see how well it aligns with your saved brand voice.
                </p>
            </div>

            <textarea
                className="w-full h-48 p-3 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow text-white"
                placeholder="Paste your script, email, or social media post here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleSubmit}
                disabled={isAnalyzing || !text.trim()}
            >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {isAnalyzing ? 'Scoring...' : 'Score Alignment'}
            </button>

            {isAnalyzing && !brandVoiceScoreAnalysis && <Loader message="Analyzing voice..." />}

            {brandVoiceScoreAnalysis && (
                <div className="mt-6 p-4 bg-black/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-center text-white mb-4">Alignment Results</h3>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            <ScoreGauge score={brandVoiceScoreAnalysis.score} label="Alignment Score" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-300">{brandVoiceScoreAnalysis.analysis}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};