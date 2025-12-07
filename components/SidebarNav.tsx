import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
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
    <motion.button
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${
        isSelected
            ? 'bg-indigo-600 text-white shadow'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
        aria-pressed={isSelected}
    >
        <Icon className="h-6 w-6 mr-3 flex-shrink-0" />
        <span className="font-semibold">{label}</span>
    </motion.button>
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
        <nav id="analysis-type-selector" className={`w-64 bg-black/20 text-white flex flex-col p-4 border-r border-white/10 backdrop-blur-lg h-full ${className}`}>
            <div className="mb-8 pl-2 flex justify-between items-center">
                <LogoIcon className="h-12 w-auto" />
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10">
                        <XIcon className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="flex-grow space-y-1 overflow-y-auto custom-scrollbar">
                 {homeTool && (
                    <SidebarButton 
                        key={homeTool[0]}
                        onClick={() => handleNavClick(homeTool[0] as AnalysisType)}
                        isSelected={selectedType === homeTool[0]}
                        icon={homeTool[1].icon}
                        label={homeTool[1].label}
                    />
                 )}
                 <div className="my-2 border-t border-white/10"></div>
                 {mainTools.map(([id, config]) => (
                    <SidebarButton 
                        key={id}
                        onClick={() => handleNavClick(id as AnalysisType)}
                        isSelected={selectedType === id}
                        icon={config.icon}
                        label={config.label}
                    />
                ))}
            </div>

            <div className="flex-shrink-0 pt-4">
                 {otherTools.map(([id, config]) => (
                    <SidebarButton 
                        key={id}
                        onClick={() => handleNavClick(id as AnalysisType)}
                        isSelected={selectedType === id}
                        icon={config.icon}
                        label={config.label}
                    />
                ))}
                <div className="my-4 border-t border-white/20"></div>
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
        </nav>
    );
};