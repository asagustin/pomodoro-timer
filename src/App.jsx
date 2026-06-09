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
    <div className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden transition-colors duration-1000">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${
            mode === 'pomodoro' ? '#FF4757' : 
            mode === 'shortBreak' ? '#2ED573' : '#1E90FF'
          } 0%, transparent 70%)`
        }}
      />

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="w-full flex justify-end mb-4 pr-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 glass-panel hover:bg-white/10 transition-colors rounded-full"
            title="Settings"
          >
            <SettingsIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Focus Flow</h1>
        <p className="text-gray-400 mb-8 tracking-widest uppercase text-sm font-semibold">Stay productive, take breaks</p>

        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-start">
          <div className="flex flex-col items-center">
            <TimerRing progress={progress} timeLeft={timeLeft} mode={mode} />
            <TimerControls 
              isActive={isActive} 
              toggleTimer={toggleTimer} 
              resetTimer={resetTimer} 
              skipTimer={skipTimer}
              mode={mode} 
            />
            <Statistics />
          </div>

          <div className="flex flex-col items-center w-full md:w-auto">
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
