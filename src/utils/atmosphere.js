// Daily Atmosphere Engine - Quiet, editorial time-of-day contextual generator

export function getDailyAtmosphere() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    // ☀️ Morning (5:00 AM - 11:59 AM)
    return {
      period: 'morning',
      label: 'Morning Clarity',
      iconSymbol: '☀',
      accentColor: '#B37418',
      badgeClass: 'atmosphere-morning',
      greetings: [
        "Good morning, {name}. A clear focus slate awaits.",
        "Morning focus, {name}.",
        "Early session open, {name}.",
        "Clear morning mind, {name}.",
        "Quiet morning hours, {name}."
      ]
    };
  } else if (hour >= 12 && hour < 17) {
    // ● Afternoon (12:00 PM - 4:59 PM)
    return {
      period: 'afternoon',
      label: 'Afternoon Progression',
      iconSymbol: '●',
      accentColor: '#C84B26',
      badgeClass: 'atmosphere-afternoon',
      greetings: [
        "Good afternoon, {name}. Steady focus.",
        "Afternoon progression, {name}.",
        "Continuing today's ledger, {name}.",
        "Sustained focus, {name}.",
        "Afternoon clarity, {name}."
      ]
    };
  } else if (hour >= 17 && hour < 21) {
    // ◈ Evening (5:00 PM - 8:59 PM)
    return {
      period: 'evening',
      label: 'Evening Review',
      iconSymbol: '◈',
      accentColor: '#5C5850',
      badgeClass: 'atmosphere-evening',
      greetings: [
        "Good evening, {name}. Reviewing today's progress.",
        "Evening archive open, {name}.",
        "Quiet evening hours, {name}.",
        "Closing out the day's commitments, {name}.",
        "Evening reflection, {name}."
      ]
    };
  } else {
    // ☾ Night (9:00 PM - 4:59 AM)
    return {
      period: 'night',
      label: 'Night Session',
      iconSymbol: '☾',
      accentColor: '#181715',
      badgeClass: 'atmosphere-night',
      greetings: [
        "Late hours, {name}. Unhurried focus.",
        "Quiet night session, {name}.",
        "Focused solitude, {name}.",
        "Deep night focus, {name}.",
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
