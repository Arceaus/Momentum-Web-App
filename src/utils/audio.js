// Web Audio API Synthesizer & Custom Audio Player for Completion Sounds

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a completion sound preset or custom uploaded audio file.
 */
export function playCompletionSound(enabled = true, preset = 'chime', customUri = null) {
  if (!enabled) return;

  // Custom System Audio File Upload Playback
  if (preset === 'custom' && customUri) {
    try {
      const audio = new Audio(customUri);
      audio.volume = 0.6;
      audio.play().catch((err) => {
        console.warn('Custom audio playback failed, falling back to chime synth:', err);
        playSynthPreset('chime');
      });
      return;
    } catch (e) {
      console.warn('Custom audio initialization error:', e);
    }
  }

  // Built-in Synthesizers
  playSynthPreset(preset);
}

function playSynthPreset(preset = 'chime') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (preset === 'bell') {
      // 🔮 Crystal Bell (High resonant bell chord)
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, now); // E6
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1975.53, now); // B6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.8);
      osc2.stop(now + 0.8);

    } else if (preset === 'pop') {
      // 🫧 Bubble Pop (Quick frequency sweep)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);

    } else if (preset === 'success') {
      // 🎉 Level Up (C Major Triad Chord)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });

    } else if (preset === 'marimba') {
      // 🪵 Wooden Marimba (Deep organic wood block)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(392.00, now); // G4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

    } else {
      // 🔔 Zen Chime (Default dual sine/triangle chime)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.51, now);
      osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.15);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}
