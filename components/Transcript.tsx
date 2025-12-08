import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { TranscriptEntry } from '../types';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { KeyDecisionIcon } from './icons/KeyDecisionIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { SpeakerTimeline } from './SpeakerTimeline';
import { AudioPlayerRef } from './AudioPlayer';
import { XIcon } from './icons/XIcon';
import { useAppContext } from '../context/AppContext';

interface TranscriptProps {
  transcript: TranscriptEntry[];
  playerRef: React.RefObject<AudioPlayerRef>;
  currentTime: number;
  highlightedTimeLabel?: string | null;
  isSalesCall?: boolean;
  speakerARole?: 'me' | 'client';
  speakerBRole?: 'me' | 'client';
  onSpeakerARoleChange?: (role: 'me' | 'client') => void;
  onSpeakerBRoleChange?: (role: 'me' | 'client') => void;
  onRefineLine: (index: number, instruction: string) => void;
}

const formatTime = (seconds?: number) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const HandShakeIcon: React.FC<any> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);
const LightbulbIcon: React.FC<any> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a14.994 14.994 0 01-3.75 0M9.75 15.75A2.25 2.25 0 0112 13.5a2.25 2.25 0 012.25 2.25m-4.5 0V11.25A2.25 2.25 0 0112 9a2.25 2.25 0 012.25 2.25v.093m-4.5 0h4.5m-4.5 0a2.25 2.25 0 01-2.25-2.25V15m2.25-2.25a2.25 2.25 0 00-2.25-2.25V15m2.25-2.25V9.75A2.25 2.25 0 0112 7.5a2.25 2.25 0 012.25 2.25v.093" />
  </svg>
);

const TAG_CONFIG: { [key: string]: { icon: React.FC<any>, color: string, label: string } } = {
  'Action Item': { icon: ClipboardCheckIcon, color: 'blue', label: 'Action Item' },
  'Objection': { icon: ExclamationTriangleIcon, color: 'red', label: 'Objection' },
  'Viral Moment': { icon: SparklesIcon, color: 'yellow', label: 'Viral Moment' },
  'Key Decision': { icon: KeyDecisionIcon, color: 'purple', label: 'Key Decision' },
  'Positive Sentiment': { icon: ThumbsUpIcon, color: 'green', label: 'Positive' },
  'Negative Sentiment': { icon: ThumbsDownIcon, color: 'orange', label: 'Negative' },
  'Needs Discovery': { icon: LightbulbIcon, color: 'teal', label: 'Discovery' },
  'Rapport Building': { icon: HandShakeIcon, color: 'pink', label: 'Rapport' },
};

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  const config = Object.entries(TAG_CONFIG).find(([key]) => tag.toLowerCase().includes(key.toLowerCase()))?.[1];

  if (!config) {
    return <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-600 rounded-full">{tag}</span>;
  }

  const { icon: Icon, color, label } = config;
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </span>
  );
};

const parseTimeLabel = (label: string | null): [number, number] | null => {
  if (!label) return null;
  const match = label.match(/(\d+)-(\d+)s/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }
  const singleMatch = label.match(/(\d+)s/);
  if (singleMatch) {
    return [parseInt(singleMatch[1], 10), parseInt(singleMatch[1], 10) + 15]; // Assume 15s block
  }
  return null;
};

const RoleSelector: React.FC<{ role: 'me' | 'client', onChange: (newRole: 'me' | 'client') => void }> = ({ role, onChange }) => (
  <select
    value={role}
    onChange={(e) => onChange(e.target.value as 'me' | 'client')}
    onClick={(e) => e.stopPropagation()}
    className="text-xs font-bold bg-transparent border-0 rounded-md focus:ring-0 p-0 pr-6"
  >
    <option value="me">Me</option>
    <option value="client">Client</option>
  </select>
);

