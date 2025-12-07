import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Get a feel for the power of AI-driven content analysis.',
        features: [
            { text: '5 AI Generations per month', included: true },
            { text: 'Basic Analysis Suite', included: true },
            { text: 'Limited History', included: true },
            { text: 'Advanced Coaching', included: false },
            { text: 'Video Generation Tools', included: false },
            { text: 'Priority Support', included: false },
        ],
        cta: 'You are on this plan',
        isCurrent: true,
    },
    {
        name: 'Creator',
        price: '$29',
        description: 'For creators ready to level up their content game.',
        features: [
            { text: '100 AI Generations per month', included: true },
            { text: 'Full Analysis Suite', included: true },
            { text: 'Unlimited History', included: true },
            { text: 'Advanced Coaching', included: true },
            { text: 'Video Generation Tools', included: false },
            { text: 'Priority Support', included: false },
        ],
        cta: 'Upgrade to Creator',
        isCurrent: false,
    },
    {
        name: 'Pro',
        price: '$79',
        description: 'The ultimate toolkit for professional creators and agencies.',
        features: [
            { text: 'Unlimited AI Generations', included: true },
            { text: 'Full Analysis Suite', included: true },
            { text: 'Unlimited History', included: true },
            { text: 'Advanced Coaching', included: true },
            { text: 'Video Generation Tools', included: true },
            { text: 'Priority Support', included: true },
        ],
        cta: 'Upgrade to Pro',
        isCurrent: false,
        isFeatured: true,
    },
];

export const PricingView: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                    Find the perfect plan
                </h1>
                <p className="mt-4 text-xl text-gray-300">
                    Unlock your creative potential. Choose the plan that fits your needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`glass-card p-8 rounded-2xl flex flex-col ${plan.isFeatured ? 'ring-2 ring-indigo-500' : ''}`}
                    >
                        {plan.isFeatured && (
                            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold text-white bg-indigo-500">
                                    <SparklesIcon className="h-4 w-4 mr-1.5" />
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <h3 className="text-2xl font-bold text-white text-center">{plan.name}</h3>
                        <p className="mt-4 text-gray-300 text-center text-sm h-12">{plan.description}</p>
                        
                        <div className="mt-6 text-center">
                            <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                            {plan.price !== '$0' && <span className="text-base font-medium text-gray-400">/month</span>}
                        </div>

                        <ul className="mt-8 space-y-4">
                            {plan.features.map((feature) => (
                                <li key={feature.text} className="flex items-start">
                                    {feature.included ? (
                                        <CheckIcon className="flex-shrink-0 h-6 w-6 text-green-400" />
                                    ) : (
                                        <XIcon className="flex-shrink-0 h-6 w-6 text-gray-500" />
                                    )}
                                    <span className={`ml-3 text-gray-300 ${!feature.included && 'text-gray-500'}`}>{feature.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-8">
                            <button
                                disabled={plan.isCurrent}
                                className={`w-full px-6 py-3 text-base font-medium rounded-md shadow-sm transition-colors ${
                                    plan.isCurrent
                                        ? 'bg-gray-500 text-gray-300 cursor-default'
                                        : plan.isFeatured
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};