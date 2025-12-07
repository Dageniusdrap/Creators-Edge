import React from 'react';
import { Skeleton } from './Skeleton';

export const GeneratedContentSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden mt-4">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};