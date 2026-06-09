import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import { Flame, Clock } from 'lucide-react';

const Statistics = () => {
  const { stats } = useContext(TimerContext);

  const hours = Math.floor(stats.totalFocusTime / 60);
  const minutes = stats.totalFocusTime % 60;

  return (
    <div className="flex space-x-4 mt-8 w-full max-w-md">
      <div className="flex-1 flex items-center space-x-3 glass-panel p-4">
        <div className="p-3 bg-[#FF4757]/20 rounded-full">
          <Flame className="w-6 h-6 text-[#FF4757]" />
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Pomodoros</p>
          <p className="text-xl font-bold text-white">{stats.completedPomodoros}</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center space-x-3 glass-panel p-4">
        <div className="p-3 bg-[#1E90FF]/20 rounded-full">
          <Clock className="w-6 h-6 text-[#1E90FF]" />
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Focus Time</p>
          <p className="text-xl font-bold text-white">{hours}h {minutes}m</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
