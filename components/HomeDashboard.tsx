import React from 'react';
import { useAppContext } from '../context/AppContext';
import { toolConfig } from '../utils/toolConfig';
import { motion } from 'framer-motion';
import { FolderIcon } from './icons/FolderIcon';

export const HomeDashboard: React.FC = () => {
    const {
        currentUser,
        projects,
        activeProjectId,
        handleLoadAsset,
        handleTypeChange,
    } = useAppContext();

    // Defensive coding: Ensure projects is an array
    const safeProjects = Array.isArray(projects) ? projects : [];
    
    const activeProject = safeProjects.find(p => p.id === activeProjectId);
    
    // Safety check: Ensure assets array exists and is an array before flatMapping.
    // Older local storage data might not have the 'assets' property on projects.
    const allAssets = safeProjects.flatMap(p => Array.isArray(p.assets) ? p.assets : []);
    const activeAssets = activeProject && Array.isArray(activeProject.assets) ? activeProject.assets : [];
    
    // Determine which assets to show: active project's or all if no active project
    // Then sort and slice safely
    const recentAssets = (activeProject ? activeAssets : allAssets)
        .sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        })
        .slice(0, 4);

    const quickStartTools = ['contentGeneration', 'videoAnalysis', 'repurposeContent', 'thumbnailAnalysis'];

    const getGreeting = () => {
        const hour = new Date().getHours();
        const userName = currentUser?.name || 'Creator';
        if (hour < 12) return `Good morning, ${userName}`;
        if (hour < 18) return `Good afternoon, ${userName}`;
        return `Good evening, ${userName}`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-4xl font-bold text-white">{getGreeting()}</h1>
                <p className="text-lg text-gray-300 mt-2">Ready to create something amazing today?</p>
            </motion.div>

            {activeProject && (
                <motion.div variants={itemVariants} className="glass-card p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <FolderIcon className="h-6 w-6 mr-3 text-indigo-400" />
                        Active Project: {activeProject.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {activeAssets.length > 0
                            ? `This project contains ${activeAssets.length} asset(s). Your new creations will be saved here.`
                            : `This project is empty. Start creating to add your first asset!`}
                    </p>
                </motion.div>
            )}

            <motion.div variants={containerVariants}>
                <h2 className="text-2xl font-semibold text-white mb-4">Quick Start</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickStartTools.map(toolId => {
                        const tool = toolConfig[toolId as keyof typeof toolConfig];
                        if (!tool) return null;
                        const Icon = tool.icon;
                        return (
                            <motion.button
                                key={toolId}
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.2)' }}
                                className="glass-card p-6 text-left"
                                onClick={() => handleTypeChange(toolId as any)}
                            >
                                <Icon className="h-8 w-8 text-indigo-400 mb-3" />
                                <h3 className="font-bold text-white">{tool.label}</h3>
                                <p className="text-xs text-gray-300 mt-1">{tool.description}</p>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
            
            {recentAssets.length > 0 && (
                 <motion.div variants={containerVariants}>
                    <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                         {recentAssets.map(asset => {
                             const tool = toolConfig[asset.type as keyof typeof toolConfig];
                             const Icon = tool ? tool.icon : FolderIcon;
                             return (
                                <motion.button
                                    key={asset.id}
                                    variants={itemVariants}
                                    onClick={() => handleLoadAsset(asset)}
                                    className="w-full glass-card p-4 text-left flex items-center gap-4 hover:bg-indigo-500/20"
                                >
                                    <Icon className="h-8 w-8 text-indigo-400 flex-shrink-0" />
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-semibold text-white truncate">{asset.name}</p>
                                        <p className="text-xs text-gray-400 capitalize">{asset.type.replace(/([A-Z])/g, ' $1')}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                        {asset.timestamp ? new Date(asset.timestamp).toLocaleDateString() : ''}
                                    </span>
                                </motion.button>
                            );
                         })}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};