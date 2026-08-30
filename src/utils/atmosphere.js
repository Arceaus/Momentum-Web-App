// Daily Atmosphere Engine - Subtle time-of-day personality generator

export function getDailyAtmosphere() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    // ☀️ Morning (5:00 AM - 11:59 AM)
    return {
      period: 'morning',
      label: 'Morning Clarity',
      iconSymbol: '☀️',
      accentColor: '#F59E0B',
      accentGlow: 'rgba(245, 158, 11, 0.15)',
      glowGradient: 'radial-gradient(circle at 50% -10%, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.04) 45%, transparent 70%)',
      badgeClass: 'atmosphere-morning',
      greetings: [
        "Good morning, {name}. A fresh start awaits.",
        "Morning focus, {name}.",
        "Rise and build momentum, {name}.",
        "Clear morning mind, {name}.",
        "A peaceful morning to focus, {name}."
      ]
    };
  } else if (hour >= 12 && hour < 17) {
    // ◐ Afternoon (12:00 PM - 4:59 PM)
    return {
      period: 'afternoon',
      label: 'Afternoon Flow',
      iconSymbol: '◐',
      accentColor: '#38BDF8',
      accentGlow: 'rgba(56, 189, 248, 0.15)',
      glowGradient: 'radial-gradient(circle at 50% -10%, rgba(56, 189, 248, 0.12) 0%, rgba(14, 165, 233, 0.04) 45%, transparent 70%)',
      badgeClass: 'atmosphere-afternoon',
      greetings: [
        "Good afternoon, {name}. Keep your momentum going.",
        "Peak flow state, {name}.",
        "Steady progress this afternoon, {name}.",
        "Sustaining focus, {name}.",
        "Afternoon clarity, {name}."
      ]
    };
  } else if (hour >= 17 && hour < 21) {
    // 🌆 Evening (5:00 PM - 8:59 PM)
    return {
      period: 'evening',
      label: 'Evening Unwind',
      iconSymbol: '🌆',
      accentColor: '#A855F7',
      accentGlow: 'rgba(168, 85, 247, 0.15)',
      glowGradient: 'radial-gradient(circle at 50% -10%, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.04) 45%, transparent 70%)',
      badgeClass: 'atmosphere-evening',
      greetings: [
        "Good evening, {name}. Reflect on today's progress.",
        "Unwinding momentum, {name}.",
        "Golden hour focus, {name}.",
        "Closing out the day strong, {name}.",
        "Evening quietude, {name}."
      ]
    };
  } else {
    // ☾ Night (9:00 PM - 4:59 AM)
    return {
      period: 'night',
      label: 'Night Sanctuary',
      iconSymbol: '☾',
      accentColor: '#6366F1',
      accentGlow: 'rgba(99, 102, 241, 0.15)',
      glowGradient: 'radial-gradient(circle at 50% -10%, rgba(99, 102, 241, 0.12) 0%, rgba(57, 211, 83, 0.04) 45%, transparent 70%)',
      badgeClass: 'atmosphere-night',
      greetings: [
        "Late hours, {name}. Quiet focus in the dark.",
        "Midnight mastery, {name}.",
        "Sanctuary of focus, {name}.",
        "Deep night flow, {name}.",
        "Silent momentum, {name}."
      ]
    };
  }
}

/**
 * Returns a time-of-day greeting personalized to the user's name.
 */
export function getAtmosphereGreeting(name = 'Friend') {
  const atmosphere = getDailyAtmosphere();
  const userName = name && name.trim() ? name.trim() : 'Friend';
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + today.getHours();
  const index = Math.abs(seed) % atmosphere.greetings.length;
  return atmosphere.greetings[index].replace('{name}', userName);
}
