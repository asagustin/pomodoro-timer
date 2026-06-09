import React, { useState, useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = () => {
  const { tasks, addTask, toggleTask, removeTask } = useContext(TimerContext);
  const [newTask, setNewTask] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="w-full max-w-md mt-10 p-6 glass-panel text-left">
      <h2 className="text-xl font-semibold mb-4 text-white">Tasks</h2>
      
      <form onSubmit={handleAdd} className="flex mb-4">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What are you working on?"
          className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-white outline-none focus:border-[#FF4757] transition-colors placeholder-white/50"
        />
        <button type="submit" className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-r-lg border border-l-0 border-white/20 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.li 
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center justify-between p-3 bg-black/20 rounded-lg group"
            >
              <div 
                className="flex items-center space-x-3 cursor-pointer flex-1"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? 
                  <CheckCircle2 className="w-5 h-5 text-[#2ED573]" /> : 
                  <Circle className="w-5 h-5 text-gray-500" />
                }
                <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-200'} transition-all`}>
                  {task.text}
                </span>
              </div>
              <button 
                onClick={() => removeTask(task.id)}
                className="text-gray-500 hover:text-[#FF4757] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {tasks.length === 0 && (
        <p className="text-gray-500 text-sm text-center mt-6 mb-2">No tasks yet. Add one above!</p>
      )}
    </div>
  );
};

export default TaskList;
