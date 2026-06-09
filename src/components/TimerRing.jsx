import React from 'react';
import { motion } from 'framer-motion';

const TimerRing = ({ progress, timeLeft, mode }) => {
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  // If progress is 0, offset is circumference. If progress is 1, offset is 0.
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const colors = {
    pomodoro: '#FF4757',
    shortBreak: '#2ED573',
    longBreak: '#1E90FF',
  };

  const modeLabels = {
    pomodoro: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  return (
    <div className="relative flex items-center justify-center w-80 h-80 my-8">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
        {/* Background Ring */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="160"
          cy="160"
          r={radius}
          fill="transparent"
          stroke={colors[mode]}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-7xl font-bold tracking-tighter" style={{ color: colors[mode] }}>
          {formatTime(timeLeft)}
        </span>
        <span className="text-gray-400 mt-2 uppercase tracking-widest text-sm font-semibold">
          {modeLabels[mode]}
        </span>
      </div>
    </div>
  );
};

export default TimerRing;
