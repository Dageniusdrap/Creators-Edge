import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProviderConfig {
    id: string;
    name: string;
    apiKeyName: string;
    description: string;
    isActive: boolean;
    color: string;
}

export const ApiKeySetup: React.FC = () => {
    // Current active provider for Frontend Logic (for Image/Video generation calls)
    // Note: In a real backend-only env, this might need to call an API to switch providers.
    // For now we simulate the selection impacting our frontend requests via localStorage.

    const [providers, setProviders] = useState<ProviderConfig[]>([
        { id: 'fal', name: 'Fal.ai (Flux/Hunyuan)', apiKeyName: 'FAL_KEY', description: 'Fastest generation for Images & Video. Best Quality.', isActive: true, color: 'text-blue-400' },
        { id: 'stability', name: 'Stability AI', apiKeyName: 'STABILITY_API_KEY', description: 'High reliability Image generation.', isActive: false, color: 'text-purple-400' },
        { id: 'google', name: 'Google Gemini/Imagen', apiKeyName: 'GEMINI_API_KEY', description: 'General purpose AI & Flash generation.', isActive: false, color: 'text-green-400' },
        { id: 'huggingface', name: 'Hugging Face', apiKeyName: 'HUGGINGFACE_API_KEY', description: 'Free tier fallback (Rate limited).', isActive: false, color: 'text-yellow-400' },
    ]);

    const [activeImageModel, setActiveImageModel] = useState('fal-flux');
    const [activeVideoModel, setActiveVideoModel] = useState('fal-hunyuan');

    // Load saved preferences
    useEffect(() => {
        const savedImageModel = localStorage.getItem('preferred_image_model');
        const savedVideoModel = localStorage.getItem('preferred_video_model');
        if (savedImageModel) setActiveImageModel(savedImageModel);
        if (savedVideoModel) setActiveVideoModel(savedVideoModel);
    }, []);

    const handleModelSelect = (type: 'image' | 'video', model: string) => {
        if (type === 'image') {
            setActiveImageModel(model);
            localStorage.setItem('preferred_image_model', model);
        } else {
            setActiveVideoModel(model);
            localStorage.setItem('preferred_video_model', model);
        }
    };

    return (
        <div className="glass-card p-6 w-full max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <SparklesIcon className="h-6 w-6 mr-3 text-indigo-400" />
                        AI Provider Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Configure which AI models power your studio.</p>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                    System Online
                </div>
            </div>

            {/* Default Models Configuration */}
            <div className="space-y-4">
                <h3 className="text-md font-semibold text-white">Default Generation Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <label className="block text-xs font-medium text-gray-400 mb-2">Primary Image Generator</label>
                        <select
                            value={activeImageModel}
                            onChange={(e) => handleModelSelect('image', e.target.value)}
                            className="w-full bg-black/40 border border-white/20 rounded-md p-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="fal-flux">Fal.ai (Flux Pro/Schnell)</option>
                            <option value="stability-core">Stability AI (Core)</option>
                            <option value="imagen-4.0-generate-001">Google Imagen 3/4</option>
                            <option value="gemini-2.5-flash-image">Google Flash (Fast)</option>
                        </select>
                        <p className="text-xs text-indigo-300 mt-2">Currently selected for all new image tasks.</p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <label className="block text-xs font-medium text-gray-400 mb-2">Primary Video Generator</label>
                        <select
                            value={activeVideoModel}
                            onChange={(e) => handleModelSelect('video', e.target.value)}
                            className="w-full bg-black/40 border border-white/20 rounded-md p-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="fal-hunyuan">Fal.ai (Hunyuan/LTX)</option>
                            <option value="google-veo">Google Veo (Coming Soon)</option>
                            <option value="stability-video">Stability Video (Coming Soon)</option>
                        </select>
                        <p className="text-xs text-indigo-300 mt-2">Currently selected for all new video tasks.</p>
                    </div>
                </div>
            </div>

            {/* Provider Status List */}
            <div className="space-y-4">
                <h3 className="text-md font-semibold text-white">Connected Providers</h3>
                <p className="text-xs text-gray-400 mb-4">
                    Status reflects backend configuration in Railway. Keep keys updated in Deployment settings.
                </p>

                <div className="grid grid-cols-1 gap-3">
                    {providers.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-black/40 ${provider.color}`}>
                                    <KeyIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white text-sm">{provider.name}</h4>
                                    <p className="text-xs text-gray-500">{provider.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <code className="text-[10px] bg-black/50 px-2 py-1 rounded text-gray-400 mb-1 font-mono">{provider.apiKeyName}</code>
                                <span className="flex items-center text-xs text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
                                    Configured in Backend
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="text-sm font-semibold text-blue-200">Configuration Note</h4>
                    <p className="text-xs text-blue-300 mt-1">
                        To add or update keys, please visit your <strong>Railway Dashboard &rarr; Variables</strong>.
                        The application will automatically use the active keys available.
                        Selecting a model above sets your preference, but the backend will fallback to available providers if your preferred one is missing a key.
                    </p>
                </div>
            </div>
        </div>
    );
};