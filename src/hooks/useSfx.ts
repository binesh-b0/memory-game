import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'memoryGameSfxEnabled';

type Tone = {
  type: OscillatorType;
  freq: number;
  durationMs: number;
  gain: number;
  attackMs?: number;
  releaseMs?: number;
  detune?: number;
};

const getInitialEnabled = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return true;
  return raw === 'true';
};

export default function useSfx() {
  const [enabled, setEnabled] = useState(getInitialEnabled);
  const ctxRef = useRef<AudioContext | null>(null);
  const outRef = useRef<GainNode | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const ensure = useCallback(() => {
    if (ctxRef.current && outRef.current) return { ctx: ctxRef.current, out: outRef.current };

    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) throw new Error('AudioContext not available');
    const ctx = new AudioCtx();
    const out = ctx.createGain();
    out.gain.value = 0.08;
    out.connect(ctx.destination);

    ctxRef.current = ctx;
    outRef.current = out;
    return { ctx, out };
  }, []);

  const playTone = useCallback(
    (tone: Tone) => {
      if (!enabled) return;
      const { ctx, out } = ensure();
      if (ctx.state === 'suspended') void ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = tone.type;
      osc.frequency.setValueAtTime(tone.freq, now);
      if (tone.detune) osc.detune.setValueAtTime(tone.detune, now);

      const attack = (tone.attackMs ?? 6) / 1000;
      const release = (tone.releaseMs ?? 70) / 1000;
      const duration = tone.durationMs / 1000;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, tone.gain), now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(attack + 0.01, duration + release));

      osc.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + duration + release + 0.03);
    },
    [enabled, ensure],
  );

  const toggle = useCallback(() => setEnabled(prev => !prev), []);

  const flip = useCallback(() => {
    playTone({ type: 'triangle', freq: 740, durationMs: 55, gain: 0.22, releaseMs: 60 });
  }, [playTone]);

  const match = useCallback(() => {
    playTone({ type: 'sine', freq: 880, durationMs: 70, gain: 0.18, releaseMs: 90 });
    playTone({ type: 'sine', freq: 1174, durationMs: 90, gain: 0.16, attackMs: 10, releaseMs: 120, detune: 6 });
  }, [playTone]);

  const miss = useCallback(() => {
    playTone({ type: 'square', freq: 190, durationMs: 120, gain: 0.12, releaseMs: 140 });
    playTone({ type: 'square', freq: 150, durationMs: 140, gain: 0.1, attackMs: 8, releaseMs: 180 });
  }, [playTone]);

  const win = useCallback(() => {
    playTone({ type: 'sine', freq: 659, durationMs: 90, gain: 0.14, releaseMs: 120 });
    playTone({ type: 'sine', freq: 784, durationMs: 100, gain: 0.14, attackMs: 10, releaseMs: 140 });
    playTone({ type: 'sine', freq: 988, durationMs: 130, gain: 0.14, attackMs: 14, releaseMs: 180 });
  }, [playTone]);

  const lose = useCallback(() => {
    playTone({ type: 'sawtooth', freq: 240, durationMs: 120, gain: 0.12, releaseMs: 160 });
    playTone({ type: 'sawtooth', freq: 170, durationMs: 160, gain: 0.1, attackMs: 10, releaseMs: 220 });
  }, [playTone]);

  return { enabled, toggle, flip, match, miss, win, lose };
}
