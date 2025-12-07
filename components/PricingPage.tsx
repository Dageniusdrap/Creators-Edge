import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HoloCard } from './ui/HoloCard';
import { NeonButton } from './ui/NeonButton';
import { SparklesIcon, BoltIcon, ChipIcon, RocketIcon } from './ui/FuturisticIcons';
import { useAppContext } from '../context/AppContext';
import { api as apiClient } from '../utils/apiClient';

export const PricingPage = () => {
    const { currentUser } = useAppContext();
    const [currency, setCurrency] = useState<'USD' | 'UGX'>('USD');
    const [loading, setLoading] = useState<string | null>(null);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'USD' ? 'UGX' : 'USD');
    };

    const handleSubscribe = async (plan: string, price: number, variantId?: string) => {
        setLoading(plan);
        try {
            const provider = currency === 'UGX' ? 'flutterwave' : 'lemon';

            const response = await apiClient.post('/payment/checkout', {
                provider,
                amount: price, // For Flutterwave
                planId: variantId, // For LemonSqueezy
            });

            if (response.url) {
                window.location.href = response.url;
            } else {
                alert('Payment initialization failed. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to start subscription. Please make sure you are logged in.');
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            icon: ChipIcon,
            price: { USD: 0, UGX: 0 },
            features: [
                '5 AI Generations / day',
                'Basic Video Analysis',
                'Standard Support',
                'Community Access'
            ],
            color: 'from-blue-500 to-cyan-500',
            popular: false,
            variantId: '' // Free
        },
        {
            id: 'pro',
            name: 'Pro Creator',
            icon: SparklesIcon,
            price: { USD: 29, UGX: 100000 },
            features: [
                'Unlimited AI Generations',
                'Advanced Viral Predictions',
                'Priority Processing',
                'Exports & Reports',
                'Brand Voice Cloning'
            ],
            color: 'from-purple-500 to-pink-500',
            popular: true,
            variantId: 'variant_123' // Replace with real LemonSqueezy Variant ID
        },
        {
            id: 'agency',
            name: 'Agency',
            icon: RocketIcon,
            price: { USD: 99, UGX: 350000 },
            features: [
                'Everything in Pro',
                '5 Team Members',
                'Whitelabel Reports',
                'API Access',
                'Dedicated Account Manager'
            ],
            color: 'from-orange-500 to-red-500',
            popular: false,
            variantId: 'variant_456'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                    Upgrade Your Creative Engine
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto"
                >
                    Unlock the full potential of neural analysis and content generation. Choose the plan that fits your ambition.
                </motion.p>

                {/* Currency Toggle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 inline-flex bg-gray-900/50 p-1 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                >
                    <button
                        onClick={() => setCurrency('USD')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${currency === 'USD' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        International (USD)
                    </button>
                    <button
                        onClick={() => setCurrency('UGX')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${currency === 'UGX' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        East Africa (UGX)
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                    >
                        <HoloCard className={`h-full ${plan.popular ? 'border-purple-500/50 shadow-purple-500/20' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="p-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                                    <plan.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-white">
                                        {currency === 'USD' ? `$${plan.price.USD}` : `UGX ${plan.price.UGX.toLocaleString()}`}
                                    </span>
                                    <span className="text-gray-400">/month</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} p-1 flex-shrink-0 opacity-80`}>
                                                <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <NeonButton
                                    className="w-full justify-center"
                                    variant={plan.id === 'pro' ? 'secondary' : (plan.id === 'agency' ? 'primary' : 'success')}
                                    onClick={() => plan.price.USD > 0 ? handleSubscribe(plan.id, currency === 'USD' ? plan.price.USD : plan.price.UGX, plan.variantId) : null}
                                >
                                    {loading === plan.id ? 'Processing...' : (plan.price.USD > 0 ? 'Subscribe Now' : 'Current Plan')}
                                </NeonButton>
                            </div>
                        </HoloCard>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <p className="text-gray-500 text-sm">
                    Secured by {currency === 'USD' ? 'Lemon Squeezy' : 'Flutterwave'}.
                    Cancel anytime. No hidden fees.
                </p>
                <div className="flex justify-center gap-4 mt-4 opacity-50">
                    {/* Safe payment icons placeholder */}
                    <span className="text-gray-600">VISA</span>
                    <span className="text-gray-600">Mastercard</span>
                    {currency === 'UGX' && (
                        <>
                            <span className="text-yellow-600">MTN Mobile Money</span>
                            <span className="text-red-600">Airtel Money</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
