import React from 'react';
import { motion } from 'framer-motion';

export const HoloCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className={`relative group ${className}`}
    >
        {/* Holographic border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-60 blur-sm transition-all duration-500 animate-pulse pointer-events-none" />

        {/* Card content - Increased opacity for readability */}
        <div className="relative bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden h-full">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400 pointer-events-none" />

            {children}
        </div>
    </motion.div>
);

export default HoloCard;
