import React from 'react';
import { GeneratedContentCard } from './GeneratedContentCard';
import { GeneratedContentSkeleton } from './skeletons/GeneratedContentSkeleton';
import { useAppContext } from '../context/AppContext';
import { SparklesIcon } from './icons/SparklesIcon';

export const ProductAdCard: React.FC = () => {
    const {
        productAd,
        isGeneratingProductAd,
        handleGenerateVideoFromScript,
        handleListenToScript,
        isGeneratingScriptAudio,
        scriptAudio,
        handleCancel,
    } = useAppContext();

    if (isGeneratingProductAd) {
        return <GeneratedContentSkeleton />;
    }

    if (productAd) {
        return (
            <GeneratedContentCard
                content={productAd}
                title="Generated Ad Script (30s)"
                titleIcon={SparklesIcon}
                onGenerateVideoFromScript={handleGenerateVideoFromScript}
                onListenToScript={handleListenToScript}
                isGeneratingScriptAudio={isGeneratingScriptAudio}
                scriptAudio={scriptAudio}
                onCancel={handleCancel}
            />
        );
    }
    
    return null;
};