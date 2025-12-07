import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PerformanceMetricPoint } from '../types';

interface SentimentGraphProps {
  metrics: PerformanceMetricPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold">{label}</p>
          <p className="text-sm" style={{ color: payload[0].fill }}>Sentiment: {payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
};

export const SentimentGraph: React.FC<SentimentGraphProps> = ({ metrics }) => {
    const data = metrics.map(point => ({
        name: point.label,
        sentiment: point.scores.find(s => s.metric.toLowerCase() === 'sentiment')?.value || 0
    })).filter(d => d.sentiment > 0);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-sm text-gray-500">No sentiment data available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(238, 242, 255, 0.4)' }} />
                <Bar dataKey="sentiment">
                    {data.map((entry, index) => {
                        let color = '#ef4444'; // red
                        if (entry.sentiment >= 4) color = '#f59e0b'; // yellow
                        if (entry.sentiment >= 7) color = '#10b981'; // green
                        return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};