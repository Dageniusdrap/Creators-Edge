import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MailIcon } from './icons/MailIcon';
import { LogoIcon } from './icons/LogoIcon';

export const ActivationView: React.FC = () => {
    const { currentUser, handleActivation } = useAppContext();
    const [isActivating, setIsActivating] = useState(false);

    const handleActivate = () => {
        setIsActivating(true);
        // In a real app, this would be an API call. Here we simulate it.
        setTimeout(() => {
            if (currentUser) {
                handleActivation(currentUser);
            }
            setIsActivating(false);
        }, 1500);
    };

    if (!currentUser) return null;

    return (
        <div className="glass-card w-full max-w-md p-8 text-center">
             <LogoIcon className="h-16 w-auto mx-auto mb-4 text-white" />
            <h2 className="text-2xl font-bold text-white">One Last Step!</h2>
            <p className="text-gray-300 mt-2">
                We've sent an activation link to your email address:
            </p>
            <p className="font-semibold text-white my-4">{currentUser.email}</p>
            <p className="text-sm text-gray-400">
                Please check your inbox (and spam folder) and click the link to activate your account.
            </p>

            <button
                onClick={handleActivate}
                disabled={isActivating}
                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center"
            >
                <MailIcon className="h-5 w-5 mr-2" />
                {isActivating ? 'Activating...' : 'Simulate Activation'}
            </button>
            <p className="text-xs text-gray-500 mt-2">
                (In this demo, clicking this button will instantly activate your account.)
            </p>
        </div>
    );
};