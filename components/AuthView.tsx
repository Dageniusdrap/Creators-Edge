import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MailIcon } from './icons/MailIcon';
import { KeyIcon } from './icons/KeyIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { GithubIcon } from './icons/GithubIcon';
import { LogoIcon } from './icons/LogoIcon';
import { motion } from 'framer-motion';

export const AuthView: React.FC = () => {
    const { handleLogin, handleSignup, handleGoogleLogin, handleGithubLogin, addNotification } = useAppContext();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLoginView) {
                await handleLogin(email, password);
            } else {
                await handleSignup(email, name);
                addNotification('Signup is simulated. Please log in.', 'info');
                setIsLoginView(true); // Switch to login after simulated signup
            }
        } catch (error: any) {
            addNotification(error.message || 'An error occurred.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSocialLogin = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        try {
            if (provider === 'google') await handleGoogleLogin();
            if (provider === 'github') await handleGithubLogin();
        } catch(error: any) {
             addNotification(error.message || 'An error occurred.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card w-full max-w-sm p-8 space-y-6">
            <div className="text-center">
                <LogoIcon className="h-16 w-auto mx-auto mb-4 text-white" />
                <h2 className="text-2xl font-bold text-white">
                    {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
                </h2>
                <p className="text-sm text-gray-300">
                    {isLoginView ? 'Sign in to access your creative hub.' : 'Get started with your AI co-pilot.'}
                </p>
            </div>

            <div className="relative h-1 w-full bg-white/10 rounded-full">
                 <motion.div 
                    className="absolute top-0 left-0 h-1 bg-indigo-500 rounded-full"
                    layoutId="auth-underline"
                    initial={false}
                    animate={{ width: isLoginView ? '50%' : '50%', left: isLoginView ? '0%' : '50%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>
            
             <div className="flex">
                <button onClick={() => setIsLoginView(true)} className={`w-1/2 py-2 font-semibold ${isLoginView ? 'text-white' : 'text-gray-400'}`}>Sign In</button>
                <button onClick={() => setIsLoginView(false)} className={`w-1/2 py-2 font-semibold ${!isLoginView ? 'text-white' : 'text-gray-400'}`}>Sign Up</button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLoginView && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 bg-white/5 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                         <MailIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                )}
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-white/5 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <MailIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {isLoginView && (
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 bg-white/5 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <KeyIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                >
                    {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800/50 text-gray-400 backdrop-blur-sm">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="flex items-center justify-center py-2 px-4 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
                >
                    <GoogleIcon className="h-5 w-5 mr-2" />
                    Google
                </button>
                <button
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                    className="flex items-center justify-center py-2 px-4 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
                >
                    <GithubIcon className="h-5 w-5 mr-2" />
                    GitHub
                </button>
            </div>
        </div>
    );
};