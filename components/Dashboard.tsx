import React, { useState, useEffect, useRef } from 'react';
import { PerformanceGraph } from './PerformanceGraph';
import { Transcript } from './Transcript';
import { DetailedAnalysisCard } from './DetailedAnalysisCard';
import { CoachingCard } from './CoachingCard';
import { MediaPreviewCard } from './MediaPreviewCard';
import { KeywordAnalysisCard } from './KeywordAnalysisCard';
import { useAppContext } from '../context/AppContext';
import { ExportIcon } from './icons/ExportIcon';
import * as aiService from '../services/aiService';
import type { AudioPlayerRef } from './AudioPlayer';
import { FolderIcon } from './icons/FolderIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
    const { 
        analysisResult, 
        analysisType,
        fileUrl, 
        selectedFile,
        highlightedTimeLabel, 
        setHighlightedTimeLabel,
        speakerARole,
        setSpeakerARole,
        speakerBRole,
        setSpeakerBRole,
        setIsExportHubOpen,
        addNotification,
        activeProjectId,
        handleSaveAssetToProject,
        saveConfirmation,
        withApiErrorHandling,
    } = useAppContext();

    const [editableTranscript, setEditableTranscript] = useState(analysisResult?.transcript || []);
    const playerRef = useRef<AudioPlayerRef>(null);
    const [currentTime, setCurrentTime] = useState(0);
    
    useEffect(() => {
        setEditableTranscript(analysisResult?.transcript || []);
    }, [analysisResult]);

    const handleRefineLine = async (index: number, instruction: string) => {
        const originalText = editableTranscript[index].text;

        // Optimistic UI update to show loading
        const tempTranscript = [...editableTranscript];
        tempTranscript[index] = { ...tempTranscript[index], text: '...' };
        setEditableTranscript(tempTranscript);

        try {
            const refinedText = await withApiErrorHandling(aiService.refineTranscriptLine, originalText, instruction);
            
            // Final update
            const finalTranscript = [...editableTranscript];
            finalTranscript[index] = { ...finalTranscript[index], text: refinedText.trim() };
            setEditableTranscript(finalTranscript);
        } catch (e: any) {
            // Revert on error
            const revertedTranscript = [...editableTranscript];
            revertedTranscript[index] = { ...revertedTranscript[index], text: originalText };
            setEditableTranscript(revertedTranscript);
            // Only add notification if it's not an AbortError
            if (e.name !== 'AbortError') {
                addNotification('Failed to refine text.', 'error');
            }
        }
    };
    
    if (!analysisResult) {
        return <div className="text-center p-8">No analysis result available. Please run an analysis first.</div>;
    }

    const { 
        performanceMetrics, 
        transcript, 
        salesCallAnalysis, 
        videoAnalysis, 
        socialMediaAnalysis, 
        adAnalysis, 
        documentAnalysis, 
        financialReportAnalysis, 
        keywordAnalysis, 
        abTestAnalysis, 
        repurposeAnalysis, 
        thumbnailAnalysis, 
        liveStreamAnalysis,
        brandVoiceScoreAnalysis
    } = analysisResult;
    
    const detailedAnalysisData = salesCallAnalysis || videoAnalysis || socialMediaAnalysis || adAnalysis || documentAnalysis || financialReportAnalysis || abTestAnalysis || repurposeAnalysis || thumbnailAnalysis || liveStreamAnalysis || brandVoiceScoreAnalysis;
    
    const detailedAnalysisTitle = 
        salesCallAnalysis ? 'Sales Call Analysis' :
        videoAnalysis ? 'Video Analysis' :
        socialMediaAnalysis ? 'Social Media Analysis' :
        adAnalysis ? 'Product Ad Analysis' :
        documentAnalysis ? 'Document Analysis' :
        financialReportAnalysis ? 'Financial Report Analysis' :
        abTestAnalysis ? 'A/B Test Analysis' :
        repurposeAnalysis ? 'Content Repurposing Suite' :
        thumbnailAnalysis ? 'Thumbnail Analysis' :
        liveStreamAnalysis ? 'Live Stream Analysis' :
        brandVoiceScoreAnalysis ? 'Brand Voice Score' :
        'Detailed Analysis';
        
    const isSalesCall = analysisType === 'salesCall';
    const showMediaPreview = fileUrl && selectedFile && ['videoAnalysis', 'salesCall', 'liveStream', 'transcription', 'productAd', 'socialMedia', 'thumbnailAnalysis'].includes(analysisType);

    const handleSave = () => {
        if (!analysisResult) return;
        const assetName = selectedFile?.name || detailedAnalysisTitle;
        handleSaveAssetToProject(analysisResult, analysisType as any, assetName);
    };

    return (
        <div id="analysis-report-area" className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
                {showMediaPreview && (
                    <MediaPreviewCard 
                        file={selectedFile!}
                        fileUrl={fileUrl!}
                        ref={playerRef}
                        onTimeUpdate={setCurrentTime}
                    />
                )}
                
                {performanceMetrics && performanceMetrics.length > 0 && (
                    <div className="glass-card overflow-hidden">
                        <PerformanceGraph 
                            metrics={performanceMetrics} 
                            onTimeSegmentHover={setHighlightedTimeLabel} 
                        />
                    </div>
                )}

                {editableTranscript && editableTranscript.length > 0 && (
                    <div className="glass-card overflow-hidden">
                        <Transcript 
                            transcript={editableTranscript} 
                            playerRef={playerRef} 
                            currentTime={currentTime}
                            highlightedTimeLabel={highlightedTimeLabel}
                            isSalesCall={isSalesCall}
                            speakerARole={speakerARole}
                            speakerBRole={speakerBRole}
                            onSpeakerARoleChange={setSpeakerARole}
                            onSpeakerBRoleChange={setSpeakerBRole}
                            onRefineLine={handleRefineLine}
                        />
                    </div>
                )}
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div id="feedback-card-area">
                    <CoachingCard />
                </div>
                
                {detailedAnalysisData && (
                    <div className="glass-card">
                        <DetailedAnalysisCard title={detailedAnalysisTitle} data={isSalesCall ? { ...detailedAnalysisData, speakerARole, speakerBRole } : detailedAnalysisData} />
                    </div>
                )}
                
                {keywordAnalysis && (
                    <KeywordAnalysisCard data={keywordAnalysis} />
                )}
            </div>
        </div>
    );
};