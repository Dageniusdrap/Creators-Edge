import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { AnalysisType } from '../types';
import { toolConfig } from '../utils/toolConfig';

interface SidebarNavProps {
    onClose?: () => void;
    className?: string;
}

const SidebarButton: React.FC<{
    onClick: () => void;
    isSelected: boolean;
    icon: React.FC<any>;
    label: string;
}> = ({ onClick, isSelected, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`relative w-full flex items-center p-3 my-1 rounded-r-lg text-left transition-colors duration-300 group focus:outline-none`}
        aria-pressed={isSelected}
    >
        {/* Active Background Animation */}
        {isSelected && (
            <motion.div
                layoutId="activeSidebarTab"
                className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-transparent border-l-2 border-cyan-500"
                initial={false}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            />
        )}

        {/* Content */}
        <div className="relative flex items-center z-10">
            <Icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors duration-300 ${isSelected ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${isSelected ? 'text-cyan-100' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {label}
            </span>
        </div>
    </button>
);

export const SidebarNav: React.FC<SidebarNavProps> = ({ onClose, className = '' }) => {
    const { analysisType: selectedType, handleTypeChange } = useAppContext();

    const homeTool = Object.entries(toolConfig).find(([, config]) => config.category === 'home');
    const mainTools = Object.entries(toolConfig).filter(([, config]) => config.category === 'main');
    const otherTools = Object.entries(toolConfig).filter(([, config]) => config.category === 'other');
    const settingsTools = Object.entries(toolConfig).filter(([, config]) => config.category === 'settings');

    const handleNavClick = (type: AnalysisType) => {
        handleTypeChange(type);
        if (onClose) onClose();
    };

    return (
        <nav id="analysis-type-selector" className={`w-64 flex flex-col p-4 h-full bg-black/20 backdrop-blur-md border-r border-white/5 ${className}`}>
            <div className={`px-2 flex justify-between items-center ${onClose ? 'mb-8' : 'mb-4'}`}>
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10 ml-auto">
                        <XIcon className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="flex-grow space-y-1 overflow-y-auto custom-scrollbar pr-2">
                {/* Shared Layout Group for floating tab animation */}
                <LayoutGroup>
                    {homeTool && (
                        <SidebarButton
                            key={homeTool[0]}
                            onClick={() => handleNavClick(homeTool[0] as AnalysisType)}
                            isSelected={selectedType === homeTool[0]}
                            icon={homeTool[1].icon}
                            label={homeTool[1].label}
                        />
                    )}
                    <div className="my-4 border-t border-white/5 mx-2"></div>

                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Create & Analyze</h3>
                    {mainTools.map(([id, config]) => (
                        <SidebarButton
                            key={id}
                            onClick={() => handleNavClick(id as AnalysisType)}
                            isSelected={selectedType === id}
                            icon={config.icon}
                            label={config.label}
                        />
                    ))}

                    <div className="flex-shrink-0 pt-4">
                        <div className="my-4 border-t border-white/5 mx-2"></div>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</h3>
                        {otherTools.map(([id, config]) => (
                            <SidebarButton
                                key={id}
                                onClick={() => handleNavClick(id as AnalysisType)}
                                isSelected={selectedType === id}
                                icon={config.icon}
                                label={config.label}
                            />
                        ))}
                        <div className="my-2"></div>
                        {settingsTools.map(([id, config]) => (
                            <SidebarButton
                                key={id}
                                onClick={() => handleNavClick(id as AnalysisType)}
                                isSelected={selectedType === id}
                                icon={config.icon}
                                label={config.label}
                            />
                        ))}
                    </div>
                </LayoutGroup>
            </div>
        </nav>
    );
};