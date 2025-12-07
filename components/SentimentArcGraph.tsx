import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

interface SentimentArcGraphProps {
  data: { timeLabel: string; clientSentiment: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold">{label}</p>
          <p className="text-sm" style={{ color: payload[0].stroke }}>Sentiment: {payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
};

export const SentimentArcGraph: React.FC<SentimentArcGraphProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-sm text-gray-500">No sentiment data available.</div>;
    }
    
    // Define a color gradient for the line/area
    const gradientId = "sentimentGradient";

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="timeLabel" stroke="rgba(128, 128, 128, 0.8)" />
                <YAxis domain={[0, 10]} stroke="rgba(128, 128, 128, 0.8)" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clientSentiment" stroke="none" fill={`url(#${gradientId})`} />
                <Line type="monotone" dataKey="clientSentiment" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};