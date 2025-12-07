import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { XIcon } from './icons/XIcon';
import { FolderIcon } from './icons/FolderIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ImageIcon } from './icons/ImageIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { toolConfig } from '../utils/toolConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { AppAnalysisType } from '../types';

export const ProjectsModal: React.FC = () => {
    const {
        isProjectsModalOpen,
        handleProjectsModalToggle,
        projects,
        activeProjectId,
        handleCreateProject,
        handleSelectProject,
        handleLoadAsset,
        handleDeleteProject,
        handleDeleteAsset
    } = useAppContext();

    const [newProjectName, setNewProjectName] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(activeProjectId);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleProjectsModalToggle();
            }
        };
        if (isProjectsModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isProjectsModalOpen, handleProjectsModalToggle]);

    // Defensive: Ensure projects is array
    const safeProjects = Array.isArray(projects) ? projects : [];

    const selectedProject = useMemo(() => {
        return safeProjects.find(p => p.id === selectedProjectId);
    }, [safeProjects, selectedProjectId]);
    
    const handleCreate = () => {
        if(newProjectName.trim()) {
            handleCreateProject(newProjectName.trim());
            setNewProjectName('');
        }
    };
    
    const getAssetIcon = (type: string) => {
        // Specific icons for generation types
        if (type === 'script') return MagicWandIcon;
        if (type === 'image') return ImageIcon;
        if (type === 'video') return VideoCameraIcon;
        if (type === 'speech') return SpeakerWaveIcon;

        // Direct lookup from toolConfig using the type as key
        // This is safer than matching labels (e.g. 'salesCall' key vs 'Sales Call' label)
        const config = toolConfig[type as keyof typeof toolConfig];
        return config ? config.icon : FolderIcon;
    };

    if (!isProjectsModalOpen) return null;
    
    const formatDate = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString();
        } catch (e) {
            return 'Unknown Date';
        }
    };

    // Safe access to assets, ensuring it is an array
    const projectAssets = selectedProject && Array.isArray(selectedProject.assets) ? selectedProject.assets : [];

    // Animation variants
    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };
    
    const itemVariants = {
        hidden: { x: -10, opacity: 0 },
        show: { x: 0, opacity: 1 }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={handleProjectsModalToggle}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                        <FolderIcon className="h-6 w-6 mr-3" />
                        Project Hub
                    </h2>
                    <button onClick={handleProjectsModalToggle} className="text-gray-400 hover:text-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Left Pane: Projects List */}
                    <div className="w-1/3 border-r border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/10 bg-black/20">
                            <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Create Project</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                    placeholder="Project Name..."
                                    className="flex-grow p-2 text-sm bg-white/5 text-white border border-white/20 rounded-md focus:ring-1 focus:ring-indigo-500"
                                />
                                <button onClick={handleCreate} className="p-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                                    <PlusCircleIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <motion.div 
                            className="flex-grow overflow-y-auto p-2"
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {safeProjects.map((project) => (
                                <div key={project.id} className="group relative">
                                    <motion.button
                                        variants={itemVariants}
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className={`w-full text-left p-3 rounded-md mb-1 pr-8 ${selectedProjectId === project.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                    >
                                        <p className="font-semibold text-sm truncate">{project.name}</p>
                                        <p className="text-xs text-gray-400">{(Array.isArray(project.assets) ? project.assets : []).length} assets</p>
                                    </motion.button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Project"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Pane: Assets */}
                    <div className="w-2/3 flex flex-col">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedProjectId || 'empty'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex-grow flex flex-col"
                            >
                                {selectedProject ? (
                                    <>
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                                            <div>
                                                <h3 className="font-bold text-white truncate">{selectedProject.name}</h3>
                                                <p className="text-xs text-gray-400">Created on {formatDate(selectedProject.createdAt)}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleSelectProject(selectedProject.id)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeProjectId === selectedProject.id ? 'bg-green-500 text-white' : 'bg-white/20 text-gray-200 hover:bg-white/30'}`}
                                            >
                                                {activeProjectId === selectedProject.id ? 'Active' : 'Set Active'}
                                            </button>
                                        </div>
                                        <motion.div 
                                            className="flex-grow overflow-y-auto p-4"
                                            variants={listVariants}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            {projectAssets.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {projectAssets.map((asset) => {
                                                        const Icon = getAssetIcon(asset.type);
                                                        return (
                                                            <div key={asset.id} className="relative group">
                                                                <motion.button
                                                                    variants={itemVariants}
                                                                    onClick={() => handleLoadAsset(asset)}
                                                                    className="p-4 bg-black/20 rounded-lg text-left hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500 transition-colors w-full h-full"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <Icon className="h-6 w-6 text-indigo-400 flex-shrink-0" />
                                                                        <div className="overflow-hidden">
                                                                            <p className="font-semibold text-sm truncate">{asset.name}</p>
                                                                            <p className="text-xs text-gray-400 capitalize truncate">{asset.type.replace(/([A-Z])/g, ' $1')}</p>
                                                                        </div>
                                                                    </div>
                                                                </motion.button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteAsset(selectedProject.id, asset.id); }}
                                                                    className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-red-500/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                                                    title="Delete Asset"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center h-full flex flex-col justify-center items-center text-gray-400">
                                                    <p>This project is empty.</p>
                                                    <p className="text-xs">Save an analysis or generation to add it here.</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    </>
                                ) : (
                                    <div className="text-center h-full flex flex-col justify-center items-center text-gray-400">
                                        <p className="font-semibold">Select a project to view its assets</p>
                                        <p className="text-sm">or create a new one to get started.</p>
                                    </div>
                                )}
                            </motion.div>
                         </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
