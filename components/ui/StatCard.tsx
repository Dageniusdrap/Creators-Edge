import React, { useEffect, useState } from 'react';

export const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => {
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
