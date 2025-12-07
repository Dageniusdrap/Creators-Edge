import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface ScoreGaugeProps {
  score: number; // Score from 0 to 10
  label: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label }) => {
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 45; // r=45

  let colorClass = 'stroke-red-500';
  if (percentage >= 40) colorClass = 'stroke-yellow-500';
  if (percentage >= 70) colorClass = 'stroke-green-500';
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(1));

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      ease: [0.08, 0.82, 0.17, 1], // Ease out quint
    });
    return controls.stop;
  }, [score, count]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="10"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <motion.circle
            className={colorClass}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1.5, ease: [0.08, 0.82, 0.17, 1] }}
          />
        </svg>
        <motion.span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-white">
          {rounded}
        </motion.span>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
};