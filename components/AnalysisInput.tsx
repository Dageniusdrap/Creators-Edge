
import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const AnalysisInput: React.FC = () => {
    const {
        analysisType,
        selectedFile,
        handleFileSelect,
        handleClearFile,
        handleAnalysisSubmit,
        isAnalyzing,
        contentInputs,
        setContentInputs
    } = useAppContext();

    const isTranscriptionTool = analysisType === 'transcription';
    const isThumbnailTool = analysisType === 'thumbnailAnalysis';
    const [inputType, setInputType] = useState<'file' | 'text'>(isTranscriptionTool || isThumbnailTool ? 'file' : 'text');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local state for debouncing inputs
    const [localScript, setLocalScript] = useState(contentInputs.script);
    const [localDescription, setLocalDescription] = useState(contentInputs.description);
    const [localLink, setLocalLink] = useState(contentInputs.link);

    // Sync local state when context changes (e.g. loading from history)
    useEffect(() => {
        setLocalScript(contentInputs.script);
        setLocalDescription(contentInputs.description);
        setLocalLink(contentInputs.link);
    }, [contentInputs]);

    // Debounce sync to context
    useEffect(() => {
        const handler = setTimeout(() => {
            setContentInputs(prev => {
                // Only update if changed to avoid unnecessary re-renders
                if (prev.script !== localScript || prev.description !== localDescription || prev.link !== localLink) {
                    return { script: localScript, description: localDescription, link: localLink };
                }
                return prev;
            });
        }, 500); // 500ms delay

        return () => clearTimeout(handler);
    }, [localScript, localDescription, localLink, setContentInputs]);

    // Reset input type when analysisType changes
    useEffect(() => {
        if (isTranscriptionTool || isThumbnailTool) {
            setInputType('file');
        } else {
            if (!selectedFile && localScript === '') {
                setInputType('text');
            }
        }
    }, [analysisType, isTranscriptionTool, isThumbnailTool, selectedFile, localScript]);

    // File upload handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) handleFileSelect(e.target.files[0]);
    };

    const getAcceptableFileTypes = () => {
        switch (analysisType) {
            case 'videoAnalysis':
            case 'transcription':
            case 'liveStream':
            case 'productAd':
            case 'socialMedia':
                // Broaden to allow mkv, webm, m4a etc via wildcard, plus specific common containers
                return 'video/*, audio/*, .mkv, .flv, .avi, .mov, .wmv, .m4a, .webm';
            case 'documentAnalysis':
            case 'financialReport':
                return '.pdf, .txt, .md, .docx, .csv';
            case 'salesCall':
                return 'audio/*, video/*, .m4a, .mp3, .wav';
            case 'thumbnailAnalysis':
                return 'image/*';
            default:
                return '*/*';
        }
    };

    const getPlaceholder = () => {
        switch (analysisType) {
            case 'salesCall': return 'Paste your sales call transcript here...';
            case 'socialMedia':
            case 'productAd': return 'Paste your script, caption, or post text here...';
            case 'documentAnalysis':
            case 'financialReport': return 'Paste your document text here...';
            default: return 'Paste your content here...';
        }
    };

    const isMultiInput = ['socialMedia', 'productAd', 'documentAnalysis', 'financialReport'].includes(analysisType);
    const isLinkInputVisible = ['socialMedia', 'productAd'].includes(analysisType);
    const canSubmit = !isAnalyzing && (!!selectedFile || localScript.trim() !== '');

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: 'script' | 'description' | 'link') => {
        const val = e.target.value;
        if (field === 'script') {
            setLocalScript(val);
            if (selectedFile) handleClearFile();
        }
        if (field === 'description') setLocalDescription(val);
        if (field === 'link') setLocalLink(val);
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            {!isTranscriptionTool && !isThumbnailTool && (
                <div className="flex bg-surface-100 rounded-lg p-1 mb-6 border border-white/5">
                    <button onClick={() => setInputType('file')} className={`w-1/2 py-2 text-sm font-semibold rounded-md relative transition-colors ${inputType !== 'file' ? 'text-text-secondary hover:text-text-primary' : ''}`}>
                        {inputType === 'file' && <motion.div layoutId="input-type" className="absolute inset-0 bg-surface-300 rounded-md shadow-sm" />}
                        <span className="relative z-10 text-white">Upload File</span>
                    </button>
                    <button onClick={() => setInputType('text')} className={`w-1/2 py-2 text-sm font-semibold rounded-md relative transition-colors ${inputType !== 'text' ? 'text-text-secondary hover:text-text-primary' : ''}`}>
                        {inputType === 'text' && <motion.div layoutId="input-type" className="absolute inset-0 bg-surface-300 rounded-md shadow-sm" />}
                        <span className="relative z-10 text-white">Paste Text</span>
                    </button>
                </div>
            )}

            {inputType === 'file' ? (
                selectedFile ? (
                    <div className="relative fade-in">
                        <div className="flex items-center justify-between bg-surface-50 p-4 rounded-lg border border-primary/30 shadow-lg shadow-primary/5">
                            <p className="text-sm font-medium text-text-primary truncate max-w-[85%]">{selectedFile.name}</p>
                            <button
                                onClick={handleClearFile}
                                className="p-1 hover:bg-surface-200 rounded-full transition-colors text-text-secondary hover:text-error"
                                title="Remove file"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 group
                            ${isDragging
                                ? 'border-primary bg-primary/10 scale-[1.02]'
                                : 'border-surface-300 bg-surface-50/50 hover:border-primary/50 hover:bg-surface-100'}`}
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={`p-4 rounded-full mb-3 transition-colors ${isDragging ? 'bg-primary/20' : 'bg-surface-200 group-hover:bg-primary/20'}`}>
                            <UploadIcon className={`h-8 w-8 transition-colors ${isDragging ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`} />
                        </div>
                        <p className="mt-2 text-sm text-text-primary font-medium">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                            {getAcceptableFileTypes().split(', ').map(t => t.split('/')[1]?.toUpperCase() || t).join(', ')} (Max 50MB)
                        </p>
                        <input ref={fileInputRef} type="file" className="hidden" accept={getAcceptableFileTypes()} onChange={handleFileChange} />
                    </div>
                )
            ) : (
                <div className="space-y-4 fade-in">
                    <textarea
                        className="input-field w-full h-40 resize-none"
                        placeholder={getPlaceholder()}
                        value={localScript}
                        onChange={(e) => onTextChange(e, 'script')}
                    />
                    {isMultiInput && (
                        <textarea
                            className="input-field w-full h-20 resize-none"
                            placeholder="Add a brief description or goal for your content (optional)..."
                            value={localDescription}
                            onChange={(e) => onTextChange(e, 'description')}
                        />
                    )}
                    {isLinkInputVisible && (
                        <input
                            type="text"
                            className="input-field w-full"
                            placeholder="Add a link for context (optional)..."
                            value={localLink}
                            onChange={(e) => onTextChange(e, 'link')}
                        />
                    )}
                </div>
            )}

            <div className="mt-6">
                <button
                    id="analysis-submit-button"
                    className="w-full btn-primary py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    onClick={handleAnalysisSubmit}
                    disabled={!canSubmit}
                >
                    <SparklesIcon className="h-5 w-5 mr-2 animate-pulse-glow" />
                    {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
            </div>
        </div>
    );
};
