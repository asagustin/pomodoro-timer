import React, { useState } from 'react';
import { TimerProvider } from './context/TimerContext';
import { useTimer } from './hooks/useTimer';
import TimerRing from './components/TimerRing';
import TimerControls from './components/TimerControls';
import TaskList from './components/TaskList';
import Statistics from './components/Statistics';
import SettingsModal from './components/SettingsModal';
import { Settings as SettingsIcon } from 'lucide-react';

const TimerApp = () => {
  const {
    mode,
    timeLeft,
    isActive,
    toggleTimer,
    resetTimer,
    skipTimer,
    progress
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 md:py-12 relative overflow-hidden transition-colors duration-1000">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 opacity-25 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${
            mode === 'pomodoro' ? '#FF4757' : 
            mode === 'shortBreak' ? '#2ED573' : '#1E90FF'
          } 0%, transparent 60%)`
        }}
      />

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        {/* Mobile Header / Quick Settings */}
        <div className="w-full flex justify-between items-center mb-6 px-2">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Focus Flow</h1>
            <p className="text-gray-400 text-xs tracking-wider uppercase font-semibold">Stay productive</p>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-3.5 glass-panel hover:bg-white/10 active:scale-95 transition-all rounded-full cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Center Main Timer Ring */}
        <div className="w-full flex flex-col items-center">
          <TimerRing progress={progress} timeLeft={timeLeft} mode={mode} />
          
          <div className="w-full mt-4 flex flex-col items-center gap-6">
            <TimerControls 
              isActive={isActive} 
              toggleTimer={toggleTimer} 
              resetTimer={resetTimer} 
              skipTimer={skipTimer}
              mode={mode} 
            />
            
            <Statistics />
            
            <TaskList />
          </div>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <TimerProvider>
      <TimerApp />
    </TimerProvider>
  );
}

export default App;
