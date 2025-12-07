import React, { useState } from 'react';
import { PiggyBankIcon } from './icons/PiggyBankIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { useAppContext } from '../context/AppContext';
import { Loader } from './Loader';
import type { RetirementPlan, RetirementProjectionPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string, icon?: React.ReactNode }> = ({ label, name, value, onChange, type = 'text', placeholder, icon }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className={`w-full p-3 bg-white/5 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow ${icon ? 'pl-10' : 'pl-3'}`}
                placeholder={placeholder}
            />
        </div>
    </div>
);

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

const ProjectionsChart: React.FC<{ data: RetirementProjectionPoint[] }> = ({ data }) => (
    <div className="h-64 pr-4 bg-black/20 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <defs>
                    <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="year" stroke="rgba(255, 255, 255, 0.5)" />
                <YAxis tickFormatter={val => `$${(val / 1000).toFixed(0)}k`} stroke="rgba(255, 255, 255, 0.5)" />
                <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="none" fill="url(#projectionGradient)" />
                <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


export const RetirementPlanner: React.FC = () => {
    const { isAnalyzing, retirementPlan, handleGenerateRetirementPlan } = useAppContext();
    const [inputs, setInputs] = useState({
        currentAge: '30',
        retirementAge: '65',
        currentSavings: '50000',
        monthlyContribution: '500',
        monthlyRetirementIncome: '4000',
        investmentStyle: 'Moderate',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerateRetirementPlan(inputs);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="glass-card p-6 w-full max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                    <PiggyBankIcon className="h-6 w-6 mr-3" />
                    Retirement Plan Generator
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <InputField label="Current Age" name="currentAge" value={inputs.currentAge} onChange={handleChange} type="number" />
                        <InputField label="Retirement Age" name="retirementAge" value={inputs.retirementAge} onChange={handleChange} type="number" />
                    </div>
                    <InputField label="Current Savings" name="currentSavings" value={inputs.currentSavings} onChange={handleChange} type="number" placeholder="50,000" icon={<span className="text-gray-400">$</span>} />
                    <InputField label="Monthly Contribution" name="monthlyContribution" value={inputs.monthlyContribution} onChange={handleChange} type="number" placeholder="500" icon={<span className="text-gray-400">$</span>} />
                    <InputField label="Desired Monthly Income" name="monthlyRetirementIncome" value={inputs.monthlyRetirementIncome} onChange={handleChange} type="number" placeholder="4,000" icon={<span className="text-gray-400">$</span>} />
                    <div>
                        <label htmlFor="investmentStyle" className="block text-sm font-medium text-gray-300">Investment Style</label>
                        <select
                            id="investmentStyle"
                            name="investmentStyle"
                            value={inputs.investmentStyle}
                            onChange={handleChange}
                            className="mt-1 w-full p-3 bg-white/5 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                        >
                            <option value="Conservative">Conservative (4% Avg. Return)</option>
                            <option value="Moderate">Moderate (6% Avg. Return)</option>
                            <option value="Aggressive">Aggressive (8% Avg. Return)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? 'Generating Plan...' : 'Generate My Plan'}
                    </button>
                </form>
            </div>
            
            {isAnalyzing && !retirementPlan && (
                <div className="flex items-center justify-center h-full">
                    <Loader message="Building your financial future..." />
                </div>
            )}
            
            {retirementPlan && (
                <div className="glass-card p-6 space-y-6">
                    <div>
                         <div className={`flex items-center p-3 rounded-lg ${retirementPlan.isFeasible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {retirementPlan.isFeasible ? <CheckIcon className="h-6 w-6 mr-3"/> : <XIcon className="h-6 w-6 mr-3"/>}
                            <h3 className="text-lg font-bold">Your Plan is {retirementPlan.isFeasible ? 'Feasible' : 'Not Feasible'}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{retirementPlan.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-black/20 rounded-lg">
                            <p className="text-sm text-gray-400">Projected Nest Egg</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(retirementPlan.projectedNestEgg)}</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg">
                            <p className="text-sm text-gray-400">Monthly Retirement Income</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(retirementPlan.projectedMonthlyIncome)}</p>
                        </div>
                    </div>
                    
                     <div>
                        <h4 className="font-semibold text-gray-200 mb-2">Nest Egg Projection</h4>
                        <ProjectionsChart data={retirementPlan.projections} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2">Key Recommendations</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                            {retirementPlan.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-2">{retirementPlan.accumulationPhase.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{retirementPlan.accumulationPhase.summary}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                {retirementPlan.accumulationPhase.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-2">{retirementPlan.decumulationPhase.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{retirementPlan.decumulationPhase.summary}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                {retirementPlan.decumulationPhase.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};