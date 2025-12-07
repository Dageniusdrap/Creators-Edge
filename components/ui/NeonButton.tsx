import React from 'react';
import { motion } from 'framer-motion';

export const NeonButton = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }: {
    children: React.ReactNode,
    onClick?: () => void,
    variant?: "primary" | "secondary" | "success" | "danger",
    className?: string,
    type?: "button" | "submit" | "reset",
    disabled?: boolean
}) => {
    const colors = {
        primary: "from-cyan-500 to-blue-600 shadow-cyan-500/50",
        secondary: "from-purple-500 to-pink-600 shadow-purple-500/50",
        success: "from-green-500 to-emerald-600 shadow-green-500/50",
        danger: "from-red-500 to-orange-600 shadow-red-500/50"
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05, boxShadow: "0 0 30px currentColor" } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${colors[variant]} opacity-90 group-hover:opacity-100 transition-opacity`} />
            {!disabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            )}
            <span className="relative flex items-center gap-2 justify-center">{children}</span>
        </motion.button>
    );
};

export default NeonButton;
