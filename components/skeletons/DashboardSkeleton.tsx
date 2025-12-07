import React from 'react';
import { Skeleton } from './Skeleton';

export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                {/* Performance Graph Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-80 w-full" />
                </div>
                 {/* Detailed Analysis Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                    <Skeleton className="h-8 w-1/2 mb-6" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
                {/* Transcript Skeleton */}
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-1/4 mb-2" />
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 space-y-8 sticky top-24">
                {/* Coaching Card Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <Skeleton className="h-28 w-28 mx-auto rounded-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mx-auto" />
                </div>
            </div>
        </div>
    );
};