
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SpeakerPhoneIcon } from './icons/SpeakerPhoneIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ShareIcon } from './icons/ShareIcon';
import { useAppContext } from '../context/AppContext';

const PROFESSIONAL_VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
const VOICE_STYLES = ['Default', 'Cheerful', 'Animated', 'Energetic', 'Calm', 'Authoritative', 'Serious', 'Whispering', 'Storyteller', 'News Anchor'];

interface GeneratedContentCardProps {
  content: string;
  title?: string;
  titleIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onGenerateVideoFromScript: (script: string) => void;
  onListenToScript: (script: string, voice: string, style: string) => Promise<void>;
  isGeneratingScriptAudio: boolean;
  scriptAudio: { url: string; blob: Blob } | null;
  onCancel: () => void;
  videoGenerationScript?: string;
  isLoading?: boolean;
}

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

export const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({ 
  content, 
  title = "AI-Generated Content",
  titleIcon: TitleIcon = SparklesIcon,
  onGenerateVideoFromScript,
  onListenToScript,
  isGeneratingScriptAudio,
  scriptAudio,
  onCancel,
  videoGenerationScript,
  isLoading = false,
}) => {
  const { addNotification } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [deliveryVoice, setDeliveryVoice] = useState(PROFESSIONAL_VOICES[0]);
  const [voiceStyle, setVoiceStyle] = useState(VOICE_STYLES[0]);

  useEffect(() => {
    if (scriptAudio?.url && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
    }
  }, [scriptAudio]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    addNotification('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleListenClick = async () => {
    await onListenToScript(content, deliveryVoice, voiceStyle);
  };

  return (
    <div className="bg-black/10 rounded-2xl shadow-inner border border-white/10 overflow-hidden mt-4">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center">
          <TitleIcon className="h-5 w-5 mr-3 text-indigo-400" />
          <h4 className="text-md font-semibold text-white">{title}</h4>
        </div>
        <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
              title="Copy"
              disabled={isLoading}
            >
              {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
              title="Download"
              disabled={isLoading}
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
        </div>
      </div>
      <div className="p-4 bg-black/20 max-h-80 overflow-y-auto">
          {isLoading ? (
              <div className="flex items-center space-x-2 text-gray-400">
                  <span className="text-sm font-sans">{content}</span>
                  <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse" />
              </div>
          ) : (
             <SimpleMarkdownRenderer text={content} />
          )}
      </div>
      <div className="p-4 bg-black/30 border-t border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Audio Generation</label>
                 {isGeneratingScriptAudio ? (
                    <button onClick={onCancel} className="flex items-center px-3 py-1 text-xs font-medium text-red-400 bg-red-900/50 rounded-md hover:bg-red-900">
                        <XCircleIcon className="h-4 w-4 mr-1" /> Cancel
                    </button>
                ) : (
                    <button onClick={handleListenClick} disabled={isLoading || !content} className="flex items-center px-3 py-1 text-xs font-medium text-indigo-400 bg-indigo-900/50 rounded-md hover:bg-indigo-900 disabled:opacity-50" aria-label="Listen to script">
                        <SpeakerPhoneIcon className="h-4 w-4 mr-1" /> Listen
                    </button>
                )}
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="script-voice-select" className="sr-only">Select Voice</label>
                  <select 
                      id="script-voice-select"
                      value={deliveryVoice}
                      onChange={(e) => setDeliveryVoice(e.target.value)}
                      className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                      {PROFESSIONAL_VOICES.map(voice => <option key={voice} value={voice}>{voice}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="script-style-select" className="sr-only">Select Voice Style</label>
                  <select 
                      id="script-style-select"
                      value={voiceStyle}
                      onChange={(e) => setVoiceStyle(e.target.value)}
                      className="w-full p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                      {VOICE_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                  </select>
                </div>
             </div>
          </div>
          <div className="flex flex-col justify-end">
              <button
                  onClick={() => onGenerateVideoFromScript(videoGenerationScript || content)}
                  disabled={isLoading || !content}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Generate Video
              </button>
          </div>
        </div>
        {scriptAudio?.url && (
            <div className="pt-2 flex items-center gap-2">
                <audio ref={audioRef} src={scriptAudio.url} controls className="w-full" />
                <a href={scriptAudio.url} download={`${title.toLowerCase().replace(/\s+/g, '_')}_audio.mp3`} className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:bg-white/20" aria-label="Download audio">
                    <DownloadIcon className="h-5 w-5" />
                </a>
            </div>
        )}
      </div>
    </div>
  );
};
