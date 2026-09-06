import { useCallback, useRef } from 'react';

const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;

export function useSoundEffects(isAudioEnabled = true) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!AudioCtx) return null;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    return ctxRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) => {
    const ctx = getCtx();
    if (!ctx || !isAudioEnabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [getCtx, isAudioEnabled]);

  const playTap = useCallback(() => {
    playTone(800, 0.08, 'square', 0.08);
  }, [playTone]);

  const playFix = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.12), 60);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 120);
  }, [playTone]);

  const playGoldenFix = useCallback(() => {
    playTone(784, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(988, 0.1, 'sine', 0.15), 80);
    setTimeout(() => playTone(1175, 0.2, 'sine', 0.12), 160);
  }, [playTone]);

  const playLoseLife = useCallback(() => {
    playTone(300, 0.15, 'sawtooth', 0.1);
    setTimeout(() => playTone(200, 0.25, 'sawtooth', 0.08), 100);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(400, 0.2, 'sawtooth', 0.12);
    setTimeout(() => playTone(300, 0.2, 'sawtooth', 0.1), 200);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.08), 400);
    setTimeout(() => playTone(150, 0.5, 'sawtooth', 0.06), 600);
  }, [playTone]);

  const playCombo = useCallback((comboLevel: number) => {
    const baseFreq = 600 + Math.min(comboLevel, 10) * 50;
    playTone(baseFreq, 0.08, 'triangle', 0.1);
    setTimeout(() => playTone(baseFreq * 1.25, 0.12, 'triangle', 0.08), 50);
  }, [playTone]);

  const playCountdown = useCallback(() => {
    playTone(440, 0.15, 'sine', 0.1);
  }, [playTone]);

  const playGo = useCallback(() => {
    playTone(880, 0.25, 'sine', 0.12);
  }, [playTone]);

  return { playTap, playFix, playGoldenFix, playLoseLife, playGameOver, playCombo, playCountdown, playGo };
}
