import React, { useState, useMemo, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ClockIcon } from './icons/ClockIcon';
import type { VoiceoverScript, PromptHistoryItem } from '../types';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ImageIcon } from './icons/ImageIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export type { PromptHistoryItem };

interface PromptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: PromptHistoryItem) => void;
}

const modelLabels: Record<string, string> = {
  'imagen-4.0-generate-001': 'Imagen 4.0',
  'gemini-2.5-flash-image': 'Nano Banana',
  'veo-3.1-fast-generate-preview': 'Veo Fast',
  'veo-3.1-generate-preview': 'Veo HD',
};

const typeDetails: Record<string, { icon: React.FC<any>, color: string, label: string }> = {
    script: { icon: MagicWandIcon, color: 'text-purple-400', label: 'Viral Script' },
    image: { icon: ImageIcon, color: 'text-blue-400', label: 'Image' },
    video: { icon: VideoCameraIcon, color: 'text-red-400', label: 'Video' },
    speech: { icon: SpeakerWaveIcon, color: 'text-green-400', label: 'Speech' },
};

const listVariants = {
    visible: { transition: { staggerChildren: 0.07 } },
    hidden: {},
};

const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
};


const HistoryTag: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <span className={`px-2 py-0.5 text-xs font-medium bg-white/10 text-gray-300 rounded-full ${className}`}>
        {children}
    </span>
);

export const PromptHistoryModal: React.FC<PromptHistoryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { promptHistory: history, handleClearPromptHistory, handleDeletePromptHistoryItem } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<PromptHistoryItem['type'] | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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

  const safeHistory = history || [];

  const filteredHistory = useMemo(() => {
    let items = [...safeHistory];

    items.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (filter !== 'all') {
        items = items.filter(item => item.type === filter);
    }
    if (!searchQuery) return items;
    const lowercasedQuery = searchQuery.toLowerCase();
    return items.filter(item =>
      item.prompt.toLowerCase().includes(lowercasedQuery) ||
      (item.link && item.link.toLowerCase().includes(lowercasedQuery))
    );
  }, [safeHistory, searchQuery, filter, sortOrder]);

  if (!isOpen) return null;
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const availableFilters = ['script', 'image', 'video', 'speech'] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">Generation History</h2>
          <div className="flex items-center space-x-4">
              {safeHistory.length > 0 && (
                  <button onClick={handleClearPromptHistory} className="flex items-center text-sm text-red-400 hover:text-red-300 font-medium">
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Clear All
                  </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <XIcon className="h-6 w-6" />
              </button>
          </div>
        </div>

        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompt history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 text-white border border-white/10 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-300'}`}
                >
                    All
                </button>
                {availableFilters.map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${filter === type ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
             <div className="relative">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                    className="text-xs font-medium appearance-none bg-white/10 text-gray-300 border-none rounded-full py-1 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
                <ChevronDownIcon className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ClockIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="font-semibold text-lg text-white">{searchQuery ? 'No Results Found' : 'No Prompt History'}</p>
              <p className="text-sm">{searchQuery ? `Your search for "${searchQuery}" did not match any prompts.` : 'Your used prompts will appear here.'}</p>
            </div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredHistory.map((item) => {
                const DetailsIcon = typeDetails[item.type].icon;
                const iconColor = typeDetails[item.type].color;
                const typeLabel = typeDetails[item.type].label;
                return (
                    <motion.div
                      key={item.timestamp}
                      variants={itemVariants}
                      className="bg-white/5 rounded-lg border border-white/10 flex flex-col overflow-hidden group"
                    >
                        <div className="p-3 flex justify-between items-center bg-white/5 border-b border-white/10">
                           <div className="flex items-center space-x-2">
                                <DetailsIcon className={`h-5 w-5 ${iconColor}`} />
                                <span className="text-sm font-semibold text-gray-200">{typeLabel}</span>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                        </div>
                        <div className="p-4 flex-grow cursor-pointer" onClick={() => onSelect(item)}>
                            <p className="text-sm text-gray-200 font-medium group-hover:text-indigo-300 transition-colors">"{item.prompt}"</p>
                        </div>
                        <div className="p-3 bg-black/20 border-t border-white/10 flex justify-between items-center">
                            <div className="flex flex-wrap gap-2 items-center">
                                {item.imageModel && <HistoryTag>{modelLabels[item.imageModel]}</HistoryTag>}
                                {item.videoModel && <HistoryTag>{modelLabels[item.videoModel]}</HistoryTag>}
                                {item.voice && <HistoryTag>{item.voice}</HistoryTag>}
                                {item.aspectRatio && <HistoryTag>{item.aspectRatio}</HistoryTag>}
                                {item.resolution && <HistoryTag>{item.resolution}</HistoryTag>}
                                {item.videoDuration && <HistoryTag>{item.videoDuration}s</HistoryTag>}
                                {item.referenceFrameCount && item.referenceFrameCount > 0 && <HistoryTag>{item.referenceFrameCount} Ref Img</HistoryTag>}
                                {item.imageStylePresets && item.imageStylePresets.length > 0 && <HistoryTag className="truncate max-w-[200px]">{item.imageStylePresets.join(', ')}</HistoryTag>}
                                {item.videoStylePresets && item.videoStylePresets.length > 0 && <HistoryTag className="truncate max-w-[200px]">{item.videoStylePresets.join(', ')}</HistoryTag>}
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeletePromptHistoryItem(item.timestamp); }} 
                                className="p-1 text-gray-400 hover:text-red-400"
                                title="Delete item"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};