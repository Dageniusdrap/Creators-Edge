
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { Loader } from './Loader';
import { PromptHistoryModal } from './PromptHistoryModal';
import { PromptTemplatesModal } from './PromptTemplatesModal';
import * as aiService from '../services/aiService';
import { pcmToMp3Blob, decode } from '../utils/audio';
import { exportScriptAsSrt } from '../utils/export';
import { parseViralScript } from '../utils/parsing';
import type { VoiceoverScript, ViralScript, PromptHistoryItem, GenerationType } from '../types';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ViralScriptCard } from './ViralScriptCard';
import { ClosedCaptionIcon } from './icons/ClosedCaptionIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useAppContext } from '../context/AppContext';
import { ErrorMessage } from './ErrorMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon } from './icons/FolderIcon';
import { ApiKeySelection } from './ApiKeySelection';
import { CheckIcon } from './icons/CheckIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';


interface GenerationViewProps { }

// Removed duplicate GenerationType definition

type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
type VideoAspectRatio = '16:9' | '9:16';
type VideoResolution = '720p' | '1080p';
type ImageModel = 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image' | 'fal-flux' | 'stability-core' | 'sd3' | 'recraft-v3';
type VideoModel = 'veo-3.1-fast-generate-preview' | 'veo-3.1-generate-preview' | 'hunyuan-video' | 'luma-ray' | 'runway-gen3' | 'kling';
type ImageMimeType = 'image/jpeg' | 'image/png';


const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .substring(0, 50); // Truncate to 50 chars
};


const OptionGroup: React.FC<{ title: string | React.ReactNode; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-2">{title}</h4>
        {children}
    </div>
);


