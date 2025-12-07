import React from 'react';

interface EmptyStateProps {
    icon: React.FC<any>;
    title: string;
    description: string;
    children: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, children }) => {
    return (
        <div className="space-y-8">
            <div className="text-center p-8 bg-black/10 rounded-2xl border border-white/10">
                <Icon className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm max-w-md mx-auto text-gray-300">{description}</p>
            </div>
            {children}
        </div>
    );
};