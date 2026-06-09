import React, { useState, useContext, useEffect } from 'react';
import { TimerContext } from '../context/TimerContext';
import { X, Settings as SettingsIcon, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useContext(TimerContext);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || 0
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm glass-panel bg-[#12161f] p-6 relative shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <SettingsIcon className="w-6 h-6 mr-3 text-gray-400" />
              Timer Settings
            </h2>

            <div className="space-y-5 text-left">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Focus Session (minutes)</label>
                <input 
                  type="number" 
                  name="pomodoro" 
                  value={localSettings.pomodoro}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FF4757] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Short Break (minutes)</label>
                <input 
                  type="number" 
                  name="shortBreak" 
                  value={localSettings.shortBreak}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#2ED573] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Long Break (minutes)</label>
                <input 
                  type="number" 
                  name="longBreak" 
                  value={localSettings.longBreak}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#1E90FF] transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
                <span className="text-sm text-gray-300 flex items-center">
                  {localSettings.soundEnabled ? <Volume2 className="w-5 h-5 mr-2 text-[#2ED573]" /> : <VolumeX className="w-5 h-5 mr-2 text-gray-500" />}
                  Sound Notifications
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="soundEnabled"
                    checked={localSettings.soundEnabled} 
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF4757]"></div>
                </label>
              </div>

              <button 
                onClick={handleSave}
                className="w-full mt-8 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
