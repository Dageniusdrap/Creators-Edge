import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ClockIcon } from './icons/ClockIcon';
import type { AnalysisHistoryItem, AnalysisType } from '../types';
import { toolConfig } from '../utils/toolConfig';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const AnalysisHistoryModal: React.FC = () => {
    const { 
        isHistoryOpen, 
        setIsHistoryOpen, 
        analysisHistory, 
        handleSelectFromHistory, 
        handleClearAnalysisHistory, 
        handleDeleteAnalysisHistoryItem 
    } = useAppContext();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsHistoryOpen(false);
            }
        };
        if (isHistoryOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isHistoryOpen, setIsHistoryOpen]);

    if (!isHistoryOpen) return null;
    
    const analysisTypeDetails: Record<string, { icon: React.FC<any>, color: string }> = Object.entries(toolConfig).reduce((acc, [key, val]) => {
        const colors: Record<string, string> = {
            videoAnalysis: 'text-red-400',
            salesCall: 'text-green-400',
            socialMedia: 'text-blue-400',
            productAd: 'text-yellow-400',
            contentGeneration: 'text-purple-400',
            brandVoice: 'text-pink-400',
            pricing: 'text-teal-400',
            retirementPlanner: 'text-orange-400',
            liveDebugger: 'text-cyan-400',
            default: 'text-gray-400'
        };
        const color = Object.keys(colors).find(c => key.toLowerCase().includes(c)) || 'default';
        acc[key as AnalysisType] = { icon: val.icon, color: colors[color] };
        return acc;
    }, {} as Record<string, { icon: React.FC<any>, color: string }>);

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const getSummary = (item: AnalysisHistoryItem): string => {
        if (item.fileName) return item.fileName;
        const result = item.result;
        if(result.salesCallAnalysis?.summary) return result.salesCallAnalysis.summary;
        if(result.videoAnalysis?.suggestedTitles?.[0]) return result.videoAnalysis.suggestedTitles[0];
        if(result.documentAnalysis?.summary) return result.documentAnalysis.summary;
        if(result.transcript?.[0]?.text) return `Transcript starting with: "${result.transcript[0].text}"`;
        return "Text-based analysis";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setIsHistoryOpen(false)}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card w-full max-w-lg max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Analysis History</h2>
                    <div className="flex items-center space-x-4">
                        {analysisHistory && analysisHistory.length > 0 && (
                             <button onClick={handleClearAnalysisHistory} className="flex items-center text-sm text-red-400 hover:text-red-300 font-medium">
                                <TrashIcon className="h-4 w-4 mr-1" />
                                Clear All
                            </button>
                        )}
                        <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-white">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                    {analysisHistory && analysisHistory.length > 0 ? (
                        <div className="space-y-3">
                            {analysisHistory.map((item) => {
                                const DetailsIcon = analysisTypeDetails[item.analysisType]?.icon || ClockIcon;
                                const iconColor = analysisTypeDetails[item.analysisType]?.color || 'text-gray-400';
                                return (
                                    <div key={item.timestamp} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden group">
                                        <div className="p-4 cursor-pointer" onClick={() => handleSelectFromHistory(item)}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-3">
                                                    <DetailsIcon className={`h-6 w-6 flex-shrink-0 ${iconColor}`} />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors truncate">{getSummary(item)}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteAnalysisHistoryItem(item.timestamp); }} className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <ClockIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="font-semibold text-lg text-white">No Analysis History</p>
                            <p className="text-sm">Your past analyses will appear here.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};