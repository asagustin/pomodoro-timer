import React from 'react';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

const TimerControls = ({ isActive, toggleTimer, resetTimer, skipTimer, mode }) => {
  const colors = {
    pomodoro: 'bg-[#FF4757] hover:bg-[#ff6b78]',
    shortBreak: 'bg-[#2ED573] hover:bg-[#4cee8d]',
    longBreak: 'bg-[#1E90FF] hover:bg-[#4ba3ff]',
  };

  return (
    <div className="flex items-center justify-center space-x-6 w-full">
      <button 
        onClick={resetTimer}
        className="p-4 rounded-full glass-panel hover:bg-white/10 transition-colors"
        title="Reset Timer"
      >
        <Square className="w-6 h-6 text-white" />
      </button>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTimer}
        className={`p-6 rounded-full shadow-lg text-white transition-colors duration-300 ${colors[mode]}`}
      >
        {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
      </motion.button>

      <button 
        onClick={skipTimer}
        className="p-4 rounded-full glass-panel hover:bg-white/10 transition-colors"
        title="Skip Session"
      >
        <SkipForward className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default TimerControls;
