import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface TourStep {
    selector: string;
    title: string;
    content: string;
    proTip?: string;
}

interface OnboardingTourProps {
    steps: TourStep[];
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps }) => {
    const { handleOnboardingFinish } = useAppContext();
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const updateTarget = () => {
            const element = document.querySelector(steps[currentStep].selector);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        };
        updateTarget();
        window.addEventListener('resize', updateTarget);
        return () => window.removeEventListener('resize', updateTarget);
    }, [currentStep, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleOnboardingFinish();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleSkip = () => {
        handleOnboardingFinish();
    };

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleSkip}
            />

            {/* Spotlight */}
            {targetRect && (
                 <motion.div
                    key={currentStep}
                    initial={{
                        x: targetRect.left - 16,
                        y: targetRect.top - 16,
                        width: targetRect.width + 32,
                        height: targetRect.height + 32,
                    }}
                    animate={{
                        x: targetRect.left - 16,
                        y: targetRect.top - 16,
                        width: targetRect.width + 32,
                        height: targetRect.height + 32,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute rounded-lg"
                    style={{
                       boxShadow: '0 0 15px 5px rgba(99, 102, 241, 0.6), 0 0 0 9999px rgba(0,0,0,0.7)',
                    }}
                />
            )}
            
            {/* Popover */}
            {targetRect && (
                <AnimatePresence>
                     <motion.div
                        key={`popover-${currentStep}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80"
                        style={{
                            top: targetRect.bottom + 20,
                            left: targetRect.left,
                            transform: `translateX(min(0px, ${window.innerWidth - targetRect.left - 320 - 20}px))`, // Keep it on screen
                        }}
                    >
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{step.content}</p>
                        </div>
                        
                        {step.proTip && (
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 border-t border-indigo-200 dark:border-indigo-800">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <LightbulbIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Pro Tip</h3>
                                        <div className="mt-1 text-xs text-indigo-700 dark:text-indigo-200">
                                            <p>{step.proTip}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentStep + 1} / {steps.length}</span>
                            <div className="space-x-2">
                                <button onClick={handleSkip} className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Skip</button>
                                {currentStep > 0 && <button onClick={handlePrev} className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md">Prev</button>}
                                <button onClick={handleNext} className="px-4 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};