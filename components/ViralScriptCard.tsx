
import React, { useState, useRef, useEffect } from 'react';
import type { ViralScript, VoiceoverScript } from '../types';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ShareIcon } from './icons/ShareIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpeakerPhoneIcon } from './icons/SpeakerPhoneIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ImageIcon } from './icons/ImageIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { useAppContext } from '../context/AppContext';
import { FolderIcon } from './icons/FolderIcon';
import { ExportIcon } from './icons/ExportIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface ViralScriptCardProps {
  scriptData: ViralScript;
  storyboardImages: { scene: string; imageUrl: string | null | 'error'; }[];
  onGenerateVideoFromScript: (script: string) => void;
  onGenerateThumbnail: (concept: string) => void;
  onGenerateThumbnailFromHeader: () => void;
  onGenerateSocialPost: (script: string) => Promise<void>;
  isGeneratingSocialPost: boolean;
  onListenToScript: (script: string, voice: string, style: string) => Promise<void>;
  isGeneratingScriptAudio: boolean;
  scriptAudio: { url: string; blob: Blob } | null;
  onCancelScriptAudio: () => void;
  onRetryImage: (index: number) => void;
}

const PROFESSIONAL_VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
const VOICE_STYLES = ['Default', 'Cheerful', 'Animated', 'Energetic', 'Calm', 'Authoritative', 'Serious', 'Whispering', 'Storyteller', 'News Anchor'];

const AccordionSection: React.FC<{ title: string, children: React.ReactNode, actions?: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, actions, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <h4 className="font-semibold text-lg text-white">{title}</h4>
                <div className="flex items-center">
                    {actions && <div className="mr-4" onClick={e => e.stopPropagation()}>{actions}</div>}
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0">
                            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-300">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const { addNotification } = useAppContext();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        addNotification('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-400 hover:bg-white/20 hover:text-white"
            title="Copy section content"
        >
            {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
        </button>
    );
};

// Simple renderer for basic markdown features common in AI output
const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    // 1. Split by double newlines to handle paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return (
        <div className="space-y-4 font-sans text-sm text-gray-300">
            {paragraphs.map((paragraph, i) => {
                // Check for list items
                if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    const items = paragraph.split('\n').map(line => line.trim().replace(/^[-*]\s+/, ''));
                    return (
                        <ul key={i} className="list-disc list-inside space-y-1 ml-2">
                            {items.map((item, j) => (
                                <li key={j} dangerouslySetInnerHTML={{ 
                                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') 
                                }} />
                            ))}
                        </ul>
                    );
                }
                
                // Standard paragraph with bold formatting
                const htmlContent = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                return <p key={i} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
            })}
        </div>
    );
};

