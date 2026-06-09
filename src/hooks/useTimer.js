import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { TimerContext } from '../context/TimerContext';

// modes: 'pomodoro', 'shortBreak', 'longBreak'
export const useTimer = () => {
  const { settings, addCompletedPomodoro } = useContext(TimerContext);
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  
  const intervalRef = useRef(null);

  const getDuration = useCallback((currentMode) => {
    return settings[currentMode] * 60;
  }, [settings]);

  // Handle settings change
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(getDuration(mode));
    }
  }, [settings, mode, isActive, getDuration]);

  const playSound = () => {
    if (settings.soundEnabled) {
      // Create a simple beep using Web Audio API if no audio file is provided
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch(e) {
        console.warn("Audio not supported or blocked");
      }
    }
  };

  const nextMode = useCallback(() => {
    setIsActive(false);
    if (mode === 'pomodoro') {
      // Check if we need a long break (e.g., every 4 pomodoros)
      // For simplicity, just alternating for now, or you could implement long break logic
      setMode('shortBreak');
    } else {
      setMode('pomodoro');
    }
  }, [mode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      playSound();
      if (mode === 'pomodoro') {
        addCompletedPomodoro(settings.pomodoro);
      }
      nextMode();
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode, nextMode, settings.pomodoro, addCompletedPomodoro]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getDuration(mode));
  };

  const skipTimer = () => {
    nextMode();
  };

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode));

  return {
    mode,
    setMode,
    timeLeft,
    isActive,
    toggleTimer,
    resetTimer,
    skipTimer,
    progress,
    totalDuration: getDuration(mode)
  };
};