export const Transcript: React.FC<TranscriptProps> = ({ transcript, playerRef, currentTime, highlightedTimeLabel, isSalesCall, speakerARole, speakerBRole, onSpeakerARoleChange, onSpeakerBRoleChange, onRefineLine }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [copied, setCopied] = useState(false);
  const { addNotification } = useAppContext();

  const QUICK_ACTIONS = ['Make it shorter', 'Make it punchier', 'Simplify'];

  const hasTimestamps = transcript.length > 0 && transcript[0].startTime !== undefined;
  const highlightedRange = parseTimeLabel(highlightedTimeLabel);

  const activeIndex = useMemo(() => {
    if (currentTime === null || !hasTimestamps) return null;
    return transcript.findIndex(entry =>
      typeof entry.startTime === 'number' &&
      typeof entry.endTime === 'number' &&
      currentTime >= entry.startTime &&
      currentTime < entry.endTime
    );
  }, [currentTime, transcript, hasTimestamps]);

  useEffect(() => {
    if (activeIndex !== null && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      if (activeElement) {
        const parentRect = scrollContainerRef.current.getBoundingClientRect();
        const childRect = activeElement.getBoundingClientRect();
        if (childRect.top < parentRect.top || childRect.bottom > parentRect.bottom) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [activeIndex]);

  const getSpeakerName = (speaker: string) => {
    if (speaker.toUpperCase() === 'A') return speakerARole === 'me' ? 'Me' : 'Client';
    if (speaker.toUpperCase() === 'B') return speakerBRole === 'me' ? 'Me' : 'Client';
    return speaker.charAt(0).toUpperCase() + speaker.slice(1).toLowerCase();
  };

  const handleMagicEdit = (index: number) => {
    setEditingIndex(index);
    setRefineInstruction('');
  };

  const submitRefine = (index: number, instruction: string) => {
    if (instruction.trim()) {
      onRefineLine(index, instruction);
    }
    setEditingIndex(null);
  };

  const handleEntryClick = (startTime?: number) => {
    if (typeof startTime === 'number' && playerRef.current) {
      playerRef.current.seek(startTime);
    }
  };

  const getFullTranscriptText = () => {
    return transcript.map(entry => {
      const timestamp = hasTimestamps ? `[${formatTime(entry.startTime)}] ` : '';
      const speaker = getSpeakerName(entry.speaker);
      return `${timestamp}${speaker}: ${entry.text}`;
    }).join('\n\n');
  };

  const handleCopyTranscript = () => {
    const text = getFullTranscriptText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    addNotification('Transcript copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const text = getFullTranscriptText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-1">
      {isSalesCall && hasTimestamps && (
        <div className="mb-4 px-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Speaker Timeline</h4>
          <SpeakerTimeline transcript={transcript} speakerARole={speakerARole!} speakerBRole={speakerBRole!} />
        </div>
      )}

      <div className="flex justify-end gap-2 mb-2 px-4">
        <button
          onClick={handleCopyTranscript}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          {copied ? <CheckIcon className="h-4 w-4 mr-1.5 text-green-500" /> : <ClipboardIcon className="h-4 w-4 mr-1.5" />}
          {copied ? 'Copied' : 'Copy Full Text'}
        </button>
        <button
          onClick={handleDownloadTranscript}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <DownloadIcon className="h-4 w-4 mr-1.5" />
          Download
        </button>
      </div>

      <div ref={scrollContainerRef} className="space-y-4 max-h-[500px] overflow-y-auto pr-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
        {transcript.map((entry, index) => {
          const isSpeakerA = entry.speaker === 'A';
          const isActive = index === activeIndex;

          const isHoverHighlighted = highlightedRange &&
            typeof entry.startTime === 'number' &&
            typeof entry.endTime === 'number' &&
            Math.max(entry.startTime, highlightedRange[0]) < Math.min(entry.endTime, highlightedRange[1]);

          let backgroundClass = '';
          if (isActive) backgroundClass = 'bg-indigo-100 dark:bg-indigo-900/40';
          else if (isHoverHighlighted) backgroundClass = 'bg-yellow-100 dark:bg-yellow-900/40';

          return (
            <div
              key={index}
              data-index={index}
              className={`relative group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${backgroundClass} ${hasTimestamps ? 'cursor-pointer' : ''}`}
              onClick={() => handleEntryClick(entry.startTime)}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isSpeakerA ? (speakerARole === 'me' ? 'bg-indigo-500 text-white' : 'bg-green-500 text-white') : (speakerBRole === 'me' ? 'bg-indigo-500 text-white' : 'bg-green-500 text-white')}`}>
                {isSpeakerA ? (speakerARole === 'me' ? <UserCircleIcon className="w-5 h-5" /> : <BuildingOfficeIcon className="w-5 h-5" />) : (speakerBRole === 'me' ? <UserCircleIcon className="w-5 h-5" /> : <BuildingOfficeIcon className="w-5 h-5" />)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                    {isSalesCall && onSpeakerARoleChange && onSpeakerBRoleChange ? (
                      isSpeakerA ?
                        <RoleSelector role={speakerARole!} onChange={(newRole) => { onSpeakerARoleChange(newRole); if (newRole === 'client') onSpeakerBRoleChange('me'); }} />
                        :
                        <RoleSelector role={speakerBRole!} onChange={(newRole) => { onSpeakerBRoleChange(newRole); if (newRole === 'me') onSpeakerARoleChange('client'); }} />
                    ) : getSpeakerName(entry.speaker)}
                  </p>
                  {hasTimestamps && (
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
                      {formatTime(entry.startTime)}
                    </span>
                  )}
                </div>
                <div className="relative">
                  {entry.text === '...' ? (
                    <div className="flex items-center mt-1">
                      <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-indigo-400"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.text}</p>
                  )}
                  {editingIndex === index && (
                    <div className="absolute z-10 top-full left-0 mt-2 w-full bg-gray-700 p-2 rounded-lg shadow-lg">
                      <textarea
                        value={refineInstruction}
                        onChange={(e) => setRefineInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submitRefine(index, refineInstruction))}
                        placeholder="e.g., Make it shorter and punchier"
                        className="w-full text-sm p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:ring-indigo-500"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {QUICK_ACTIONS.map(action => (
                          <button
                            key={action}
                            onClick={() => submitRefine(index, action)}
                            className="px-2 py-1 text-xs text-indigo-200 bg-indigo-500/30 rounded-full hover:bg-indigo-500/50"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditingIndex(null)} className="px-2 py-1 text-xs text-gray-300 rounded-md">Cancel</button>
                        <button onClick={() => submitRefine(index, refineInstruction)} className="px-2 py-1 text-xs text-white bg-indigo-600 rounded-md">Refine</button>
                      </div>
                    </div>
                  )}
                </div>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleMagicEdit(index); }}
                className="absolute top-2 right-2 p-1 rounded-full text-gray-400 bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Magic Edit"
              >
                <SparklesIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div >
  );
};
