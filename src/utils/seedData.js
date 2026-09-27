// Seed data generator for Momentum 100% Clean Slate & Un-onboarded Default State

export function generateSeedActivityLog() {
  // Pure zero state: 0 contributions
  return {};
}

// 100% Clean Blank Tasks
export const INITIAL_TASKS = [];

// 100% Clean Blank History
export const INITIAL_HISTORY_LOG = [];

export const DEFAULT_USER = {
  name: '',
  avatar: '',
  level: 0,
  totalXP: 0,
  hasOnboarded: false, // Default to un-onboarded so every new visitor enters their own name!
};

export const DEFAULT_SETTINGS = {
  dailyGoal: 5,
  soundEnabled: true,
  soundPreset: 'chime',
  customSoundUri: null,
  customSoundName: null,
  accentTheme: 'light',
};
