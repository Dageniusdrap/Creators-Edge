import React, { useState } from 'react';
import type { MonetizationAssets } from '../types';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { useAppContext } from '../context/AppContext';

const CopyableBlock: React.FC<{ title: string, content: string }> = ({ title, content }) => {
    const { addNotification } = useAppContext();
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        addNotification('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h5 className="font-semibold text-sm text-gray-300">{title}</h5>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md text-gray-400 hover:bg-white/20"
                    title="Copy"
                >
                    {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <ClipboardIcon className="h-4 w-4" />}
                </button>
            </div>
            <pre className="mt-1 text-xs text-gray-400 whitespace-pre-wrap font-sans bg-black/20 p-2 rounded-md">{content}</pre>
        </div>
    );
};

export const MonetizationAssetsCard: React.FC<{ assets: MonetizationAssets }> = ({ assets }) => {
    return (
        <div className="bg-black/10 rounded-2xl shadow-inner border border-white/10 overflow-hidden mt-4">
            <div className="p-4 border-b border-white/10 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-3 text-green-400" />
                <h4 className="text-md font-semibold text-white">Monetization Assist</h4>
            </div>
            <div className="p-4 bg-black/20 space-y-4">
                <CopyableBlock title="Sponsor Pitch Email" content={assets.sponsorPitch} />
                <CopyableBlock title="Affiliate Link Copy" content={assets.affiliateCopy} />
                <div>
                    <h5 className="font-semibold text-sm text-gray-300">Merchandise Ideas</h5>
                    <ul className="mt-1 list-disc list-inside text-xs text-gray-400 space-y-1">
                        {assets.merchandiseIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};