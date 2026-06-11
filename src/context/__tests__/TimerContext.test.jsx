import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimerContext, TimerProvider } from '../TimerContext';

// Helper component to consume and test the TimerContext
const TestConsumer = () => {
  const {
    settings,
    updateSettings,
    stats,
    addCompletedPomodoro,
    tasks,
    addTask,
    toggleTask,
    removeTask,
  } = useContext(TimerContext);

  return (
    <div>
      <div data-testid="settings-pomodoro">{settings.pomodoro}</div>
      <div data-testid="settings-sound">{settings.soundEnabled ? 'enabled' : 'disabled'}</div>
      
      <div data-testid="stats-completed">{stats.completedPomodoros}</div>
      <div data-testid="stats-focus">{stats.totalFocusTime}</div>
      
      <div data-testid="tasks-count">{tasks.length}</div>
      <ul data-testid="tasks-list">
        {tasks.map((task) => (
          <li key={task.id} data-testid={`task-${task.id}`}>
            {task.text} - {task.completed ? 'completed' : 'active'}
            <button
              data-testid={`toggle-${task.id}`}
              onClick={() => toggleTask(task.id)}
            >
              Toggle
            </button>
            <button
              data-testid={`remove-${task.id}`}
              onClick={() => removeTask(task.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button data-testid="btn-update-settings" onClick={() => updateSettings({ pomodoro: 30, soundEnabled: false })}>
        Update Settings
      </button>
      <button data-testid="btn-add-pomodoro" onClick={() => addCompletedPomodoro(25)}>
        Add Pomodoro
      </button>
      <button data-testid="btn-add-task" onClick={() => addTask('Test Task')}>
        Add Task
      </button>
    </div>
  );
};

describe('TimerContext & TimerProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('provides default values when localStorage is empty', () => {
    render(
      <TimerProvider>
        <TestConsumer />
      </TimerProvider>
    );

    expect(screen.getByTestId('settings-pomodoro').textContent).toBe('25');
    expect(screen.getByTestId('settings-sound').textContent).toBe('enabled');
    expect(screen.getByTestId('stats-completed').textContent).toBe('0');
    expect(screen.getByTestId('stats-focus').textContent).toBe('0');
    expect(screen.getByTestId('tasks-count').textContent).toBe('0');
  });

  it('updates settings and persists them to localStorage', () => {
    render(
      <TimerProvider>
        <TestConsumer />
      </TimerProvider>
    );

    const updateBtn = screen.getByTestId('btn-update-settings');
    act(() => {
      updateBtn.click();
    });

    expect(screen.getByTestId('settings-pomodoro').textContent).toBe('30');
    expect(screen.getByTestId('settings-sound').textContent).toBe('disabled');

    const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings'));
    expect(savedSettings.pomodoro).toBe(30);
    expect(savedSettings.soundEnabled).toBe(false);
  });

  it('adds a completed Pomodoro and accumulates stats', () => {
    render(
      <TimerProvider>
        <TestConsumer />
      </TimerProvider>
    );

    const addBtn = screen.getByTestId('btn-add-pomodoro');
    act(() => {
      addBtn.click();
    });

    expect(screen.getByTestId('stats-completed').textContent).toBe('1');
    expect(screen.getByTestId('stats-focus').textContent).toBe('25');

    const savedStats = JSON.parse(localStorage.getItem('pomodoroStats'));
    expect(savedStats.completedPomodoros).toBe(1);
    expect(savedStats.totalFocusTime).toBe(25);
  });

  it('supports full task lifecycle (add, toggle, remove) and persists to localStorage', () => {
    render(
      <TimerProvider>
        <TestConsumer />
      </TimerProvider>
    );

    // 1. Add Task
    const addTaskBtn = screen.getByTestId('btn-add-task');
    act(() => {
      addTaskBtn.click();
    });

    expect(screen.getByTestId('tasks-count').textContent).toBe('1');
    
    const savedTasksAfterAdd = JSON.parse(localStorage.getItem('pomodoroTasks'));
    expect(savedTasksAfterAdd).toHaveLength(1);
    expect(savedTasksAfterAdd[0].text).toBe('Test Task');
    expect(savedTasksAfterAdd[0].completed).toBe(false);

    const taskId = savedTasksAfterAdd[0].id;

    // 2. Toggle Task
    const toggleBtn = screen.getByTestId(`toggle-${taskId}`);
    act(() => {
      toggleBtn.click();
    });

    expect(screen.getByTestId(`task-${taskId}`).textContent).toContain('completed');
    const savedTasksAfterToggle = JSON.parse(localStorage.getItem('pomodoroTasks'));
    expect(savedTasksAfterToggle[0].completed).toBe(true);

    // 3. Remove Task
    const removeBtn = screen.getByTestId(`remove-${taskId}`);
    act(() => {
      removeBtn.click();
    });

    expect(screen.getByTestId('tasks-count').textContent).toBe('0');
    const savedTasksAfterRemove = JSON.parse(localStorage.getItem('pomodoroTasks'));
    expect(savedTasksAfterRemove).toHaveLength(0);
  });

  it('resets stats if the saved date is not today', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const oldStats = {
      date: pastDate.toISOString(),
      completedPomodoros: 5,
      totalFocusTime: 125,
    };
    localStorage.setItem('pomodoroStats', JSON.stringify(oldStats));

    render(
      <TimerProvider>
        <TestConsumer />
      </TimerProvider>
    );

    // Should reset to 0 because the saved date was yesterday
    expect(screen.getByTestId('stats-completed').textContent).toBe('0');
    expect(screen.getByTestId('stats-focus').textContent).toBe('0');
  });
});
