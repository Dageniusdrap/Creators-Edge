import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

export const ApiKeySetup: React.FC = () => {
    const [hasKey, setHasKey] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    const checkApiKey = async () => {
        setIsChecking(true);
        if ((window as any).aistudio) {
            const keyStatus = await (window as any).aistudio.hasSelectedApiKey();
            setHasKey(keyStatus);
        } else {
            setHasKey(false); // Fallback if aistudio is not available
        }
        setIsChecking(false);
    };

    useEffect(() => {
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        if ((window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
            // Re-check the status after the dialog is closed
            checkApiKey();
        }
    };

    return (
        <div className="glass-card p-6 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center">
                <KeyIcon className="h-6 w-6 mr-3" />
                API Key Management
            </h2>
            <p className="text-sm text-gray-300 mb-6">
                Manage your Google AI Studio API key for premium features like Veo video generation. Your key is stored securely and is not visible to this application.
            </p>

            <div className="bg-black/20 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Current Status</h3>
                
                {isChecking ? (
                    <div className="h-8 w-8 mx-auto border-2 border-dashed rounded-full animate-spin border-indigo-400"></div>
                ) : hasKey ? (
                    <div className="flex items-center justify-center text-green-400">
                        <CheckIcon className="h-6 w-6 mr-2" />
                        <span className="font-semibold">API Key is configured</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-yellow-400">
                        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                        <span className="font-semibold">No API Key selected</span>
                    </div>
                )}
                
                <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto">
                    Premium features require your own API key with billing enabled.
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">
                        Learn more
                    </a>
                </p>

                <button
                    onClick={handleSelectKey}
                    className="mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    {hasKey ? 'Change API Key' : 'Select API Key'}
                </button>
            </div>
        </div>
    );
};