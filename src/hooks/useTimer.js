import { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { TimerContext } from '../context/TimerContext';

// modes: 'pomodoro', 'shortBreak', 'longBreak'
export const useTimer = () => {
  const { settings, stats, addCompletedPomodoro } = useContext(TimerContext);
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!settings.soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.warn("Could not pre-initialize AudioContext", e);
    }
  }, [settings.soundEnabled]);

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
        initAudio();
        const audioCtx = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
        
        // Ensure it is resumed
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

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
        console.warn("Audio not supported or blocked", e);
      }
    }
  };

  const nextMode = useCallback(() => {
    setIsActive(false);
    if (mode === 'pomodoro') {
      // Check if we need a long break (e.g., every 4 pomodoros)
      const nextCount = stats.completedPomodoros + 1;
      if (nextCount > 0 && nextCount % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('pomodoro');
    }
  }, [mode, stats.completedPomodoros]);

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

  const toggleTimer = () => {
    initAudio();
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    initAudio();
    setIsActive(false);
    setTimeLeft(getDuration(mode));
  };

  const skipTimer = () => {
    initAudio();
    nextMode();
  };

  const currentDuration = useMemo(() => getDuration(mode), [mode, getDuration]);
  const progress = useMemo(() => {
    return ((currentDuration - timeLeft) / currentDuration);
  }, [currentDuration, timeLeft]);

  return {
    mode,
    setMode,
    timeLeft,
    isActive,
    toggleTimer,
    resetTimer,
    skipTimer,
    progress,
    totalDuration: currentDuration
  };
};
