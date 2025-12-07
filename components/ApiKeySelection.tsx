import React from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { XIcon } from './icons/XIcon';

interface ApiKeySelectionProps {
  onClose: () => void;
  onSelectKey: () => void;
}

export const ApiKeySelection: React.FC<ApiKeySelectionProps> = ({ onClose, onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="glass-card w-full max-w-md text-center p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <XIcon className="h-6 w-6" />
        </button>

        <KeyIcon className="h-16 w-16 mx-auto text-indigo-400 mb-4" />

        <h2 className="text-2xl font-bold text-white mb-2">API Key Required</h2>
        <p className="text-gray-300 mb-6">
          Video generation with Veo is a premium feature. To proceed, you need to select your own Google AI Studio API key and have billing enabled on your account.
        </p>

        <div className="space-y-4">
            <button
                onClick={onSelectKey}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Select API Key
            </button>
            <a
                href="https://ai.google.dev/gemini-api/docs/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-indigo-400 hover:underline"
            >
                Learn more about billing
            </a>
        </div>
      </div>
    </div>
  );
};