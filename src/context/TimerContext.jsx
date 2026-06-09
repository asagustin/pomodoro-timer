import React, { createContext, useState, useEffect } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? JSON.parse(saved) : {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      soundEnabled: true,
    };
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('pomodoroStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset if it's a new day
      if (new Date(parsed.date).toLocaleDateString() !== new Date().toLocaleDateString()) {
        return { date: new Date().toISOString(), completedPomodoros: 0, totalFocusTime: 0 };
      }
      return parsed;
    }
    return { date: new Date().toISOString(), completedPomodoros: 0, totalFocusTime: 0 };
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pomodoroTasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateSettings = (newSettings) => setSettings({ ...settings, ...newSettings });
  
  const addCompletedPomodoro = (durationMinutes) => {
    setStats(prev => ({
      ...prev,
      completedPomodoros: prev.completedPomodoros + 1,
      totalFocusTime: prev.totalFocusTime + durationMinutes,
    }));
  };

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TimerContext.Provider value={{
      settings, updateSettings,
      stats, addCompletedPomodoro,
      tasks, addTask, toggleTask, removeTask
    }}>
      {children}
    </TimerContext.Provider>
  );
};
