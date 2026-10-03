// Daily Atmosphere Engine - Clean, editorial time-of-day contextual generator

export function getDailyAtmosphere() {
  let hour = new Date().getHours();

  if (typeof window !== 'undefined' && window.__momentumAtmospherePeriodOverride) {
    const override = window.__momentumAtmospherePeriodOverride;
    if (override === 'morning') hour = 9;
    else if (override === 'afternoon') hour = 14;
    else if (override === 'evening') hour = 19;
    else if (override === 'night') hour = 23;
  }

  if (hour >= 5 && hour < 12) {
    // Morning (5:00 AM - 11:59 AM)
    return {
      period: 'morning',
      label: 'Morning',
      iconSymbol: '☀',
      accentColor: '#B37418',
      badgeClass: 'atmosphere-morning',
      greetings: [
        "Good morning, {name}.",
        "Ready to begin, {name}?",
        "Quiet morning, {name}.",
        "A fresh day, {name}.",
        "Morning focus, {name}."
      ]
    };
  } else if (hour >= 12 && hour < 17) {
    // Afternoon (12:00 PM - 4:59 PM)
    return {
      period: 'afternoon',
      label: 'Afternoon',
      iconSymbol: '●',
      accentColor: '#C84B26',
      badgeClass: 'atmosphere-afternoon',
      greetings: [
        "Good afternoon, {name}.",
        "Steady progress, {name}.",
        "Continuing your work, {name}.",
        "Afternoon focus, {name}.",
        "Keep the momentum, {name}."
      ]
    };
  } else if (hour >= 17 && hour < 21) {
    // Evening (5:00 PM - 8:59 PM)
    return {
      period: 'evening',
      label: 'Evening',
      iconSymbol: '◈',
      accentColor: '#5C5850',
      badgeClass: 'atmosphere-evening',
      greetings: [
        "Good evening, {name}.",
        "Winding down, {name}.",
        "Quiet evening, {name}.",
        "Reviewing your day, {name}.",
        "Evening reflection, {name}."
      ]
    };
  } else {
    // Night (9:00 PM - 4:59 AM)
    return {
      period: 'night',
      label: 'Night',
      iconSymbol: '☾',
      accentColor: '#181715',
      badgeClass: 'atmosphere-night',
      greetings: [
        "Late hours, {name}.",
        "Quiet night, {name}.",
        "Unhurried focus, {name}.",
        "Late evening, {name}.",
        "Silent focus, {name}."
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
