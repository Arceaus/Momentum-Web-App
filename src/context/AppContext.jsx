import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSeedActivityLog, INITIAL_TASKS, INITIAL_HISTORY_LOG, DEFAULT_USER, DEFAULT_SETTINGS } from '../utils/seedData';
import { playCompletionSound } from '../utils/audio';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const STORAGE_KEYS = {
  TASKS: 'momentum_tasks_v11',
  ACTIVITY: 'momentum_activity_v11',
  USER: 'momentum_user_v11',
  SETTINGS: 'momentum_settings_v11',
  HISTORY: 'momentum_history_v11',
};

// Helper function to parse time estimate strings ("20m", "120m", "1h", "2.5h") into minutes
export function parseMinutes(timeStr) {
  if (!timeStr) return 20;
  const str = timeStr.toString().toLowerCase().trim();
  if (str.endsWith('h')) {
    const hours = parseFloat(str.replace('h', ''));
    return isNaN(hours) ? 60 : Math.round(hours * 60);
  }
  const mins = parseInt(str.replace(/[^0-9]/g, ''), 10);
  return isNaN(mins) || mins <= 0 ? 20 : mins;
}

export function AppProvider({ children }) {
  // Live dynamic system date
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const todayDisplay = `Today (${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})`;

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return saved ? JSON.parse(saved) : generateSeedActivityLog();
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [historyLog, setHistoryLog] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_HISTORY_LOG;
  });

  const [activeTab, setActiveTab] = useState('today');
  const [xpPops, setXpPops] = useState([]);
  const [toast, setToast] = useState(null);

  // Apply Theme Attribute
  useEffect(() => {
    if (settings.accentTheme) {
      document.documentElement.setAttribute('data-theme', settings.accentTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [settings.accentTheme]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyLog));
  }, [historyLog]);

  // XP & Level calculations: Level 0 starts at 0 XP
  const xpPerLevel = 200;
  const currentLevel = Math.floor(user.totalXP / xpPerLevel);
  const currentLevelXP = user.totalXP % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXP / xpPerLevel) * 100));

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const onboardUser = (name) => {
    const trimmed = name.trim();
    setUser((prev) => ({
      ...prev,
      name: trimmed,
      avatar: trimmed.charAt(0).toUpperCase(),
      hasOnboarded: true,
    }));
    showToast(`Welcome to Momentum, ${trimmed}!`, 'celebrate');
  };

  const addTask = (taskData) => {
    const newTask = {
      id: `t-${Date.now()}`,
      title: taskData.title.trim(),
      category: taskData.category || 'Focus',
      timeEstimate: taskData.timeEstimate || '15m',
      priority: taskData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added to Today', 'success');
  };

  // Hybrid Effort Scoring toggleTask handler
  const toggleTask = (id) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const nextCompleted = !targetTask.completed;
    const minutes = parseMinutes(targetTask.timeEstimate);
    const taskScore = 10 + minutes; // 10 base task pts + 1 pt per focus minute

    // 1. Update Tasks State
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    // 2. Update Hybrid Effort Activity Log
    setActivityLog((prevLog) => {
      const currentEntry = prevLog[todayStr];
      const prevCount = typeof currentEntry === 'object' ? (currentEntry.count || 0) : (typeof currentEntry === 'number' ? currentEntry : 0);
      const prevScore = typeof currentEntry === 'object' ? (currentEntry.score || 0) : prevCount * 30;
      const prevMinutes = typeof currentEntry === 'object' ? (currentEntry.minutes || 0) : prevCount * 20;

      const newCount = nextCompleted ? prevCount + 1 : Math.max(0, prevCount - 1);
      const newScore = nextCompleted ? prevScore + taskScore : Math.max(0, prevScore - taskScore);
      const newMinutes = nextCompleted ? prevMinutes + minutes : Math.max(0, prevMinutes - minutes);

      if (newCount === 0) {
        const updated = { ...prevLog };
        delete updated[todayStr];
        return updated;
      }

      return {
        ...prevLog,
        [todayStr]: {
          count: newCount,
          score: newScore,
          minutes: newMinutes,
        },
      };
    });

    // 3. Update History Log State
    setHistoryLog((prevHistory) => {
      const todayIndex = prevHistory.findIndex((h) => h.dateStr === todayStr);
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (nextCompleted) {
        const completedTaskItem = {
          id: targetTask.id,
          title: targetTask.title,
          category: targetTask.category,
          timeEstimate: targetTask.timeEstimate,
          completedAt: nowTime,
        };

        if (todayIndex > -1) {
          const updated = [...prevHistory];
          const existingTasks = updated[todayIndex].tasks.filter((t) => t.id !== targetTask.id);
          updated[todayIndex] = {
            ...updated[todayIndex],
            completedCount: existingTasks.length + 1,
            tasks: [completedTaskItem, ...existingTasks],
          };
          return updated;
        } else {
          return [
            {
              dateStr: todayStr,
              displayDate: todayDisplay,
              completedCount: 1,
              tasks: [completedTaskItem],
            },
            ...prevHistory,
          ];
        }
      } else {
        if (todayIndex > -1) {
          const updated = [...prevHistory];
          const filteredTasks = updated[todayIndex].tasks.filter((t) => t.id !== targetTask.id);
          if (filteredTasks.length === 0) {
            return updated.filter((h) => h.dateStr !== todayStr);
          } else {
            updated[todayIndex] = {
              ...updated[todayIndex],
              completedCount: filteredTasks.length,
              tasks: filteredTasks,
            };
            return updated;
          }
        }
        return prevHistory;
      }
    });

    // 4. Update User XP State (+20 XP or -20 XP)
    const xpDelta = nextCompleted ? 20 : -20;
    setUser((prevUser) => {
      const newTotalXP = Math.max(0, prevUser.totalXP + xpDelta);
      const newLevel = Math.floor(newTotalXP / xpPerLevel);

      if (newLevel > currentLevel && nextCompleted) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#39D353', '#26A641', '#38BDF8', '#BC8CFF']
        });
        showToast(`🎉 Level Up! You reached Level 0${newLevel}!`, 'celebrate');
      }

      return {
        ...prevUser,
        totalXP: newTotalXP,
        level: newLevel,
      };
    });

    if (nextCompleted) {
      playCompletionSound(settings.soundEnabled, settings.soundPreset, settings.customSoundUri);

      const popId = Date.now();
      setXpPops((prev) => [...prev, { id: popId, taskId: id }]);
      setTimeout(() => {
        setXpPops((prev) => prev.filter((p) => p.id !== popId));
      }, 900);
    }
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed');
  };

  const deleteDateHistory = (dateStr) => {
    const targetHistory = historyLog.find((h) => h.dateStr === dateStr);
    const countToDelete = targetHistory ? (targetHistory.completedCount || targetHistory.tasks.length) : 0;
    const xpDeduction = countToDelete * 20;

    // 1. Remove from historyLog
    setHistoryLog((prev) => prev.filter((h) => h.dateStr !== dateStr));

    // 2. Remove from activityLog contribution graph
    setActivityLog((prevLog) => {
      const updatedLog = { ...prevLog };
      delete updatedLog[dateStr];
      return updatedLog;
    });

    // 3. Deduct XP and update User Level
    if (xpDeduction > 0) {
      setUser((prevUser) => {
        const newTotalXP = Math.max(0, prevUser.totalXP - xpDeduction);
        const newLevel = Math.floor(newTotalXP / xpPerLevel);
        return {
          ...prevUser,
          totalXP: newTotalXP,
          level: newLevel,
        };
      });
    }

    showToast(`Deleted date history & deducted ${xpDeduction} XP`, 'info');
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved');
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    showToast('Profile updated');
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    setTasks(INITIAL_TASKS);
    setActivityLog(generateSeedActivityLog());
    setUser({ ...DEFAULT_USER, level: 0, totalXP: 0 });
    setSettings(DEFAULT_SETTINGS);
    setHistoryLog(INITIAL_HISTORY_LOG);
    showToast('Reset workspace to clean slate', 'info');
  };

  const completedTodayCount = tasks.filter((t) => t.completed).length;
  const totalTasksToday = tasks.length;
  const totalProductiveDays = Object.keys(activityLog).length;
  
  const totalCompletedAllTime = Object.values(activityLog).reduce((acc, entry) => {
    if (typeof entry === 'object') return acc + (entry.count || 0);
    if (typeof entry === 'number') return acc + entry;
    return acc;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        tasks,
        activityLog,
        historyLog,
        user,
        settings,
        activeTab,
        setActiveTab,
        xpPops,
        toast,
        currentLevel,
        currentLevelXP,
        xpPerLevel,
        progressPercent,
        completedTodayCount,
        totalTasksToday,
        totalProductiveDays,
        totalCompletedAllTime,
        onboardUser,
        addTask,
        toggleTask,
        deleteTask,
        deleteDateHistory,
        updateSettings,
        updateUser,
        resetData,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
