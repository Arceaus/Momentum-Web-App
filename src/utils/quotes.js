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
    title: "All done for today.",
    subtitle: "You completed all your planned tasks. Take time to step back and recharge."
  },
  {
    title: "Everything completed.",
    subtitle: "A quiet, productive day. Rest well for tomorrow."
  },
  {
    title: "All tasks checked off.",
    subtitle: "Your commitments for today are fulfilled. Enjoy your evening."
  },
  {
    title: "Day complete.",
    subtitle: "Steady, intentional progress. Well done."
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
