/**
 * Ringtone preference utilities.
 * Manages user ringtone selection stored in localStorage.
 */

export type RingtoneOption = 'classic' | 'modern' | 'pulse' | 'none';

const STORAGE_KEY = 'ringtone_preference';

export const RINGTONE_OPTIONS: { value: RingtoneOption; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Traditional phone ring' },
  { value: 'modern', label: 'Modern', description: 'Smooth digital tone' },
  { value: 'pulse', label: 'Pulse', description: 'Gentle pulsing beep' },
  { value: 'none', label: 'None', description: 'Silent (no ringtone)' },
];

export function getRingtonePreference(): RingtoneOption {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && RINGTONE_OPTIONS.some((o) => o.value === stored)) {
      return stored as RingtoneOption;
    }
  } catch {
    // localStorage not available
  }
  return 'classic';
}

export function setRingtonePreference(option: RingtoneOption): void {
  try {
    localStorage.setItem(STORAGE_KEY, option);
  } catch {
    // localStorage not available
  }
}

// ---------------------------------------------------------------------------
// Web Audio API tone generator
// Generates ringtone sounds without external audio files.
// ---------------------------------------------------------------------------

let ringtoneInterval: ReturnType<typeof setInterval> | null = null;
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/** Play a single beep burst using Web Audio API. */
function playBeep(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  startTime = ctx.currentTime,
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gainNode.gain.setValueAtTime(volume, startTime + duration - 0.05);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/** Play a pattern for the chosen ringtone option. */
function playRingtoneBurst(option: RingtoneOption) {
  if (option === 'none') return;
  try {
    const ctx = getAudioContext();

    if (option === 'classic') {
      // Classic: two quick medium-high beeps
      playBeep(ctx, 880, 0.35, 0.4, 'square', ctx.currentTime);
      playBeep(ctx, 880, 0.35, 0.4, 'square', ctx.currentTime + 0.4);
    } else if (option === 'modern') {
      // Modern: smooth ascending chord
      playBeep(ctx, 523, 0.6, 0.35, 'sine', ctx.currentTime);
      playBeep(ctx, 659, 0.6, 0.35, 'sine', ctx.currentTime + 0.15);
      playBeep(ctx, 784, 0.6, 0.35, 'sine', ctx.currentTime + 0.3);
    } else if (option === 'pulse') {
      // Pulse: gentle repeating single note
      playBeep(ctx, 440, 0.2, 0.3, 'sine', ctx.currentTime);
      playBeep(ctx, 440, 0.2, 0.3, 'sine', ctx.currentTime + 0.25);
      playBeep(ctx, 440, 0.2, 0.3, 'sine', ctx.currentTime + 0.5);
    }
  } catch {
    // AudioContext may not be available (e.g., SSR or permission denied)
  }
}

/**
 * Start playing the ringtone in a repeating loop.
 * Each burst plays every ~2 seconds.
 */
export function startRingtone() {
  const option = getRingtonePreference();
  if (option === 'none') return;

  stopRingtone(); // Ensure no duplicate loops
  playRingtoneBurst(option);
  ringtoneInterval = setInterval(() => {
    playRingtoneBurst(option);
  }, 2000);
}

/** Stop the currently playing ringtone. */
export function stopRingtone() {
  if (ringtoneInterval !== null) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
}

/** Play a single preview burst (for the settings page). */
export function previewRingtone(option: RingtoneOption) {
  if (option === 'none') return;
  playRingtoneBurst(option);
}
