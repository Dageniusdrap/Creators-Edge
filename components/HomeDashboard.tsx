import React from 'react';
import { useAppContext } from '../context/AppContext';
import { toolConfig } from '../utils/toolConfig';
import { motion } from 'framer-motion';
import { FolderIcon } from './icons/FolderIcon';
import { HoloCard } from './ui/HoloCard';
import { StatCard } from './ui/StatCard';
import { CubeIcon, SparklesIcon, ChipIcon, BoltIcon, RocketIcon } from './ui/FuturisticIcons';
import { exportProjectData } from '../utils/export';

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

    // Safety check: Ensure assets array exists and is an array
    const allAssets = safeProjects.flatMap(p => Array.isArray(p.assets) ? p.assets : []);
    const activeAssets = activeProject && Array.isArray(activeProject.assets) ? activeProject.assets : [];

    // Recent assets logic
    const recentAssets = (activeProject ? activeAssets : allAssets)
        .sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        })
        .slice(0, 4);

    // Derived Metrics for Stats
    // "Analysis Power" - Estimate tokens/words processed based on asset count
    // (Simplifying to avoid Type errors since 'content' prop varies by asset type)
    const totalWordsAnalyzed = allAssets.length * 500;
    const analysisPowerScore = Math.min(100, Math.floor((totalWordsAnalyzed / 50000) * 100)); // Normalized 0-100 score

    // "Credits Saving" - Estimate money saved vs hiring a human ($50/hour rate equivalent)
    // Assume each AI generation saves ~0.5 hours of human work
    const hoursSaved = allAssets.length * 0.5;
    const moneySaved = Math.floor(hoursSaved * 50);

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
            {/* Welcome Banner */}
            <HoloCard delay={0.1}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                        >
                            {getGreeting()}
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-gray-400"
                        >
                            Your neural creation suite is ready. What will you build today?
                        </motion.p>
                    </div>
                </div>
            </HoloCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Projects Active"
                    value={safeProjects.length.toString()}
                    icon={CubeIcon}
                    color="from-cyan-500 to-blue-600"
                />
                <StatCard
                    label="Assets Generated"
                    value={allAssets.length.toString()}
                    icon={SparklesIcon}
                    color="from-purple-500 to-pink-600"
                />
                <StatCard
                    label="Analysis Power"
                    value={analysisPowerScore.toString()}
                    icon={BoltIcon}
                    color="from-orange-500 to-red-600"
                />
                <StatCard
                    label="Value Created"
                    value={`$${moneySaved}`}
                    icon={ChipIcon}
                    color="from-green-500 to-emerald-600"
                />
            </div>

            {/* Quick Actions */}
            <HoloCard delay={0.3}>
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Quick Actions</h3>

                {/* Tailwind Safelist for dynamic classes:
                    border-cyan-500/30 hover:border-cyan-500/60 from-cyan-500/10 text-cyan-400
                    border-purple-500/30 hover:border-purple-500/60 from-purple-500/10 text-purple-400
                    border-pink-500/30 hover:border-pink-500/60 from-pink-500/10 text-pink-400
                    border-blue-500/30 hover:border-blue-500/60 from-blue-500/10 text-blue-400
                    border-emerald-500/30 hover:border-emerald-500/60 from-emerald-500/10 text-emerald-400
                    border-orange-500/30 hover:border-orange-500/60 from-orange-500/10 text-orange-400
                */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { id: 'videoAnalysis', title: 'Video Analysis', desc: 'Neural-powered insights', icon: ChipIcon, color: 'cyan' },
                        { id: 'contentGeneration', title: 'Content Generation', desc: 'AI creative studio', icon: SparklesIcon, color: 'purple' },
                        { id: 'brandVoice', title: 'Brand Voice', desc: 'Voice synthesis matrix', icon: BoltIcon, color: 'pink' },
                        { id: 'socialMedia', title: 'Social Intelligence', desc: 'Trend analysis & hooks', icon: CubeIcon, color: 'blue' },
                        { id: 'salesCall', title: 'Sales Optimizer', desc: 'Call scoring & insights', icon: ChipIcon, color: 'emerald' },
                        { id: 'productAd', title: 'Ad Generator', desc: 'High-conversion visuals', icon: RocketIcon, color: 'orange' }
                    ].map((action, idx) => (
                        <motion.div
                            key={action.title}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTypeChange(action.id as any)}
                            className={`relative group cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-${action.color}-500/30 rounded-xl p-6 hover:border-${action.color}-500/60 transition-all duration-300 shadow-lg`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`} />
                            <action.icon className={`h-12 w-12 text-${action.color}-400 mb-4`} />
                            <h4 className="text-lg font-bold mb-2 text-white">{action.title}</h4>
                            <p className="text-sm text-gray-400">{action.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </HoloCard>

            {/* Recent Activity */}
            {recentAssets.length > 0 && (
                <motion.div variants={containerVariants}>
                    <HoloCard delay={0.5}>
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
                            Recent Neural Activity
                        </h2>
                        <div className="space-y-4">
                            {recentAssets.map((asset, idx) => {
                                // Make animations staggered
                                const itemDelay = idx * 0.1;

                                return (
                                    <motion.button
                                        key={asset.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: itemDelay }}
                                        onClick={() => handleLoadAsset(asset)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            {/* Pulsing Dot Indicator */}
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse flex-shrink-0" />

                                            <div className="text-left overflow-hidden">
                                                <p className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">{asset.name}</p>
                                                <p className="text-sm text-gray-400 capitalize">{asset.type.replace(/([A-Z])/g, ' $1')}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-4 group-hover:text-cyan-400 transition-colors font-mono">
                                            {asset.timestamp ? new Date(asset.timestamp).toLocaleDateString() : ''}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </HoloCard>
                </motion.div>
            )}

            {/* Launch Pad Section */}
            <HoloCard delay={0.7}>
                <div className="text-center py-10 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

                    <RocketIcon className="h-16 w-16 mx-auto mb-4 text-green-400" />
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Launch Pad
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Ready to deploy your creations? Export data, publish reports, or schedule your content for the world to see.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => activeProject && exportProjectData(activeProject)}
                            disabled={!activeProject}
                            className={`px-6 py-2 rounded-lg border transition-colors ${activeProject ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white hover:border-gray-500' : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'}`}
                        >
                            Export Data
                        </button>
                        <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105">
                            <span className="flex items-center gap-2">
                                <RocketIcon className="h-4 w-4" />
                                Launch Project
                            </span>
                        </button>
                    </div>
                </div>
            </HoloCard>
        </motion.div>
    );
};