/**
 * Synthesized UI sound effects (Web Audio API, no audio files).
 * The AudioContext is created lazily on the first user gesture, as browsers require.
 */

const STORAGE_KEY = 'wrt:sfx-muted';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function audio() {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor() as AudioContext;
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** A single enveloped oscillator note. */
function tone(
  ac: AudioContext,
  { freq, start = 0, dur = 0.3, type = 'sine', gain = 0.5, glideTo }: {
    freq: number; start?: number; dur?: number; type?: OscillatorType; gain?: number; glideTo?: number;
  },
) {
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(env).connect(master!);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Band-passed noise sweep, for a "whoosh". */
function whoosh(ac: AudioContext, { from, to, dur = 0.22, gain = 0.25 }: { from: number; to: number; dur?: number; gain?: number }) {
  const t = ac.currentTime;
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + dur * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(env).connect(master!);
  src.start(t);
}

const SOUNDS = {
  /** Champion picked: low impact plus a bright two-note metallic chime. */
  lockIn(ac: AudioContext) {
    tone(ac, { freq: 140, glideTo: 55, dur: 0.25, type: 'sine', gain: 0.6 });
    tone(ac, { freq: 880, start: 0.03, dur: 0.5, type: 'triangle', gain: 0.25 });
    tone(ac, { freq: 1318.5, start: 0.09, dur: 0.6, type: 'triangle', gain: 0.2 });
    tone(ac, { freq: 2637, start: 0.09, dur: 0.35, type: 'sine', gain: 0.06 });
  },
  /** Section / navigation click. */
  nav(ac: AudioContext) {
    whoosh(ac, { from: 600, to: 2400, dur: 0.18, gain: 0.18 });
    tone(ac, { freq: 660, start: 0.05, dur: 0.2, type: 'triangle', gain: 0.15 });
  },
  /** Matchup card opened; the tone follows the rating. */
  openGood(ac: AudioContext) {
    whoosh(ac, { from: 500, to: 3000 });
    tone(ac, { freq: 784, start: 0.04, dur: 0.25, type: 'triangle', gain: 0.18 });
    tone(ac, { freq: 1175, start: 0.1, dur: 0.35, type: 'triangle', gain: 0.16 });
  },
  openNeutral(ac: AudioContext) {
    whoosh(ac, { from: 500, to: 2200 });
    tone(ac, { freq: 659, start: 0.05, dur: 0.3, type: 'triangle', gain: 0.18 });
  },
  openBad(ac: AudioContext) {
    whoosh(ac, { from: 1800, to: 300 });
    tone(ac, { freq: 220, start: 0.03, dur: 0.35, type: 'sawtooth', gain: 0.08, glideTo: 160 });
    tone(ac, { freq: 233, start: 0.03, dur: 0.35, type: 'triangle', gain: 0.12 });
  },
  close(ac: AudioContext) {
    whoosh(ac, { from: 2000, to: 500, dur: 0.15, gain: 0.12 });
  },
} as const;

export type SoundName = keyof typeof SOUNDS;

export function play(name: SoundName) {
  if (muted) return;
  const ac = audio();
  if (ac) SOUNDS[name](ac);
}

export const isMuted = () => muted;

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    /* storage unavailable; the setting just won't persist */
  }
}

/** Wires sounds to the UI with delegated listeners, so sections don't need to know about audio. */
export function installSfx(toggle: HTMLButtonElement) {
  const syncToggle = () => {
    toggle.setAttribute('aria-pressed', String(!muted));
    toggle.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
    toggle.textContent = muted ? '🔇' : '🔊';
  };
  syncToggle();
  toggle.addEventListener('click', () => {
    setMuted(!muted);
    syncToggle();
    play('nav');
  });

  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest('a.champ, a.card, .site-header nav a, a.back');
    if (!el) return;
    play(el.matches('a.champ') ? 'lockIn' : 'nav');
  });

  // `toggle` doesn't bubble, so listen in the capture phase.
  document.addEventListener(
    'toggle',
    (e) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.classList.contains('matchup')) return;
      if (!d.open) return play('close');
      if (d.classList.contains('matchup-good')) play('openGood');
      else if (d.classList.contains('matchup-bad')) play('openBad');
      else play('openNeutral');
    },
    true,
  );
}
