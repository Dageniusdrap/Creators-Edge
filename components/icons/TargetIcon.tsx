import React from 'react';

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.025 12.025 0 0 1-4.252 0m4.252 0a12.025 12.025 0 0 0-4.252 0M15.59 14.37a6 6 0 0 0-5.84 7.38v-4.82m5.84-2.56a12.025 12.025 0 0 0-4.252 0m4.252 0a12.025 12.025 0 0 1-4.252 0M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Zm12-2.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z"
        />
    </svg>
);