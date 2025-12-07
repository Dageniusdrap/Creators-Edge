import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { ExportIcon } from './icons/ExportIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ClosedCaptionIcon } from './icons/ClosedCaptionIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useAppContext } from '../context/AppContext';
import { 
    exportCustomReportAsTxt,
    exportBlueprintAsTxt, 
    exportCoachingAsTxt, 
    exportViralityAsTxt,
    exportTranscriptAsSrt
} from '../utils/export';

interface ExportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportOption: React.FC<{ icon: React.FC<any>, title: string, description: string, onExport: () => void }> = ({ icon: Icon, title, description, onExport }) => (
    <button
        onClick={onExport}
        className="w-full flex items-center p-4 text-left bg-white/5 rounded-lg hover:bg-indigo-500/20 transition-colors border border-transparent hover:border-indigo-500"
    >
        <div className="p-3 bg-indigo-500/20 rounded-lg mr-4">
            <Icon className="h-6 w-6 text-indigo-300" />
        </div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    </button>
);

export const ExportHubModal: React.FC<ExportHubModalProps> = ({ isOpen, onClose }) => {
    const { analysisResult, speakerARole, speakerBRole, viralScriptResult } = useAppContext();
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    const getSpeakerName = (speaker: string) => {
        if (speaker.toUpperCase() === 'A') return speakerARole === 'me' ? 'Me' : 'Client';
        if (speaker.toUpperCase() === 'B') return speakerBRole === 'me' ? 'Me' : 'Client';
        return speaker.charAt(0).toUpperCase() + speaker.slice(1).toLowerCase();
    };

    const handleExport = (content: string, filename: string, type = 'text/plain;charset=utf-8') => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onClose();
    };

    const renderExportOptions = () => {
        if (viralScriptResult) {
            return (
                <ExportOption
                    icon={DocumentTextIcon}
                    title="Export Blueprint (TXT)"
                    description="Download the full video blueprint as a text file."
                    onExport={() => handleExport(exportBlueprintAsTxt(viralScriptResult), 'viral_script_blueprint.txt')}
                />
            );
        }

        if (analysisResult) {
            const options = [];
            
            // Full Report
            options.push(
                 <ExportOption
                    key="full"
                    icon={DocumentTextIcon}
                    title="Full Report (TXT)"
                    description="A comprehensive text file of the entire analysis."
                    onExport={() => handleExport(exportCustomReportAsTxt(analysisResult, ['summary', 'strengths', 'opportunities', 'salesCallAnalysis', 'videoAnalysis', 'socialMediaAnalysis', 'productAdAnalysis', 'documentAnalysis', 'financialReportAnalysis', 'abTestAnalysis', 'transcript'], getSpeakerName), 'full_report.txt')}
                />
            );

            // Transcript
            if (analysisResult.transcript && analysisResult.transcript.length > 0) {
                 options.push(
                     <ExportOption
                        key="srt"
                        icon={ClosedCaptionIcon}
                        title="Transcript (SRT)"
                        description="Download a timestamped subtitle file for your video."
                        onExport={() => handleExport(exportTranscriptAsSrt(analysisResult.transcript!), 'transcript.srt')}
                    />
                );
            }
            
            // Coaching & Virality
             if (analysisResult.videoAnalysis) {
                 options.push(
                     <ExportOption
                        key="coaching"
                        icon={SparklesIcon}
                        title="AI Coaching (TXT)"
                        description="Export just the AI's coaching suggestions."
                        onExport={() => handleExport(exportCoachingAsTxt(analysisResult), 'ai_coaching.txt')}
                    />
                );
                 options.push(
                     <ExportOption
                        key="virality"
                        icon={SparklesIcon}
                        title="Virality Blueprint (TXT)"
                        description="Export the suggestions for making your content go viral."
                        onExport={() => handleExport(exportViralityAsTxt(analysisResult), 'virality_blueprint.txt')}
                    />
                );
            }
            return options;
        }
        
        return <p className="text-sm text-gray-400 text-center">No exportable content available.</p>;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="glass-card w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white flex items-center"><ExportIcon className="h-5 w-5 mr-3"/> Export Hub</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-3">
                    {renderExportOptions()}
                </div>

                <div className="p-4 border-t border-white/10 mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full p-2 text-sm font-semibold text-gray-300 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};