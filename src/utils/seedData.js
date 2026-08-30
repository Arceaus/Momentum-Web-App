// Seed data generator for Momentum 100% Clean Slate

export function generateSeedActivityLog() {
  // Pure zero state: 0 contributions
  return {};
}

// 100% Clean Blank Tasks
export const INITIAL_TASKS = [];

// 100% Clean Blank History
export const INITIAL_HISTORY_LOG = [];

export const DEFAULT_USER = {
  name: 'Sarthak',
  avatar: 'S',
  level: 0,
  totalXP: 0, // Level 00, 0 XP
  hasOnboarded: true,
};

export const DEFAULT_SETTINGS = {
  dailyGoal: 5,
  soundEnabled: true,
  soundPreset: 'chime', // Options: 'chime', 'bell', 'pop', 'success', 'marimba', 'custom'
  customSoundUri: null,
  customSoundName: null,
  accentTheme: 'mint',
};
