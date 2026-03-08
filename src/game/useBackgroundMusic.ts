import { useCallback, useRef, useState, useEffect } from 'react';

const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;

export function useBackgroundMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const intervalRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('falling-fingers-muted') === 'true';
  });

  const getCtx = useCallback(() => {
    if (!AudioCtx) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioCtx();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.gain.setValueAtTime(isMuted ? 0 : 0.06, ctxRef.current.currentTime);
      gainRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  }, [isMuted]);

  const playNote = useCallback((freq: number, duration: number, time: number, type: OscillatorType = 'sine') => {
    const ctx = getCtx();
    if (!ctx || !gainRef.current) return;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    noteGain.gain.setValueAtTime(0.3, time);
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(noteGain);
    noteGain.connect(gainRef.current);
    osc.start(time);
    osc.stop(time + duration);
  }, [getCtx]);

  const startMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    isPlayingRef.current = true;

    // Cyberpunk arpeggio loop
    const notes = [
      196, 233, 262, 311, 330, 311, 262, 233, // G3, Bb3, C4, Eb4, E4...
      220, 262, 294, 349, 330, 294, 262, 220, // A3, C4, D4, F4, E4...
    ];
    let noteIdx = 0;

    const playNext = () => {
      if (!isPlayingRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const note = notes[noteIdx % notes.length];
      playNote(note, 0.25, now, 'triangle');
      playNote(note * 2, 0.15, now + 0.05, 'sine');
      noteIdx++;
    };

    playNext();
    intervalRef.current = window.setInterval(playNext, 280);
  }, [getCtx, playNote]);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('falling-fingers-muted', String(next));
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.setValueAtTime(next ? 0 : 0.06, ctxRef.current.currentTime);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => stopMusic();
  }, [stopMusic]);

  return { startMusic, stopMusic, toggleMute, isMuted };
}
