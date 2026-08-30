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
