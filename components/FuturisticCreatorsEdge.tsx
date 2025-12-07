import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Futuristic Icon Components
const SparklesIcon = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const CubeIcon = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const BoltIcon = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ChipIcon = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const RocketIcon = ({ className = "h-6 w-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

// Animated Grid Background
const AnimatedGrid = () => (
    <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{
            backgroundImage: `
        linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
      `,
            backgroundSize: '60px 60px',
            animation: 'gridPulse 4s ease-in-out infinite'
        }} />
    </div>
);

// Holographic Card Component
const HoloCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className={`relative group ${className}`}
    >
        {/* Holographic border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-60 blur-sm transition-all duration-500 animate-pulse" />

        {/* Card content */}
        <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />

            {children}
        </div>
    </motion.div>
);

// Neon Button Component
const NeonButton = ({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary" | "success", className?: string }) => {
    const colors = {
        primary: "from-cyan-500 to-blue-600 shadow-cyan-500/50",
        secondary: "from-purple-500 to-pink-600 shadow-purple-500/50",
        success: "from-green-500 to-emerald-600 shadow-green-500/50"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px currentColor" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden group ${className}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${colors[variant]} opacity-90 group-hover:opacity-100 transition-opacity`} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <span className="relative flex items-center gap-2">{children}</span>
        </motion.button>
    );
};

// Stats Display with animated numbers
const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const target = parseInt(value);
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setDisplayValue(target);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</span>
                    <Icon className={`h-5 w-5 ${color.split(' ')[1].replace('to-', 'text-')}`} />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {displayValue.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

// Main App Component
const FuturisticCreatorsEdge = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Command Center', icon: CubeIcon },
        { id: 'create', label: 'AI Studio', icon: SparklesIcon },
        { id: 'analyze', label: 'Neural Insights', icon: ChipIcon },
        { id: 'launch', label: 'Launch Pad', icon: RocketIcon }
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
                <AnimatedGrid />

                {/* Floating orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Main content */}
            <div className="relative z-10">
                {/* Top Navigation Bar */}
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-2xl" />
                    <div className="relative border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex items-center justify-between">
                                {/* Logo */}
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-md opacity-75" />
                                        <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                                            <BoltIcon className="h-6 w-6 text-white" />
                                        </div>
                                    </motion.div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            CREATORS EDGE
                                        </h1>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest">Neural Creation Suite</p>
                                    </div>
                                </div>

                                {/* User section */}
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-cyan-500/30 rounded-lg">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-sm text-gray-300">SYSTEM ONLINE</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold">
                                        CU
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        {tabs.map((tab, idx) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50'
                                        : 'bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative flex items-center gap-2">
                                    <tab.icon className="h-5 w-5" />
                                    {tab.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'dashboard' && (
                                <div className="space-y-8">
                                    {/* Welcome Banner */}
                                    <HoloCard delay={0.1}>
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <motion.h2
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                                >
                                                    Welcome Back, Creator
                                                </motion.h2>
                                                <motion.p
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="text-gray-400"
                                                >
                                                    Your neural creation suite is ready. What will you build today?
                                                </motion.p>
                                            </div>
                                            <NeonButton variant="primary">
                                                <RocketIcon className="h-5 w-5" />
                                                Launch New Project
                                            </NeonButton>
                                        </div>
                                    </HoloCard>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <StatCard
                                            label="Projects Created"
                                            value="247"
                                            icon={CubeIcon}
                                            color="from-cyan-500 to-blue-600"
                                        />
                                        <StatCard
                                            label="AI Generations"
                                            value="1523"
                                            icon={SparklesIcon}
                                            color="from-purple-500 to-pink-600"
                                        />
                                        <StatCard
                                            label="Content Analyzed"
                                            value="892"
                                            icon={ChipIcon}
                                            color="from-green-500 to-emerald-600"
                                        />
                                        <StatCard
                                            label="Success Score"
                                            value="94"
                                            icon={BoltIcon}
                                            color="from-orange-500 to-red-600"
                                        />
                                    </div>

                                    {/* Quick Actions */}
                                    <HoloCard delay={0.4}>
                                        <h3 className="text-2xl font-bold mb-6 text-cyan-400">Quick Actions</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { title: 'Video Analysis', desc: 'Neural-powered insights', icon: ChipIcon, color: 'cyan' },
                                                { title: 'Content Generation', desc: 'AI creative studio', icon: SparklesIcon, color: 'purple' },
                                                { title: 'Brand Voice', desc: 'Voice synthesis matrix', icon: BoltIcon, color: 'pink' }
                                            ].map((action, idx) => (
                                                <motion.div
                                                    key={action.title}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    className={`relative group cursor-pointer bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-${action.color}-500/30 rounded-xl p-6 hover:border-${action.color}-500/60 transition-all duration-300`}
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
                                    <HoloCard delay={0.5}>
                                        <h3 className="text-2xl font-bold mb-6 text-purple-400">Neural Activity Stream</h3>
                                        <div className="space-y-4">
                                            {[
                                                { action: 'Video analyzed', project: 'Summer Campaign 2024', time: '2m ago' },
                                                { action: 'Content generated', project: 'Brand Voice Matrix', time: '15m ago' },
                                                { action: 'Project created', project: 'Q4 Strategy Launch', time: '1h ago' }
                                            ].map((activity, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                                    className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:border-purple-500/50 transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                                        <div>
                                                            <p className="font-semibold text-white">{activity.action}</p>
                                                            <p className="text-sm text-gray-400">{activity.project}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-500 group-hover:text-cyan-400 transition-colors">
                                                        {activity.time}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </HoloCard>
                                </div>
                            )}

                            {activeTab === 'create' && (
                                <HoloCard>
                                    <div className="text-center py-20">
                                        <SparklesIcon className="h-24 w-23 mx-auto mb-6 text-purple-400" />
                                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            AI Creation Studio
                                        </h2>
                                        <p className="text-gray-400 mb-8">Neural-powered content generation at your fingertips</p>
                                        <NeonButton variant="secondary">
                                            <SparklesIcon className="h-5 w-5" />
                                            Start Creating
                                        </NeonButton>
                                    </div>
                                </HoloCard>
                            )}

                            {activeTab === 'analyze' && (
                                <HoloCard>
                                    <div className="text-center py-20">
                                        <ChipIcon className="h-24 w-24 mx-auto mb-6 text-cyan-400" />
                                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                            Neural Insights Engine
                                        </h2>
                                        <p className="text-gray-400 mb-8">Deep analysis powered by advanced AI algorithms</p>
                                        <NeonButton variant="primary">
                                            <ChipIcon className="h-5 w-5" />
                                            Analyze Content
                                        </NeonButton>
                                    </div>
                                </HoloCard>
                            )}

                            {activeTab === 'launch' && (
                                <HoloCard>
                                    <div className="text-center py-20">
                                        <RocketIcon className="h-24 w-24 mx-auto mb-6 text-green-400" />
                                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                            Launch Pad
                                        </h2>
                                        <p className="text-gray-400 mb-8">Deploy your creations to the world</p>
                                        <NeonButton variant="success">
                                            <RocketIcon className="h-5 w-5" />
                                            Launch Project
                                        </NeonButton>
                                    </div>
                                </HoloCard>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FuturisticCreatorsEdge;
