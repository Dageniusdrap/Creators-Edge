import React, { useState } from 'react';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { GeneratedContentSkeleton } from './skeletons/GeneratedContentSkeleton';
import { useAppContext } from '../context/AppContext';

export const YouTubePostCard: React.FC = () => {
    const { 
        youTubePost, 
        isGeneratingYouTubePost, 
        addNotification,
    } = useAppContext();
    
    const [copiedTitle, setCopiedTitle] = useState(false);
    const [copiedDescription, setCopiedDescription] = useState(false);
    const [copiedTags, setCopiedTags] = useState(false);
    const [copiedHook, setCopiedHook] = useState(false);

    const handleCopy = (content: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        navigator.clipboard.writeText(content);
        setter(true);
        addNotification('Copied to clipboard!', 'success');
        setTimeout(() => setter(false), 2000);
    };

    const handleDownload = () => {
        if (!youTubePost) return;
        const content = `Title: ${youTubePost.title}\n\nDescription:\n${youTubePost.description}\n\nTags: ${youTubePost.tags.join(', ')}\n\nShort Hook: ${youTubePost.shortHook || 'N/A'}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube_post.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isGeneratingYouTubePost) {
        return <GeneratedContentSkeleton />;
    }

    if (youTubePost) {
        return (
            <div className="bg-black/10 rounded-2xl shadow-inner border border-white/10 overflow-hidden mt-4">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center">
                        <YoutubeIcon className="h-5 w-5 mr-3 text-red-500" />
                        <h4 className="text-md font-semibold text-white">Generated YouTube Post</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDownload}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                            title="Download All"
                        >
                            <DownloadIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-black/20 space-y-4">
                    <div>
                        <div className="flex justify-between items-center">
                            <h5 className="font-semibold text-sm text-gray-300">Title</h5>
                            <button
                                onClick={() => handleCopy(youTubePost.title, setCopiedTitle)}
                                className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                                title="Copy Title"
                            >
                                {copiedTitle ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-300 bg-black/20 p-2 rounded-md whitespace-pre-wrap font-sans">{youTubePost.title}</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <h5 className="font-semibold text-sm text-gray-300">Description</h5>
                            <button
                                onClick={() => handleCopy(youTubePost.description, setCopiedDescription)}
                                className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                                title="Copy Description"
                            >
                                {copiedDescription ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        <pre className="mt-1 text-sm text-gray-300 bg-black/20 p-2 rounded-md whitespace-pre-wrap font-sans">{youTubePost.description}</pre>
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <h5 className="font-semibold text-sm text-gray-300">Tags</h5>
                            <button
                                onClick={() => handleCopy(youTubePost.tags.join(', '), setCopiedTags)}
                                className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                                title="Copy Tags"
                            >
                                {copiedTags ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 bg-black/20 p-2 rounded-md">
                            {youTubePost.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    {youTubePost.shortHook && (
                        <div>
                            <div className="flex justify-between items-center">
                                <h5 className="font-semibold text-sm text-gray-300">Short-form Hook</h5>
                                <button
                                    onClick={() => handleCopy(youTubePost.shortHook!, setCopiedHook)}
                                    className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                                    title="Copy Short Hook"
                                >
                                    {copiedHook ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-300 bg-black/20 p-2 rounded-md whitespace-pre-wrap font-sans">{youTubePost.shortHook}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return null;
};