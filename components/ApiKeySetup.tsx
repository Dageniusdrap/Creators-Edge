import React from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

export const ApiKeySetup: React.FC = () => {
    // We now assume keys are managed via Backend/Railway Environment Variables
    // This view is purely informational now.

    return (
        <div className="glass-card p-6 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center">
                <KeyIcon className="h-6 w-6 mr-3" />
                API Key Configuration
            </h2>
            <p className="text-sm text-gray-300 mb-6">
                This application uses secure backend keys for AI features. Keys are managed in your deployment environment (e.g., Railway).
            </p>

            <div className="bg-black/20 p-6 rounded-lg text-left space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Required Environment Variables</h3>

                <div className="space-y-3">
                    <div className="flex items-start">
                        <div className="p-1 bg-green-500/20 rounded mr-3 mt-1">
                            <CheckIcon className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Google Gemini</p>
                            <p className="text-xs text-gray-400">Required for Analysis, Text Generation, and Imagen Fallback.</p>
                            <code className="text-xs bg-black/40 px-1 py-0.5 rounded text-indigo-300">GEMINI_API_KEY</code>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="p-1 bg-blue-500/20 rounded mr-3 mt-1">
                            <CheckIcon className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Fal.ai (Recommended)</p>
                            <p className="text-xs text-gray-400">Required for Ultra-Fast Image & Video Generation (Linear/Video).</p>
                            <code className="text-xs bg-black/40 px-1 py-0.5 rounded text-indigo-300">FAL_KEY</code>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="p-1 bg-purple-500/20 rounded mr-3 mt-1">
                            <CheckIcon className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Stability AI</p>
                            <p className="text-xs text-gray-400">Alternative for high-quality Image Generation.</p>
                            <code className="text-xs bg-black/40 px-1 py-0.5 rounded text-indigo-300">STABILITY_API_KEY</code>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center text-yellow-500 mb-2">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span className="font-semibold text-sm">How to Configure</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        To enable these features, go to your <strong>Railway Project Dashboard</strong> → <strong>Variables</strong> and add the keys listed above. The application will automatically detect them after a redeploy.
                    </p>
                </div>
            </div>
        </div>
    );
};