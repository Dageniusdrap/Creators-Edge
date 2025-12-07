import React from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface ErrorMessageProps {
  message: string;
  onClear: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClear }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Generation Failed</h3>
        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
          <p>{message}</p>
        </div>
      </div>
      <div className="ml-auto pl-3">
        <div className="-mx-1.5 -my-1.5">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex bg-red-50 dark:bg-red-900/30 rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
          >
            <span className="sr-only">Dismiss</span>
            <XCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);