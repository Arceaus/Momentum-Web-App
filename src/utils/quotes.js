// Short, minimalistic Claude-style greetings with dynamic user name interpolation

export const CLAUDE_STYLE_GREETINGS = [
  "Welcome back, {name}.",
  "What shall we focus on today, {name}?",
  "Ready to build momentum, {name}?",
  "Good to see you, {name}.",
  "Quiet progress today, {name}.",
  "Let's make today count, {name}.",
  "Focus and flow, {name}.",
  "Building quiet mastery, {name}.",
  "One step at a time, {name}.",
  "Your workspace is ready, {name}."
];

export const ALL_DONE_MESSAGES = [
  {
    title: "Everything completed 🎉",
    subtitle: "You're done for today. Nice work. Go enjoy the rest of your day."
  },
  {
    title: "All tasks accomplished! ✨",
    subtitle: "You've built peak momentum today. Step back, relax, and recharge."
  },
  {
    title: "Outstanding focus! 🌟",
    subtitle: "Every single item checked off. Take a deep breath and enjoy your free time."
  },
  {
    title: "Daily goals crushed! 💪",
    subtitle: "Flawless execution today. Your momentum activity graph is glowing."
  },
  {
    title: "Mastery in motion! 🚀",
    subtitle: "You completed everything you set out to do today. Rest up for tomorrow!"
  },
  {
    title: "Day complete! ☕",
    subtitle: "No remaining tasks. Time to kick back and savor your accomplishments."
  }
];

/**
 * Returns a short, deterministic Claude-style greeting line based on current live date.
 */
export function getDailyQuote(name = 'Friend') {
  if (!name || !name.trim()) name = 'Friend';
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = Math.abs(seed) % CLAUDE_STYLE_GREETINGS.length;
  return CLAUDE_STYLE_GREETINGS[index].replace('{name}', name.trim());
}

/**
 * Returns a random completion message pair (title & subtitle) when all tasks are finished.
 */
export function getRandomCompletionMessage() {
  const index = Math.floor(Math.random() * ALL_DONE_MESSAGES.length);
  return ALL_DONE_MESSAGES[index];
}
