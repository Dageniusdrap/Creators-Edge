import React from 'react';
import { GeneratedContentCard } from './GeneratedContentCard';
import { GeneratedContentSkeleton } from './skeletons/GeneratedContentSkeleton';
import { useAppContext } from '../context/AppContext';
import { ShareIcon } from './icons/ShareIcon';

export const SocialPostCard: React.FC = () => {
    const { 
        socialPost, 
        isGeneratingSocialPost, 
        handleGenerateVideoFromScript,
        handleListenToScript,
        isGeneratingScriptAudio,
        scriptAudio,
        handleCancel,
    } = useAppContext();

    if (isGeneratingSocialPost) {
        return <GeneratedContentSkeleton />;
    }

    if (socialPost) {
        return (
            <GeneratedContentCard
                content={socialPost.content}
                title={`Generated ${socialPost.platform} Post`}
                titleIcon={ShareIcon}
                onGenerateVideoFromScript={handleGenerateVideoFromScript}
                onListenToScript={handleListenToScript}
                isGeneratingScriptAudio={isGeneratingScriptAudio}
                scriptAudio={scriptAudio}
                onCancel={handleCancel}
            />
        );
    }
    
    // This card doesn't render anything if there's no active generation or content.
    // The generation is triggered from the GenerationActionsCard.
    return null;
};