export const ViralScriptCard: React.FC<ViralScriptCardProps> = ({ 
    scriptData, 
    storyboardImages,
    onGenerateVideoFromScript,
    onGenerateThumbnail,
    onGenerateThumbnailFromHeader,
    onGenerateSocialPost,
    isGeneratingSocialPost,
    onListenToScript,
    isGeneratingScriptAudio,
    scriptAudio,
    onCancelScriptAudio,
    onRetryImage,
}) => {
    const { activeProjectId, handleSaveAssetToProject, setIsExportHubOpen, saveConfirmation, setViralScriptResult, addNotification } = useAppContext();
    const { titles, description, tags, thumbnailConcepts, script, storyboard, monetization, socialPost } = scriptData;
    const audioRef = useRef<HTMLAudioElement>(null);
    const [voiceoverScripts, setVoiceoverScripts] = useState<VoiceoverScript[]>([]);
    const [voiceStyle, setVoiceStyle] = useState(VOICE_STYLES[0]);

    useEffect(() => {
        // Set this script as the exportable one in the context
        setViralScriptResult(scriptData);
        return () => setViralScriptResult(null); // Cleanup
    }, [scriptData, setViralScriptResult]);

    useEffect(() => {
        const speakerRegex = /^([A-Z0-9\s]+):/gm;
        const matches = [...script.matchAll(speakerRegex)];
        const speakerNames = [...new Set(matches.map(m => m[1].trim()))].slice(0, 2);
        
        if (speakerNames.length > 1) {
            const scriptsBySpeaker: Record<string, string[]> = {};
            speakerNames.forEach(name => scriptsBySpeaker[name] = []);
            let currentSpeaker = '';
            script.split('\n').forEach(line => {
                const speakerMatch = line.match(/^([A-Z0-9\s]+):/);
                if (speakerMatch && speakerNames.includes(speakerMatch[1].trim())) {
                    currentSpeaker = speakerMatch[1].trim();
                    scriptsBySpeaker[currentSpeaker].push(line.substring(speakerMatch[0].length).trim());
                } else if (currentSpeaker && line.trim()) {
                    scriptsBySpeaker[currentSpeaker].push(line.trim());
                }
            });
            setVoiceoverScripts(speakerNames.map((name, index) => ({
                id: index + 1,
                speaker: name,
                script: scriptsBySpeaker[name].join(' '),
                voice: PROFESSIONAL_VOICES[index % PROFESSIONAL_VOICES.length]
            })));
        } else {
            setVoiceoverScripts([{ id: 1, speaker: 'Narrator', script: script, voice: PROFESSIONAL_VOICES[0] }]);
        }

    }, [script]);
    
    useEffect(() => {
        if (scriptAudio?.url && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
        }
    }, [scriptAudio]);
    
    const handleListenClick = async () => {
        if (voiceoverScripts.length > 1) {
            await onListenToScript(script, voiceoverScripts[0].voice, voiceStyle);
        } else {
            await onListenToScript(voiceoverScripts[0].script, voiceoverScripts[0].voice, voiceStyle);
        }
    };
    
    const updateVoiceoverScript = (id: number, updated: Partial<VoiceoverScript>) => {
        setVoiceoverScripts(voiceoverScripts.map(vs =>
            vs.id === id ? { ...vs, ...updated } : vs
        ));
    };

    return (
        <div className="glass-card overflow-hidden">
             <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Viral Video Blueprint</h3>
                <div className="flex items-center space-x-2">
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
                    {activeProjectId && (
                        <button onClick={() => handleSaveAssetToProject(scriptData, 'script', titles[0] || 'Viral Script')} className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                            <FolderIcon className="h-4 w-4 mr-2" /> Save
                        </button>
                    )}
                    <button onClick={() => setIsExportHubOpen(true)} className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20">
                        <ExportIcon className="h-4 w-4 mr-2" />
                        Export...
                    </button>
                </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
                {titles.length > 0 && (
                    <AccordionSection
                        title="Clickable Titles"
                        defaultOpen
                        actions={
                            <div className="flex items-center gap-2">
                                <CopyButton text={titles.join('\n')} />
                                <button
                                    onClick={onGenerateThumbnailFromHeader}
                                    className="flex items-center px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-900/50 rounded-md hover:bg-amber-900"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" /> Generate Thumbnail
                                </button>
                            </div>
                        }
                    >
                        <ul className="list-disc list-inside space-y-1">{titles.map((t, i) => <li key={i}>{t}</li>)}</ul>
                    </AccordionSection>
                )}
                {description && (
                    <AccordionSection 
                        title="SEO Description" 
                        defaultOpen
                        actions={
                            <div className="flex items-center gap-2">
                                <CopyButton text={description} />
                                <button 
                                    onClick={() => onGenerateSocialPost(script)} 
                                    disabled={isGeneratingSocialPost}
                                    className="flex items-center px-3 py-1.5 text-xs font-medium text-green-400 bg-green-900/50 rounded-md hover:bg-green-900 disabled:opacity-50"
                                >
                                    <ShareIcon className="h-4 w-4 mr-2" />
                                    {isGeneratingSocialPost ? 'Generating...' : 'Generate Post'}
                                </button>
                            </div>
                        }
                    >
                        <p>{description.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
                    </AccordionSection>
                )}
                 {socialPost && (
                    <AccordionSection title="Generated Social Post" defaultOpen actions={<CopyButton text={socialPost} />}>
                        <div className="p-3 bg-black/20 rounded-md">
                             <pre className="whitespace-pre-wrap font-sans">{socialPost}</pre>
                        </div>
                    </AccordionSection>
                )}
                {tags.length > 0 && (
                     <AccordionSection title="Discoverability Tags" actions={<CopyButton text={tags.join(', ')} />}>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 text-xs bg-white/10 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </AccordionSection>
                )}
                {thumbnailConcepts.length > 0 && (
                    <AccordionSection title="Thumbnail Concepts" actions={<CopyButton text={thumbnailConcepts.join('\n')} />}>
                         <ul className="space-y-2">
                            {thumbnailConcepts.map((concept, i) => (
                                <li key={i} className="flex justify-between items-center">
                                    <span>{concept}</span>
                                    <button 
                                        onClick={() => onGenerateThumbnail(concept)}
                                        className="flex-shrink-0 ml-4 flex items-center px-2 py-1 text-xs font-medium text-indigo-400 bg-indigo-900/50 rounded-md hover:bg-indigo-900"
                                    >
                                        <SparklesIcon className="h-3 w-3 mr-1" />
                                        Generate
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </AccordionSection>
                )}
                 {script && (
                    <AccordionSection title="Engaging Video Script" defaultOpen actions={<CopyButton text={script} />}>
                         <SimpleMarkdownRenderer text={script} />
                    </AccordionSection>
                )}
                {script && (
                    <AccordionSection title="Voiceover Studio">
                        <div className="p-4 bg-black/20 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Listen to this Script</label>
                                {isGeneratingScriptAudio ? (
                                    <button onClick={onCancelScriptAudio} className="flex items-center px-3 py-1 text-xs font-medium text-red-400 bg-red-900/50 rounded-md hover:bg-red-900">
                                        <XCircleIcon className="h-4 w-4 mr-1" /> Cancel
                                    </button>
                                ) : (
                                    <button onClick={handleListenClick} className="flex items-center px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-900/50 rounded-md hover:bg-indigo-900" aria-label="Listen to script">
                                        <SpeakerPhoneIcon className="h-4 w-4 mr-1" /> Listen
                                    </button>
                                )}
                            </div>
                            {voiceoverScripts.length > 1 ? (
                                <div className="space-y-3">
                                     <p className="text-xs text-gray-500">Multi-speaker audio generation is now available in the main "Video" generation tab. This preview uses a single voice.</p>
                                    {voiceoverScripts.map(vs => (
                                        <div key={vs.id} className="grid grid-cols-2 gap-2 items-center">
                                            <span className="text-sm font-semibold truncate">{vs.speaker}</span>
                                            <select
                                                value={vs.voice}
                                                onChange={e => updateVoiceoverScript(vs.id, { voice: e.target.value })}
                                                className="w-full p-2 text-sm bg-white/5 border border-white/20 rounded-md"
                                            >
                                                {PROFESSIONAL_VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <select 
                                        value={voiceoverScripts[0]?.voice || PROFESSIONAL_VOICES[0]}
                                        onChange={(e) => updateVoiceoverScript(1, { voice: e.target.value })}
                                        className="w-full p-2 text-sm bg-white/5 border border-white/20 rounded-md"
                                    >
                                        {PROFESSIONAL_VOICES.map(voice => <option key={voice} value={voice}>{voice}</option>)}
                                    </select>
                                    <select 
                                        value={voiceStyle}
                                        onChange={(e) => setVoiceStyle(e.target.value)}
                                        className="w-full p-2 text-sm bg-white/5 border border-white/20 rounded-md"
                                    >
                                        {VOICE_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                                    </select>
                                </div>
                            )}
                            {scriptAudio?.url && (
                                <div className="pt-2 flex items-center gap-2">
                                    <audio ref={audioRef} src={scriptAudio.url} controls className="w-full" />
                                    <a href={scriptAudio.url} download="script_audio.mp3" className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:bg-white/20" aria-label="Download audio">
                                        <DownloadIcon className="h-5 w-5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </AccordionSection>
                )}
                 {storyboard && (
                    <AccordionSection title="Visual Storyboard" defaultOpen actions={<CopyButton text={storyboard} />}>
                        <div className="space-y-4">
                            {storyboardImages.length > 0 ? (
                                storyboardImages.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                                    <div className="col-span-2">
                                        <p className="font-semibold text-xs mb-1 text-gray-400">Scene {index + 1}</p>
                                        <p>{item.scene}</p>
                                    </div>
                                    <div className="col-span-1 h-24 bg-black/20 rounded-md flex items-center justify-center">
                                        {item.imageUrl === 'error' ? (
                                            <div className="flex flex-col items-center text-center text-red-400 p-2" title="Image generation failed">
                                                <ExclamationTriangleIcon className="h-6 w-6" />
                                                <button onClick={() => onRetryImage(index)} className="mt-1 text-xs font-semibold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full hover:bg-red-500/40">Retry</button>
                                            </div>
                                        ) : item.imageUrl ? (
                                            <img src={item.imageUrl} alt={`Scene ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                        ) : (
                                            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-400"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                            ) : (
                                <SimpleMarkdownRenderer text={storyboard} />
                            )}
                        </div>
                    </AccordionSection>
                )}
                {monetization && (
                    <AccordionSection title="Monetization Strategy" actions={<CopyButton text={monetization} />}>
                        <SimpleMarkdownRenderer text={monetization} />
                    </AccordionSection>
                )}
                <div className="p-4">
                    <button 
                        onClick={() => onGenerateVideoFromScript(script)}
                        className="w-full flex items-center justify-center p-4 text-lg font-bold rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                    >
                        <VideoCameraIcon className="h-6 w-6 mr-3" />
                        Bring this Script to Life
                    </button>
                </div>
            </div>
        </div>
    );
};