const GenerationControls: React.FC<{
    activeTab: GenerationType;
    prompt: string;
    setPrompt: (p: string) => void;
    onOpenTemplates: () => void;
    onClearAll: () => void;
    link: string;
    setLink: (l: string) => void;
    imageModel: ImageModel;
    setImageModel: (m: ImageModel) => void;
    negativePrompt: string;
    setNegativePrompt: (p: string) => void;
    imageAspectRatio: ImageAspectRatio;
    setImageAspectRatio: (ar: ImageAspectRatio) => void;
    imageStylePresets: string[];
    setImageStylePresets: (ss: string[]) => void;
    imageMimeType: ImageMimeType;
    setImageMimeType: (mt: ImageMimeType) => void;
    videoModel: VideoModel;
    setVideoModel: (vm: VideoModel) => void;
    videoAspectRatio: VideoAspectRatio;
    setVideoAspectRatio: (ar: VideoAspectRatio) => void;
    resolution: VideoResolution;
    setResolution: (r: VideoResolution) => void;
    videoStylePresets: string[];
    setVideoStylePresets: (ss: string[]) => void;
    referenceFrames: { file: File, preview: string }[];
    setReferenceFrames: (f: { file: File, preview: string }[]) => void;
    watermark: string;
    setWatermark: (w: string) => void;
    voiceoverScripts: VoiceoverScript[];
    setVoiceoverScripts: (vs: VoiceoverScript[]) => void;
    withApiErrorHandling: <R>(apiCall: (signal: AbortSignal, ...args: any[]) => Promise<R>, ...args: any[]) => Promise<R>;
    abortControllerRef: React.MutableRefObject<AbortController>;
}> = (props) => {
    const { attemptGeneration, onSuccessfulGeneration, addNotification } = useAppContext();
    const [brainstormKeyword, setBrainstormKeyword] = useState('');
    const [brainstormIdeas, setBrainstormIdeas] = useState<string[]>([]);
    const [isBrainstorming, setIsBrainstorming] = useState(false);
    const [brainstormError, setBrainstormError] = useState<string | null>(null);

    const handleBrainstorm = async () => {
        if (!brainstormKeyword.trim() || !attemptGeneration()) return;
        setIsBrainstorming(true);
        setBrainstormError(null);
        try {
            const ideas = await props.withApiErrorHandling(aiService.brainstormVideoIdeas, brainstormKeyword);
            setBrainstormIdeas(ideas);
            onSuccessfulGeneration();
        } catch (err: any) {
            if (err.name === 'AbortError') console.log('Brainstorming aborted.');
            else {
                setBrainstormError(err.message || 'Failed to brainstorm ideas.');
                addNotification(err.message || 'Failed to brainstorm ideas.', 'error');
            }
        } finally {
            setIsBrainstorming(false);
        }
    };

    const IMAGE_STYLE_PRESETS = ['Photorealistic', 'Cinematic', 'Anime', 'Fantasy', 'Digital Art', '3D Render', 'Watercolor', 'Sketch', 'Pixel Art', 'Low Poly', 'Cyberpunk', 'Steampunk', 'Vintage', 'Minimalist'];
    const VIDEO_STYLE_PRESETS = ['Cinematic', 'Drone Shot', 'Time-lapse', 'Black and White', 'Hyper-realistic', 'Animated', 'Documentary', 'Vaporwave', 'Claymation'];
    const PROFESSIONAL_VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
    const VOICE_STYLES = ['Default', 'Cheerful', 'Animated', 'Energetic', 'Calm', 'Authoritative', 'Serious', 'Whispering', 'Storyteller', 'News Anchor'];

    const toggleStylePreset = (
        preset: string,
        currentStyles: string[],
        setter: (styles: string[]) => void
    ) => {
        const newStyles = currentStyles.includes(preset)
            ? currentStyles.filter(s => s !== preset)
            : [...currentStyles, preset];
        setter(newStyles);
    };

    const addVoiceoverScript = () => {
        if (props.voiceoverScripts.length >= 2) return;
        const newId = (props.voiceoverScripts.reduce((maxId, item) => Math.max(item.id, maxId), 0) || 0) + 1;
        const nextVoice = PROFESSIONAL_VOICES[props.voiceoverScripts.length % PROFESSIONAL_VOICES.length];
        props.setVoiceoverScripts([
            ...props.voiceoverScripts,
            { id: newId, speaker: `Speaker ${newId}`, script: '', voice: nextVoice, style: 'Default' }
        ]);
    };

    const removeVoiceoverScript = (id: number) => {
        props.setVoiceoverScripts(props.voiceoverScripts.filter(vs => vs.id !== id));
    };

    const updateVoiceoverScript = (id: number, updated: Partial<VoiceoverScript>) => {
        props.setVoiceoverScripts(props.voiceoverScripts.map(vs =>
            vs.id === id ? { ...vs, ...updated } : vs
        ));
    };

    const handleAddReferenceFrame = (file: File | null) => {
        if (file && props.referenceFrames.length < 3) {
            const newFrame = { file, preview: URL.createObjectURL(file) };
            props.setReferenceFrames([...props.referenceFrames, newFrame]);
        }
    };

    const handleRemoveReferenceFrame = (index: number) => {
        const frameToRemove = props.referenceFrames[index];
        URL.revokeObjectURL(frameToRemove.preview);
        props.setReferenceFrames(props.referenceFrames.filter((_, i) => i !== index));
    };

    const ReferenceImageUploader: React.FC = () => {
        const inputRef = useRef<HTMLInputElement>(null);

        const getFrameLabel = (index: number, count: number) => {
            if (count === 1) return 'Start Image';
            if (count === 2) return index === 0 ? 'Start Image' : 'End Image';
            if (count >= 3) return `Reference Asset ${index + 1}`;
            return '';
        };

        return (
            <div>
                <p className="text-xs text-gray-400 mb-2">
                    <strong>1 image:</strong> starting frame. <strong>2 images:</strong> start & end frames. <strong>3 images:</strong> reference assets.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                    {props.referenceFrames.map((frame, index) => (
                        <div key={index} className="relative h-20">
                            <img src={frame.preview} alt={`Reference ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-center text-[10px] font-semibold">{getFrameLabel(index, props.referenceFrames.length)}</div>
                            <button
                                onClick={() => handleRemoveReferenceFrame(index)}
                                className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full text-white shadow-md hover:bg-red-600 transition-colors z-10"
                                title="Remove image"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
                {props.referenceFrames.length < 3 && (
                    <button
                        className="w-full flex flex-col items-center justify-center px-6 py-4 border-2 border-white/20 border-dashed rounded-md cursor-pointer hover:border-indigo-500"
                        onClick={() => inputRef.current?.click()}
                    >
                        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleAddReferenceFrame(e.target.files?.[0] ?? null)} />
                        <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-xs text-gray-500">Add Reference Image ({props.referenceFrames.length}/3)</p>
                    </button>
                )}
            </div>
        );
    };

    const isMultiFrame = props.referenceFrames.length >= 3;

    useEffect(() => {
        if (isMultiFrame) {
            props.setVideoModel('veo-3.1-generate-preview');
            props.setVideoAspectRatio('16:9');
            props.setResolution('720p');
        }
    }, [isMultiFrame]);

    return (
        <div id="generation-controls" className="glass-card p-4 space-y-6">
            <OptionGroup title={
                <div className="flex justify-between items-center">
                    <span className="text-white">Your Creative Prompt</span>
                    <div className="flex items-center gap-3">
                        <button onClick={props.onClearAll} className="text-xs font-semibold text-red-400 hover:underline">
                            Clear All
                        </button>
                        <button onClick={props.onOpenTemplates} className="text-xs font-semibold text-indigo-400 hover:underline">
                            Templates
                        </button>
                    </div>
                </div>
            }>
                <textarea
                    id="prompt-textarea"
                    rows={props.activeTab === 'script' ? 8 : (props.activeTab === 'speech' ? (props.voiceoverScripts.length > 1 ? 2 : 8) : 4)}
                    value={props.prompt}
                    onChange={(e) => props.setPrompt(e.target.value)}
                    className="block w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded-md shadow-sm"
                    placeholder={
                        props.activeTab === 'speech'
                            ? "Enter text for a single speaker, or add speakers below for multi-speaker audio..."
                            : "e.g., A futuristic cityscape at sunset, synthwave style..."
                    }
                />
            </OptionGroup>

            {props.activeTab === 'script' && (
                <>
                    <OptionGroup title="Inspiration Link (Optional)">
                        <div className="relative">
                            <input
                                type="text"
                                value={props.link}
                                onChange={(e) => props.setLink(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-white/5 text-white border border-white/20 rounded-md"
                                placeholder="e.g., https://youtube.com/watch?v=..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center group cursor-pointer">
                                <InfoIcon className="h-5 w-5 text-gray-400" />
                                <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    The AI uses this link for context but can't access it directly. For best results, paste key text from the link into your main prompt!
                                </div>
                            </div>
                        </div>
                    </OptionGroup>
                    <OptionGroup title="Need Inspiration?">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={brainstormKeyword}
                                onChange={(e) => setBrainstormKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBrainstorm()}
                                placeholder="Enter a keyword, e.g., 'productivity'"
                                className="flex-grow p-2 bg-white/5 text-white border border-white/20 rounded-md"
                            />
                            <button
                                onClick={handleBrainstorm}
                                disabled={isBrainstorming}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                            >
                                {isBrainstorming ? '...' : 'Brainstorm'}
                            </button>
                        </div>
                        {brainstormError && <p className="text-xs text-red-400 mt-2">{brainstormError}</p>}
                        {brainstormIdeas.length > 0 && (
                            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                                <h5 className="text-sm font-semibold text-gray-300">AI-Generated Ideas:</h5>
                                {brainstormIdeas.map((idea, index) => {
                                    const [title, concept] = idea.split(': ');
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => props.setPrompt(`Title: ${title}\n\nConcept: ${concept}\n\nPlease expand this into a full viral video script.`)}
                                            className="w-full text-left p-2 bg-black/20 rounded-md hover:bg-black/40"
                                        >
                                            <p className="font-semibold text-sm text-indigo-300">{title}</p>
                                            <p className="text-xs text-gray-400">{concept}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </OptionGroup>
                </>
            )}

            {props.activeTab === 'image' && (
                <>
                    <OptionGroup title="Negative Prompt (Optional)">
                        <textarea
                            rows={2}
                            value={props.negativePrompt}
                            onChange={(e) => props.setNegativePrompt(e.target.value)}
                            className="block w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded-md shadow-sm"
                            placeholder="e.g., ugly, blurry, text, watermark, extra fingers"
                        />
                    </OptionGroup>
                    <OptionGroup title="Image Model">
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => props.setImageModel('fal-flux')} className={`p-2 text-sm rounded-md ${props.imageModel === 'fal-flux' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Fal.ai (Flux)</button>
                            <button onClick={() => props.setImageModel('stability-core')} className={`p-2 text-sm rounded-md ${props.imageModel === 'stability-core' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Stability Ultra</button>
                            <button onClick={() => props.setImageModel('sd3')} className={`p-2 text-sm rounded-md ${props.imageModel === 'sd3' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Stable Diffusion 3</button>
                            <button onClick={() => props.setImageModel('recraft-v3')} className={`p-2 text-sm rounded-md ${props.imageModel === 'recraft-v3' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Recraft V3</button>
                            <button onClick={() => props.setImageModel('imagen-4.0-generate-001')} className={`p-2 text-sm rounded-md ${props.imageModel === 'imagen-4.0-generate-001' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Imagen 4 (HD)</button>
                            <button onClick={() => props.setImageModel('gemini-2.5-flash-image')} className={`p-2 text-sm rounded-md ${props.imageModel === 'gemini-2.5-flash-image' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Flash (Fast)</button>
                        </div>
                    </OptionGroup>
                    <OptionGroup title="Aspect Ratio">
                        <div className="grid grid-cols-5 gap-2 text-xs">
                            {(['1:1', '16:9', '9:16', '4:3', '3:4'] as ImageAspectRatio[]).map(ar => (
                                <button key={ar} onClick={() => props.setImageAspectRatio(ar)} className={`p-2 rounded-md ${props.imageAspectRatio === ar ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>{ar}</button>
                            ))}
                        </div>
                    </OptionGroup>
                    <OptionGroup title={
                        <div className="flex justify-between items-center">
                            <span>Style Presets</span>
                            {props.imageStylePresets.length > 0 &&
                                <button onClick={() => props.setImageStylePresets([])} className="text-xs font-semibold text-indigo-400 hover:underline">Clear</button>
                            }
                        </div>
                    }>
                        <div className="flex flex-wrap gap-2">
                            {IMAGE_STYLE_PRESETS.map(preset => (
                                <button key={preset} onClick={() => toggleStylePreset(preset, props.imageStylePresets, props.setImageStylePresets)} className={`px-3 py-1 text-xs rounded-full ${props.imageStylePresets.includes(preset) ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>{preset}</button>
                            ))}
                        </div>
                    </OptionGroup>
                    <OptionGroup title="Export Format">
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => props.setImageMimeType('image/jpeg')} className={`p-2 text-sm rounded-md ${props.imageMimeType === 'image/jpeg' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>JPEG</button>
                            <button onClick={() => props.setImageMimeType('image/png')} className={`p-2 text-sm rounded-md ${props.imageMimeType === 'image/png' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>PNG</button>
                        </div>
                    </OptionGroup>
                </>
            )}

            {props.activeTab === 'video' && (
                <>
                    <details className="space-y-4" open>
                        <summary className="text-lg font-semibold cursor-pointer text-white">Director's Toolkit</summary>
                        <div className="pl-4 border-l-2 border-white/20 space-y-6">
                            <OptionGroup title="Reference Images">
                                <ReferenceImageUploader />
                            </OptionGroup>
                            {isMultiFrame && (
                                <div className="p-3 text-xs text-blue-200 bg-blue-900/50 rounded-lg border border-blue-700">
                                    <InfoIcon className="h-4 w-4 inline mr-1" />
                                    Multi-frame generation requires <strong>Veo HD</strong>, <strong>16:9</strong> aspect ratio, and <strong>770p</strong> quality. These settings have been automatically applied.
                                </div>
                            )}
                            <OptionGroup title="Video Model">
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => props.setVideoModel('veo-3.1-fast-generate-preview')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoModel === 'veo-3.1-fast-generate-preview' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>Veo 3.1 Fast</button>
                                    <button onClick={() => props.setVideoModel('veo-3.1-generate-preview')} className={`p-2 text-sm rounded-md ${props.videoModel === 'veo-3.1-generate-preview' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>Veo 3.1 HD</button>
                                    <button onClick={() => props.setVideoModel('hunyuan-video')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoModel === 'hunyuan-video' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>Hunyuan Video</button>
                                    <button onClick={() => props.setVideoModel('luma-ray')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoModel === 'luma-ray' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>Luma Ray</button>
                                    <button onClick={() => props.setVideoModel('runway-gen3')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoModel === 'runway-gen3' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>Runway Gen-3</button>
                                    <button onClick={() => props.setVideoModel('kling')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoModel === 'kling' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>Kling</button>
                                </div>
                            </OptionGroup>
                            <div className="grid grid-cols-2 gap-4">
                                <OptionGroup title="Aspect Ratio">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => props.setVideoAspectRatio('16:9')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoAspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>16:9</button>
                                        <button onClick={() => props.setVideoAspectRatio('9:16')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.videoAspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>9:16</button>
                                    </div>
                                </OptionGroup>
                                <OptionGroup title="Quality">
                                    <div className="grid grid-cols-1 gap-2">
                                        <button onClick={() => props.setResolution('720p')} className={`p-2 text-sm rounded-md ${props.resolution === '720p' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>HD (720p)</button>
                                        <button onClick={() => props.setResolution('1080p')} disabled={isMultiFrame} className={`p-2 text-sm rounded-md ${props.resolution === '1080p' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'} disabled:opacity-50`}>Full HD (1080p)</button>
                                    </div>
                                </OptionGroup>
                            </div>
                            <OptionGroup title={
                                <div className="flex items-center space-x-2">
                                    <span>Duration</span>
                                    <div className="group relative">
                                        <InfoIcon className="h-4 w-4 text-gray-400" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            Current Veo models generate clips of a fixed duration (~7s). Use the "Extend Video" feature in the results panel to create longer content.
                                        </div>
                                    </div>
                                </div>
                            }>
                                <div className="text-center p-2 bg-black/20 rounded-md">
                                    <p className="text-sm font-semibold text-gray-200">~7 seconds</p>
                                </div >
                            </OptionGroup>
                            <OptionGroup title="Watermark (Preview)">
                                <input
                                    type="text"
                                    value={props.watermark}
                                    onChange={(e) => props.setWatermark(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 text-white border border-white/20 rounded-md"
                                    placeholder="e.g., @YourBrand"
                                />
                            </OptionGroup>
                            <OptionGroup title={
                                <div className="flex justify-between items-center">
                                    <span>Style Presets</span>
                                    {props.videoStylePresets.length > 0 &&
                                        <button onClick={() => props.setVideoStylePresets([])} className="text-xs font-semibold text-indigo-400 hover:underline">Clear</button>
                                    }
                                </div>
                            }>
                                <div className="flex flex-wrap gap-2">
                                    {VIDEO_STYLE_PRESETS.map(preset => (
                                        <button key={preset} onClick={() => toggleStylePreset(preset, props.videoStylePresets, props.setVideoStylePresets)} className={`px-3 py-1 text-xs rounded-full ${props.videoStylePresets.includes(preset) ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}>{preset}</button>
                                    ))}
                                </div>
                            </OptionGroup>
                        </div>
                    </details>
                    <details className="space-y-4" open>
                        <summary className="text-lg font-semibold cursor-pointer text-white">Generate Voiceover</summary>
                        <div className="pl-4 border-l-2 border-white/20 space-y-4">
                            {props.voiceoverScripts.map((vs) => (
                                <div key={vs.id} className="p-3 bg-black/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <input
                                            type="text"
                                            value={vs.speaker}
                                            onChange={e => updateVoiceoverScript(vs.id, { speaker: e.target.value })}
                                            className="text-sm font-semibold bg-transparent text-white"
                                        />
                                        <button onClick={() => removeVoiceoverScript(vs.id)}><XIcon className="h-4 w-4 text-gray-400" /></button>
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={vs.script}
                                        onChange={e => updateVoiceoverScript(vs.id, { script: e.target.value })}
                                        className="w-full text-sm p-2 bg-white/5 text-white border border-white/20 rounded-md"
                                        placeholder={`Script for ${vs.speaker}...`}
                                    />
                                    <div className={`grid ${props.voiceoverScripts.length === 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mt-2`}>
                                        <select
                                            value={vs.voice}
                                            onChange={e => updateVoiceoverScript(vs.id, { voice: e.target.value })}
                                            className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md"
                                        >
                                            {PROFESSIONAL_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        {props.voiceoverScripts.length === 1 && (
                                            <select
                                                value={vs.style || 'Default'}
                                                onChange={e => updateVoiceoverScript(vs.id, { style: e.target.value })}
                                                className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md"
                                            >
                                                {VOICE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addVoiceoverScript}
                                disabled={props.voiceoverScripts.length >= 2}
                                className="w-full flex items-center justify-center p-2 text-sm font-medium text-indigo-300 bg-indigo-500/30 rounded-md hover:bg-indigo-500/40 disabled:opacity-50"
                            >
                                <PlusCircleIcon className="h-5 w-5 mr-2" />
                                Add Speaker (Max 2)
                            </button>
                        </div>
                    </details>
                </>
            )}

            {props.activeTab === 'speech' && (
                <div className="space-y-4">
                    {props.voiceoverScripts.map((vs) => (
                        <div key={vs.id} className="p-3 bg-black/20 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <input
                                    type="text"
                                    value={vs.speaker}
                                    onChange={e => updateVoiceoverScript(vs.id, { speaker: e.target.value })}
                                    className="text-sm font-semibold bg-transparent text-white"
                                />
                                {props.voiceoverScripts.length > 1 && (
                                    <button onClick={() => removeVoiceoverScript(vs.id)}><XIcon className="h-4 w-4 text-gray-400" /></button>
                                )}
                            </div>
                            <textarea
                                rows={3}
                                value={vs.script}
                                onChange={e => updateVoiceoverScript(vs.id, { script: e.target.value })}
                                className="w-full text-sm p-2 bg-white/5 text-white border border-white/20 rounded-md"
                                placeholder={`Script for ${vs.speaker}...`}
                            />
                            <div className={`grid ${props.voiceoverScripts.length === 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mt-2`}>
                                <select
                                    value={vs.voice}
                                    onChange={e => updateVoiceoverScript(vs.id, { voice: e.target.value })}
                                    className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md"
                                >
                                    {PROFESSIONAL_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                {props.voiceoverScripts.length === 1 && (
                                    <select
                                        value={vs.style || 'Default'}
                                        onChange={e => updateVoiceoverScript(vs.id, { style: e.target.value })}
                                        className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md"
                                    >
                                        {VOICE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                )}
                            </div>
                        </div>
                    ))}
                    {props.voiceoverScripts.length < 2 && (
                        <button
                            onClick={addVoiceoverScript}
                            className="w-full flex items-center justify-center p-2 text-sm font-medium text-indigo-300 bg-indigo-500/30 rounded-md hover:bg-indigo-500/40"
                        >
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Add Speaker (Max 2)
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};


const ResultCard: React.FC<{
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    onSave?: () => void;
}> = ({ title, children, actions, onSave }) => {
    const { activeProjectId, saveConfirmation } = useAppContext();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
        >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <div className="flex items-center space-x-2">
                    {actions}
                    <AnimatePresence>
                        {saveConfirmation && (
                            <motion.span
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-xs text-green-400 font-medium whitespace-nowrap"
                            >
                                {saveConfirmation}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {activeProjectId && onSave && (
                        <button onClick={onSave} className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20 flex items-center">
                            <FolderIcon className="h-4 w-4 mr-1.5" />
                            Save
                        </button>
                    )}
                </div>
            </div>
            <div className="p-4">{children}</div>
        </motion.div>
    );
};


const VideoResult: React.FC<{
    video: { url: string, payload: any };
    prompt: string;
    watermark: string;
    onExtend: (prompt: string, payload: any) => void;
    isExtending: boolean;
    onRemix: (remixPrompt: string) => void;
    isRemixing: boolean;
    onCancel: () => void;
    onExportSrt: (duration: number) => void;
    onExportFrame: (videoEl: HTMLVideoElement) => void;
    onUseFrameAsStart: (videoEl: HTMLVideoElement) => void;
    onRemixFromFrame: (videoEl: HTMLVideoElement) => void;
    scriptAudio: { url: string; blob: Blob } | null;
}> = ({ video, prompt, watermark, onExtend, isExtending, onRemix, isRemixing, onCancel, onExportSrt, onExportFrame, onUseFrameAsStart, onRemixFromFrame, scriptAudio }) => {
    const [extendPrompt, setExtendPrompt] = useState('');
    const [remixPrompt, setRemixPrompt] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleExtend = () => {
        if (extendPrompt.trim()) {
            onExtend(extendPrompt, video.payload);
        }
    };

    const handleRemix = () => {
        if (remixPrompt.trim()) {
            onRemix(remixPrompt);
        }
    };

    const handleExportSrt = () => {
        if (videoRef.current) {
            onExportSrt(videoRef.current.duration);
        }
    };

    const handleExportFrame = () => {
        if (videoRef.current) {
            onExportFrame(videoRef.current);
        }
    };

    const handleUseFrameAsStart = () => {
        if (videoRef.current) {
            onUseFrameAsStart(videoRef.current);
        }
    };

    const handleRemixFromFrame = () => {
        if (videoRef.current) {
            onRemixFromFrame(videoRef.current);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative w-full">
                <video ref={videoRef} src={video.url} controls autoPlay loop className="w-full rounded-lg" />
                {watermark && (
                    <div className="absolute bottom-4 right-4 text-white text-lg font-bold opacity-70 pointer-events-none" style={{ textShadow: '0 0 5px black' }}>
                        {watermark}
                    </div>
                )}
            </div>
            <div className="p-4 bg-black/20 rounded-lg space-y-4">
                <details>
                    <summary className="font-semibold cursor-pointer text-white">Remix Video</summary>
                    <div className="mt-2 space-y-2">
                        <textarea
                            rows={2}
                            value={remixPrompt}
                            onChange={e => setRemixPrompt(e.target.value)}
                            className="w-full text-sm p-2 bg-white/5 text-white border border-white/20 rounded-md"
                            placeholder="e.g., Make it black and white, add a vintage film grain."
                        />
                        <button
                            onClick={handleRemix}
                            disabled={isRemixing || !remixPrompt.trim()}
                            className="w-full flex items-center justify-center p-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                        >
                            <SparklesIcon className="h-4 w-4 mr-2" />
                            {isRemixing ? 'Remixing...' : 'Remix Video'}
                        </button>
                    </div>
                </details>
                <details>
                    <summary className="font-semibold cursor-pointer text-white">Extend Video</summary>
                    <div className="mt-2 space-y-2">
                        <textarea
                            rows={2}
                            value={extendPrompt}
                            onChange={e => setExtendPrompt(e.target.value)}
                            className="w-full text-sm p-2 bg-white/5 text-white border border-white/20 rounded-md"
                            placeholder="e.g., ...and then a spaceship flies by."
                        />
                        <button
                            onClick={handleExtend}
                            disabled={isExtending || !extendPrompt.trim()}
                            className="w-full flex items-center justify-center p-2 text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            {isExtending ? 'Extending...' : 'Extend Video (+7s)'}
                        </button>
                    </div>
                </details>
                <details>
                    <summary className="font-semibold cursor-pointer text-white">Export &amp; Frame Tools</summary>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button onClick={handleExportSrt} className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                            <ClosedCaptionIcon className="h-4 w-4 mr-2" /> Download SRT
                        </button>
                        <button onClick={handleExportFrame} className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                            <CameraIcon className="h-4 w-4 mr-2" /> Capture Frame
                        </button>
                        <button onClick={handleUseFrameAsStart} className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                            <ImageIcon className="h-4 w-4 mr-2" /> Use as Start
                        </button>
                        <button onClick={handleRemixFromFrame} className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                            <PencilIcon className="h-4 w-4 mr-2" /> Remix from Frame
                        </button>
                    </div>
                </details>
            </div>
        </div>
    );
};

export const GenerationView: React.FC<GenerationViewProps> = () => {
    // Fix: Destructure missing context values
    const {
        brandVoice,
        attemptGeneration,
        onSuccessfulGeneration,
        initialGenerationProps,
        onInitialPropsConsumed,
        addNotification,
        promptHistory,
        setPromptHistory,
        activeProjectId,
        handleSaveAssetToProject,
        sessionState,
        updateSessionState,
        abortControllerRef,
        withApiErrorHandling,
        // NEW: Generation-specific states from context, now managed globally.
        generatedImage, setGeneratedImage,
        generatedVideo, setGeneratedVideo,
        generatedSpeechUrl, setGeneratedSpeechUrl,
        viralScriptResult, setViralScriptResult, // ViralScriptResult is global for export hub
        isGeneratingScriptAudio,
        scriptAudio,
        setScriptAudio, // Destructure setScriptAudio
        handleCancel,
        handleTypeChange,
        setInitialGenerationProps,
        handleGenerateVideoFromScript,
    } = useAppContext();

    // Shared State
    const [activeTab, setActiveTab] = useState<GenerationType>('script');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [interruptedVideoAction, setInterruptedVideoAction] = useState<(() => Promise<void>) | null>(null);

    // Local state for all inputs
    const [prompt, setPrompt] = useState('');
    const [link, setLink] = useState('');
    const [imageModel, setImageModel] = useState<ImageModel>('imagen-4.0-generate-001');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [imageAspectRatio, setImageAspectRatio] = useState<ImageAspectRatio>('1:1');
    const [imageStylePresets, setImageStylePresets] = useState<string[]>([]);
    const [imageMimeType, setImageMimeType] = useState<ImageMimeType>('image/jpeg');
    const [videoModel, setVideoModel] = useState<VideoModel>('veo-3.1-fast-generate-preview');
    const [videoAspectRatio, setVideoAspectRatio] = useState<VideoAspectRatio>('16:9');
    const [resolution, setResolution] = useState<VideoResolution>('1080p');
    const [videoStylePresets, setVideoStylePresets] = useState<string[]>([]);
    const [watermark, setWatermark] = useState('');
    const [voiceoverScripts, setVoiceoverScripts] = useState<VoiceoverScript[]>([
        { id: 1, speaker: 'Speaker 1', script: '', voice: 'Kore', style: 'Default' }
    ]);

    // Sub-generation state (these remain local as they are derived from main generation)
    const [generatedSocialPost, setGeneratedSocialPost] = useState<string | null>(null);
    const [isGeneratingSocialPost, setIsGeneratingSocialPost] = useState(false);
    // const [scriptAudio, setScriptAudio] = useState<{ url: string; blob: Blob } | null>(null); // Moved to AppContext
    // const [isGeneratingScriptAudio, setIsGeneratingScriptAudio] = useState(false); // Moved to AppContext
    const [storyboardImages, setStoryboardImages] = useState<{ scene: string; imageUrl: string | null | 'error'; }[]>([]);
    const [editPrompt, setEditPrompt] = useState('');
    const [referenceFrames, setReferenceFrames] = useState<{ file: File, preview: string }[]>([]);
    const [copiedImage, setCopiedImage] = useState(false);


    // Smart Session: Load state when tab changes
    useEffect(() => {
        const savedState = sessionState[activeTab] || {};
        setPrompt(savedState.prompt || '');
        setLink(savedState.link || '');
        setImageModel(savedState.imageModel || 'imagen-4.0-generate-001');
        setNegativePrompt(savedState.negativePrompt || '');
        setImageAspectRatio(savedState.imageAspectRatio || '1:1');
        setImageStylePresets(savedState.imageStylePresets || []);
        setImageMimeType(savedState.imageMimeType || 'image/jpeg');
        setVideoModel(savedState.videoModel || 'veo-3.1-fast-generate-preview');
        setVideoAspectRatio(savedState.videoAspectRatio || '16:9');
        setResolution(savedState.resolution || '1080p');
        setVideoStylePresets(savedState.videoStylePresets || []);
        setWatermark(savedState.watermark || '');
        setVoiceoverScripts(savedState.voiceoverScripts || [{ id: 1, speaker: 'Speaker 1', script: '', voice: 'Kore', style: 'Default' }]);

        // Also clear local results when tab changes to avoid stale displays
        resetLocalResults();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]); // Removed sessionState to prevent infinite loop

    // Smart Session: Save state when inputs change (DEBOUNCED)
    useEffect(() => {
        const handler = setTimeout(() => {
            updateSessionState(activeTab, {
                prompt, link, imageModel, negativePrompt, imageAspectRatio, imageStylePresets, imageMimeType,
                videoModel, videoAspectRatio, resolution, videoStylePresets, watermark, voiceoverScripts
            });
        }, 500); // Debounce to prevent infinite loop on rapid updates

        return () => clearTimeout(handler);
    }, [
        activeTab, prompt, link, imageModel, negativePrompt, imageAspectRatio, imageStylePresets, imageMimeType,
        videoModel, videoAspectRatio, resolution, videoStylePresets, watermark, voiceoverScripts, updateSessionState
    ]);

    // Initial script from another view
    useEffect(() => {
        if (initialGenerationProps) {
            console.log('GenerationView: Consuming initialGenerationProps', initialGenerationProps);
            setPrompt(initialGenerationProps.prompt);
            setActiveTab(initialGenerationProps.type);
            if (initialGenerationProps.settings?.imageAspectRatio) {
                setImageAspectRatio(initialGenerationProps.settings.imageAspectRatio);
            }
            // Ensure any previous local generation results are cleared when new props arrive
            resetLocalResults();
            onInitialPropsConsumed();

            if (initialGenerationProps.autoStart) {
                // Pass the prompt and type directly to ensure we use the correct values immediately
                handleGenerate(initialGenerationProps.prompt, initialGenerationProps.type);
            }
        }
    }, [initialGenerationProps, onInitialPropsConsumed]);

    const addToHistory = (item: Omit<PromptHistoryItem, 'timestamp'>) => {
        const newItem = { ...item, timestamp: new Date().toISOString() };
        setPromptHistory(prev => [newItem, ...(prev || []).slice(0, 99)]); // Keep last 100
    };

    const handleSelectFromHistory = (item: PromptHistoryItem) => {
        setActiveTab(item.type);
        setPrompt(item.prompt);
        // Restore all settings from history
        if (item.link) setLink(item.link);
        if (item.imageModel) setImageModel(item.imageModel);
        if (item.aspectRatio) {
            if (item.type === 'image') setImageAspectRatio(item.aspectRatio as ImageAspectRatio);
            if (item.type === 'video') setVideoAspectRatio(item.aspectRatio as VideoAspectRatio);
        }
        if (item.imageStylePresets) setImageStylePresets(item.imageStylePresets);
        if (item.imageMimeType) setImageMimeType(item.imageMimeType);
        if (item.videoModel) setVideoModel(item.videoModel);
        if (item.resolution) setResolution(item.resolution as VideoResolution);
        if (item.videoStylePresets) setVideoStylePresets(item.videoStylePresets);
        if (item.voiceoverScripts) setVoiceoverScripts(item.voiceoverScripts);
        if (item.voice) setVoiceoverScripts([{ id: 1, speaker: 'Speaker 1', script: item.prompt, voice: item.voice }]);

        setIsHistoryOpen(false);
    };

    // New function to reset local generation results
    const resetLocalResults = useCallback(() => {
        setError(null);
        setViralScriptResult(null); // Now global state setter
        setGeneratedImage(null); // Now global state setter
        setGeneratedVideo(null); // Now global state setter
        setGeneratedSpeechUrl(null); // Now global state setter
        setGeneratedSocialPost(null);
        // Clear script audio which is now global
        setScriptAudio(null);
        setStoryboardImages([]);
        // Clean up reference frame object URLs
        referenceFrames.forEach(f => URL.revokeObjectURL(f.preview));
        setReferenceFrames([]);
        console.log('GenerationView: Local results reset.');
    }, [setViralScriptResult, setGeneratedImage, setGeneratedVideo, setGeneratedSpeechUrl, setGeneratedSocialPost, setScriptAudio, referenceFrames]);

    const handleClearInputs = () => {
        setPrompt('');
        setLink('');
        setNegativePrompt('');
        setReferenceFrames([]);
        setVoiceoverScripts([{ id: 1, speaker: 'Speaker 1', script: '', voice: 'Kore', style: 'Default' }]);
        // Add reset for other fields if necessary, or keep defaults
        addNotification('Inputs cleared.', 'info');
    };

    const handleRetryStoryboardImage = async (index: number) => {
        if (!storyboardImages[index] || !attemptGeneration()) return;

        setStoryboardImages(prev => {
            const newImages = [...prev];
            if (newImages[index]) newImages[index].imageUrl = null; // loading
            return newImages;
        });

        try {
            const imageUrl = await withApiErrorHandling(aiService.generateImage, `Cinematic shot for a video: ${storyboardImages[index].scene}`, 'gemini-2.5-flash-image', '16:9', 'image/jpeg');
            setStoryboardImages(prev => {
                const newImages = [...prev];
                if (newImages[index]) newImages[index].imageUrl = imageUrl;
                return newImages;
            });
            onSuccessfulGeneration();
        } catch (e: any) {
            if (e.name === 'AbortError') console.log('Storyboard image retry aborted.');
            else {
                console.error(`Failed to retry image for scene ${index}:`, e);
                setStoryboardImages(prev => {
                    const newImages = [...prev];
                    if (newImages[index]) newImages[index].imageUrl = 'error';
                    return newImages;
                });
            }
        }
    };

    const handleSelectKeyAndGenerate = async () => {
        if ((window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
        }
        setIsApiKeyModalOpen(false);
        if (interruptedVideoAction) {
            await interruptedVideoAction();
            setInterruptedVideoAction(null);
        }
    };

    const handleGenerate = async (manualPrompt?: string, manualTab?: GenerationType) => {
        const promptToUse = manualPrompt || prompt;
        const tabToUse = manualTab || activeTab;

        if (!promptToUse.trim() && tabToUse !== 'speech') {
            setError('Please enter a prompt.');
            return;
        }
        if (tabToUse === 'speech' && voiceoverScripts.every(vs => !vs.script.trim()) && !promptToUse.trim()) {
            setError('Please enter some text for the speech generation.');
            return;
        }

        if (!attemptGeneration()) return;

        if (tabToUse === 'video') {
            const generateAction = async () => {
                resetLocalResults(); // Reset local results before starting new generation
                setIsLoading(true);
                try {
                    const videoPrompt = `${promptToUse} ${videoStylePresets.join(', ')}`;
                    const frameFiles = referenceFrames.map(f => f.file);
                    const videoResult = await withApiErrorHandling(aiService.generateVideo, videoPrompt, videoModel, videoAspectRatio, resolution, frameFiles);
                    setGeneratedVideo(videoResult); // Use global setter
                    if (voiceoverScripts.some(vs => vs.script.trim())) {
                        const speechBase64 = await withApiErrorHandling(aiService.generateSpeech, voiceoverScripts);
                        if (speechBase64) {
                            const audioBlob = pcmToMp3Blob(new Int16Array(decode(speechBase64).buffer), 24000, 1);
                            if (setScriptAudio) {
                                setScriptAudio({ url: URL.createObjectURL(audioBlob), blob: audioBlob }); // Now handled by global context setter
                            }
                        }
                    }
                    addToHistory({ type: 'video', prompt: promptToUse, videoModel, aspectRatio: videoAspectRatio, resolution, videoStylePresets, referenceFrameCount: referenceFrames.length, voiceoverScripts });
                    onSuccessfulGeneration();
                } catch (err: any) {
                    if (err.name === 'AbortError') {
                        console.log('Video generation aborted.');
                    } else if (err.message?.includes("Requested entity was not found.")) {
                        setError("Your API key may be invalid or expired. Please select a new one to continue.");
                        setInterruptedVideoAction(() => generateAction);
                        setIsApiKeyModalOpen(true);
                    } else {
                        setError(err.message || 'An unexpected error occurred.');
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            if ((window as any).aistudio && !(await (window as any).aistudio.hasSelectedApiKey())) {
                setInterruptedVideoAction(() => generateAction);
                setIsApiKeyModalOpen(true);
                return;
            }
            await generateAction();
            return;
        }


        resetLocalResults(); // Reset local results before starting new generation
        setIsLoading(true);

        try {
            switch (tabToUse) {
                case 'script': {
                    let scriptText = '';
                    await withApiErrorHandling(aiService.generateViralScript, promptToUse, link, brandVoice, (chunk) => {
                        scriptText += chunk;
                        setViralScriptResult(parseViralScript(scriptText)); // Use global setter
                    });

                    const finalScript = parseViralScript(scriptText);
                    setViralScriptResult(finalScript); // Use global setter

                    if (finalScript.storyboard) {
                        const scenes = finalScript.storyboard.split('\n').map(s => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
                        if (scenes.length > 0) {
                            setStoryboardImages(scenes.map(scene => ({ scene, imageUrl: null })));

                            Promise.allSettled(scenes.map(scene =>
                                withApiErrorHandling(aiService.generateImage, `Cinematic shot for a video: ${scene}`, 'gemini-2.5-flash-image', '16:9', 'image/jpeg')
                            )).then(results => {
                                setStoryboardImages(scenes.map((scene, index) => {
                                    const result = results[index];
                                    return {
                                        scene,
                                        imageUrl: result.status === 'fulfilled' ? result.value : 'error'
                                    };
                                }));
                            });
                        }
                    }

                    addToHistory({ type: 'script', prompt: promptToUse, link });
                    onSuccessfulGeneration();
                    break;
                }
                case 'image': {
                    const imagePrompt = `${promptToUse} ${imageStylePresets.join(', ')}`;
                    const imageUrl = await withApiErrorHandling(aiService.generateImage, imagePrompt, imageModel, imageAspectRatio, imageMimeType, negativePrompt);
                    setGeneratedImage(imageUrl); // Use global setter
                    addToHistory({ type: 'image', prompt: promptToUse, imageModel, aspectRatio: imageAspectRatio, imageStylePresets, imageMimeType });
                    onSuccessfulGeneration();
                    break;
                }
                case 'speech': {
                    const scriptsToProcess = voiceoverScripts.filter(vs => vs.script.trim());
                    if (scriptsToProcess.length === 0 && promptToUse.trim()) {
                        scriptsToProcess.push({ ...voiceoverScripts[0], script: promptToUse.trim() });
                    }
                    if (scriptsToProcess.length === 0) {
                        throw new Error("No text provided for speech generation.");
                    }
                    const speechBase64 = await withApiErrorHandling(aiService.generateSpeech, scriptsToProcess);
                    if (speechBase64) {
                        // Fix: Define audioBlob before using it
                        const audioBlob = pcmToMp3Blob(new Int16Array(decode(speechBase64).buffer), 24000, 1);
                        setGeneratedSpeechUrl(URL.createObjectURL(audioBlob)); // Use global setter
                    }
                    addToHistory({ type: 'speech', prompt: promptToUse, voiceoverScripts: scriptsToProcess });
                    onSuccessfulGeneration();
                    break;
                }
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Generation aborted.');
            } else {
                setError(err.message || 'An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSocialPost = async (script: string) => {
        if (!attemptGeneration()) return;
        setIsGeneratingSocialPost(true);
        setGeneratedSocialPost('');
        try {
            let postContent = '';
            await withApiErrorHandling(aiService.generateSocialPostFromScript, script, brandVoice, (chunk) => {
                postContent += chunk;
                setGeneratedSocialPost(postContent);
            });
            onSuccessfulGeneration();
        } catch (err: any) {
            if (err.name === 'AbortError') console.log('Social post generation aborted.');
            else setError(err.message || 'Failed to generate social post.');
        } finally {
            setIsGeneratingSocialPost(false);
        }
    };

    const handleListenToScript = async (script: string, voice: string, style: string) => {
        if (!attemptGeneration()) return;
        // if (scriptAudio) URL.revokeObjectURL(scriptAudio.url); // scriptAudio is now global
        // setScriptAudio(null); // scriptAudio is now global
        // setIsGeneratingScriptAudio(true); // isGeneratingScriptAudio is now global
        try {
            const audioBlob = await withApiErrorHandling(aiService.generateSpeechFromText, script, voice, style);
            // setScriptAudio({ url: URL.createObjectURL(audioBlob), blob: audioBlob }); // Now handled by global context setter
            onSuccessfulGeneration();
        } catch (err: any) {
            if (err.name === 'AbortError') console.log('Audio generation for script aborted.');
            else setError(err.message || 'Failed to generate audio for the script.');
        } finally {
            // setIsGeneratingScriptAudio(false); // isGeneratingScriptAudio is now global
        }
    };

    const handleExtendVideo = async (newPrompt: string, payload: any) => {
        if (!attemptGeneration()) return;

        const extendAction = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const videoResult = await withApiErrorHandling(aiService.extendVideo, newPrompt, payload);
                setGeneratedVideo(videoResult); // Use global setter
                addNotification("Video extended successfully!", 'success');
                onSuccessfulGeneration();
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('Video extension aborted.');
                } else if (err.message?.includes("Requested entity was not found.")) {
                    setError("Your API key may be invalid or expired. Please select a new one to continue.");
                    setInterruptedVideoAction(() => extendAction);
                    setIsApiKeyModalOpen(true);
                } else {
                    setError(err.message || 'Failed to extend video.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if ((window as any).aistudio && !(await (window as any).aistudio.hasSelectedApiKey())) {
            setInterruptedVideoAction(() => extendAction);
            setIsApiKeyModalOpen(true);
            return;
        }

        await extendAction();
    };

    const handleRemixVideo = async (remixPrompt: string) => {
        if (!remixPrompt.trim() || !attemptGeneration()) return;

        const remixAction = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const newPrompt = `${prompt}\n\nREMIX INSTRUCTION: ${remixPrompt}`;
                const frameFiles = referenceFrames.map(f => f.file);
                const videoResult = await withApiErrorHandling(aiService.generateVideo, newPrompt, videoModel, videoAspectRatio, resolution, frameFiles);
                setGeneratedVideo(videoResult); // Use global setter
                setPrompt(newPrompt);
                addToHistory({ type: 'video', prompt: newPrompt, videoModel, aspectRatio: videoAspectRatio, resolution, videoStylePresets, referenceFrameCount: referenceFrames.length });
                onSuccessfulGeneration();
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('Video remix aborted.');
                } else if (err.message?.includes("Requested entity was not found.")) {
                    setError("Your API key may be invalid or expired. Please select a new one to continue.");
                    setInterruptedVideoAction(() => remixAction);
                    setIsApiKeyModalOpen(true);
                } else {
                    setError(err.message || 'An unexpected error occurred during remix.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if ((window as any).aistudio && !(await (window as any).aistudio.hasSelectedApiKey())) {
            setInterruptedVideoAction(() => remixAction);
            setIsApiKeyModalOpen(true);
            return;
        }

        await remixAction();
    };

    const handleEditImage = async () => {
        if (!editPrompt.trim() || !generatedImage || !attemptGeneration()) return;
        setIsLoading(true);
        setError(null);
        try {
            const [header, base64] = generatedImage.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            const newImageUrl = await withApiErrorHandling(aiService.editImage, base64, mimeType, editPrompt);
            setGeneratedImage(newImageUrl); // Use global setter
            setEditPrompt('');
            onSuccessfulGeneration();
        } catch (err: any) {
            if (err.name === 'AbortError') console.log('Image edit aborted.');
            else setError(err.message || 'Failed to edit image.');
        } finally {
            setIsLoading(false);
        }
    }

    const onExportSrt = (duration: number) => {
        if (!prompt) return;
        const srtContent = exportScriptAsSrt(prompt, duration);
        const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${slugify(prompt)}_subtitles.srt`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    const captureFrameAsFile = (videoEl: HTMLVideoElement): Promise<File> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth; canvas.height = videoEl.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error("Could not get canvas context"));
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], `frame_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    resolve(file);
                } else {
                    reject(new Error("Failed to create blob from canvas"));
                }
            }, 'image/jpeg', 0.95);
        });
    };

    const onExportFrame = async (videoEl: HTMLVideoElement) => {
        try {
            const file = await captureFrameAsFile(videoEl);
            const url = URL.createObjectURL(file);
            const a = document.createElement('a'); a.href = url; a.download = file.name;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        } catch (e) { setError((e as Error).message); }
    };

    const onUseFrameAsStart = async (videoEl: HTMLVideoElement) => {
        try {
            const file = await captureFrameAsFile(videoEl);
            // Clear existing reference frames and add this one as the start image
            referenceFrames.forEach(f => URL.revokeObjectURL(f.preview)); // Clean up existing URLs
            setReferenceFrames([{ file, preview: URL.createObjectURL(file) }]);
            addNotification('Video frame set as starting reference image.', 'success');
        } catch (e) { setError((e as Error).message); }
    };

    const onRemixFromFrame = async (videoEl: HTMLVideoElement) => {
        try {
            const file = await captureFrameAsFile(videoEl);
            const base64Data = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(file);
            });
            // This is a simplified approach; in a full app, you might set a specific state
            // to indicate the source image for the remix.
            setInitialGenerationProps({
                prompt: 'Remix video using this captured frame as a reference.',
                type: 'video',
                settings: {
                    referenceImage: {
                        imageBytes: base64Data,
                        mimeType: 'image/jpeg',
                    }
                }
            });
            handleTypeChange('contentGeneration');
            addNotification('Video frame loaded as remix reference. Adjust prompt and generate.', 'info');
        } catch (e) { setError((e as Error).message); }
    };

    const handleCopyImage = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2000);
            addNotification('Image copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy image:', err);
            addNotification('Failed to copy image.', 'error');
        }
    };

    const handleDownloadImage = (imageUrl: string) => {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `generated_image_${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div id="generation-type-tabs" className="glass-card flex bg-black/20 rounded-lg p-1">
                    <button onClick={() => setActiveTab('script')} className={`w-1/4 py-2 text-sm font-semibold rounded-md relative transition-colors ${activeTab !== 'script' ? 'text-gray-300 hover:text-white' : ''}`}>
                        {activeTab === 'script' && <motion.div layoutId="genTab" className="absolute inset-0 bg-white/10 rounded-md shadow" />}
                        <MagicWandIcon className="h-5 w-5 mx-auto mb-1 relative z-10" />
                        <span className="relative z-10">Script</span>
                    </button>
                    <button onClick={() => setActiveTab('image')} className={`w-1/4 py-2 text-sm font-semibold rounded-md relative transition-colors ${activeTab !== 'image' ? 'text-gray-300 hover:text-white' : ''}`}>
                        {activeTab === 'image' && <motion.div layoutId="genTab" className="absolute inset-0 bg-white/10 rounded-md shadow" />}
                        <ImageIcon className="h-5 w-5 mx-auto mb-1 relative z-10" />
                        <span className="relative z-10">Image</span>
                    </button>
                    <button onClick={() => setActiveTab('video')} className={`w-1/4 py-2 text-sm font-semibold rounded-md relative transition-colors ${activeTab !== 'video' ? 'text-gray-300 hover:text-white' : ''}`}>
                        {activeTab === 'video' && <motion.div layoutId="genTab" className="absolute inset-0 bg-white/10 rounded-md shadow" />}
                        <VideoCameraIcon className="h-5 w-5 mx-auto mb-1 relative z-10" />
                        <span className="relative z-10">Video</span>
                    </button>
                    <button onClick={() => setActiveTab('speech')} className={`w-1/4 py-2 text-sm font-semibold rounded-md relative transition-colors ${activeTab !== 'speech' ? 'text-gray-300 hover:text-white' : ''}`}>
                        {activeTab === 'speech' && <motion.div layoutId="genTab" className="absolute inset-0 bg-white/10 rounded-md shadow" />}
                        <SpeakerWaveIcon className="h-5 w-5 mx-auto mb-1 relative z-10" />
                        <span className="relative z-10">Speech</span>
                    </button>
                </div>

                <GenerationControls
                    activeTab={activeTab}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onOpenTemplates={() => setIsTemplatesModalOpen(true)}
                    onClearAll={handleClearInputs}
                    link={link}
                    setLink={setLink}
                    imageModel={imageModel}
                    setImageModel={setImageModel}
                    negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}
                    imageAspectRatio={imageAspectRatio}
                    setImageAspectRatio={setImageAspectRatio}
                    imageStylePresets={imageStylePresets}
                    setImageStylePresets={setImageStylePresets}
                    imageMimeType={imageMimeType}
                    setImageMimeType={setImageMimeType}
                    videoModel={videoModel}
                    setVideoModel={setVideoModel}
                    videoAspectRatio={videoAspectRatio}
                    setVideoAspectRatio={setVideoAspectRatio}
                    resolution={resolution}
                    setResolution={setResolution}
                    videoStylePresets={videoStylePresets}
                    setVideoStylePresets={setVideoStylePresets}
                    referenceFrames={referenceFrames}
                    setReferenceFrames={setReferenceFrames}
                    watermark={watermark}
                    setWatermark={setWatermark}
                    voiceoverScripts={voiceoverScripts}
                    setVoiceoverScripts={setVoiceoverScripts}
                    withApiErrorHandling={withApiErrorHandling}
                    abortControllerRef={abortControllerRef}
                />

                <button
                    id="generate-button"
                    onClick={() => handleGenerate()}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full flex items-center justify-center p-4 text-lg font-bold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-transform active:scale-95"
                >
                    <SparklesIcon className="h-6 w-6 mr-3" />
                    {isLoading ? 'Generating...' : 'Generate Content'}
                </button>
                {error && (
                    <ErrorMessage message={error} onClear={() => setError(null)} />
                )}
            </div>

            <div id="generation-results-panel" className="lg:col-span-3 space-y-6">
                {isLoading && (
                    <Loader message="Generating your content..." onCancel={handleCancel} />
                )}

                {!isLoading && activeTab === 'script' && viralScriptResult && (
                    <ViralScriptCard
                        scriptData={viralScriptResult}
                        storyboardImages={storyboardImages}
                        onGenerateVideoFromScript={handleGenerateVideoFromScript}
                        onGenerateThumbnail={(concept) => {
                            setInitialGenerationProps({ prompt: concept, type: 'image', settings: { aspectRatio: '1:1' } });
                            handleTypeChange('contentGeneration');
                        }}
                        onGenerateThumbnailFromHeader={() => {
                            setInitialGenerationProps({ prompt: viralScriptResult.titles[0] || viralScriptResult.description, type: 'image', settings: { aspectRatio: '1:1' } });
                            handleTypeChange('contentGeneration');
                        }}
                        onGenerateSocialPost={handleGenerateSocialPost}
                        isGeneratingSocialPost={isGeneratingSocialPost}
                        onListenToScript={handleListenToScript}
                        isGeneratingScriptAudio={isGeneratingScriptAudio}
                        scriptAudio={scriptAudio}
                        onCancelScriptAudio={handleCancel}
                        onRetryImage={handleRetryStoryboardImage}
                    />
                )}

                {!isLoading && activeTab === 'image' && generatedImage && (
                    <ResultCard
                        title="AI Generated Image"
                        onSave={() => handleSaveAssetToProject(generatedImage, 'image', prompt)}
                        actions={
                            <>
                                <button
                                    onClick={() => handleCopyImage(generatedImage)}
                                    className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                                    title="Copy to Clipboard"
                                >
                                    {copiedImage ? <CheckIcon className="h-5 w-5 text-green-400" /> : <ClipboardIcon className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={() => handleDownloadImage(generatedImage)}
                                    className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                                    title="Download Image"
                                >
                                    <DownloadIcon className="h-5 w-5" />
                                </button>
                            </>
                        }
                    >
                        <div className="space-y-4">
                            <img src={generatedImage} alt="AI Generated" className="w-full h-auto object-contain rounded-lg shadow-lg" />
                            <div className="p-4 bg-black/20 rounded-lg space-y-2">
                                <h4 className="font-semibold text-white">Edit this image</h4>
                                <textarea
                                    rows={2}
                                    value={editPrompt}
                                    onChange={e => setEditPrompt(e.target.value)}
                                    className="w-full text-sm p-2 bg-white/5 text-white border border-white/20 rounded-md"
                                    placeholder="e.g., Add a futuristic robot to the scene."
                                />
                                <button
                                    onClick={handleEditImage}
                                    disabled={!editPrompt.trim()}
                                    className="w-full flex items-center justify-center p-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-transform active:scale-95"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Edit Image
                                </button>
                            </div>
                        </div>
                    </ResultCard>
                )}

                {!isLoading && activeTab === 'video' && generatedVideo && (
                    <ResultCard
                        title="AI Generated Video"
                        onSave={() => handleSaveAssetToProject(generatedVideo.url, 'video', prompt)}
                    >
                        <VideoResult
                            video={generatedVideo}
                            prompt={prompt}
                            watermark={watermark}
                            onExtend={handleExtendVideo}
                            isExtending={isLoading}
                            onRemix={handleRemixVideo}
                            isRemixing={isLoading}
                            onCancel={handleCancel}
                            onExportSrt={onExportSrt}
                            onExportFrame={onExportFrame}
                            onUseFrameAsStart={onUseFrameAsStart}
                            onRemixFromFrame={onRemixFromFrame}
                            scriptAudio={scriptAudio}
                        />
                        {scriptAudio?.url && (
                            <div className="p-4 bg-black/20 rounded-lg mt-4 space-y-2">
                                <h4 className="font-semibold text-white">Generated Voiceover</h4>
                                <audio src={scriptAudio.url} controls className="w-full" />
                            </div>
                        )}
                    </ResultCard>
                )}

                {!isLoading && activeTab === 'speech' && generatedSpeechUrl && (
                    <ResultCard
                        title="AI Generated Speech"
                        onSave={() => handleSaveAssetToProject(generatedSpeechUrl, 'speech', prompt)}
                    >
                        <audio src={generatedSpeechUrl} controls autoPlay className="w-full" />
                        <p className="text-sm text-gray-400 mt-2">Listen to your generated speech.</p>
                    </ResultCard>
                )}
            </div>

            {isHistoryOpen && <PromptHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} onSelect={handleSelectFromHistory} />}
            {isTemplatesModalOpen && <PromptTemplatesModal onClose={() => setIsTemplatesModalOpen(false)} onSelect={(template) => { setPrompt(template); setIsTemplatesModalOpen(false); }} />}
            {isApiKeyModalOpen && (
                <ApiKeySelection
                    onClose={() => setIsApiKeyModalOpen(false)}
                    onSelectKey={handleSelectKeyAndGenerate}
                />
            )}
        </div>
    );
};
