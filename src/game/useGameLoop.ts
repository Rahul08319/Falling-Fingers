import { useState, useRef, useCallback, useEffect } from 'react';
import { Finger, FingerSpecialType, GameState } from './types';
import { useSoundEffects } from './useSoundEffects';
import { useBackgroundMusic } from './useBackgroundMusic';
import { isLeaderboardWorthy, addToLeaderboard } from './Leaderboard';

const SPAWN_INTERVAL_BASE = 1200;
const SPAWN_INTERVAL_MIN = 400;
const BROKEN_CHANCE_BASE = 0.4;
const BROKEN_CHANCE_MAX = 0.7;
const SPEED_BASE = 0.3;
const SPEED_INCREMENT = 0.02;
const FIXED_DISPLAY_TIME = 400;

let nextId = 0;

export interface ParticleEvent {
  id: number;
  x: number;
  y: number;
  color: string;
}

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [fingers, setFingers] = useState<Finger[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [comboPopups, setComboPopups] = useState<{ id: number; x: number; y: number; text: string; color: string }[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('falling-fingers-high') || '0', 10);
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [particles, setParticles] = useState<ParticleEvent[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInitials, setShowInitials] = useState(false);

  const sfx = useSoundEffects();
  const music = useBackgroundMusic();
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const gameStateRef = useRef<GameState>('menu');
  const popupIdRef = useRef(0);
  const particleIdRef = useRef(0);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const getLevel = useCallback((s: number) => Math.floor(s / 10) + 1, []);

  const getComboMultiplier = useCallback((c: number) => {
    if (c >= 20) return 4;
    if (c >= 10) return 3;
    if (c >= 5) return 2;
    return 1;
  }, []);

  const addPopup = useCallback((x: number, y: number, text: string, color: string) => {
    const id = popupIdRef.current++;
    setComboPopups(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setComboPopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, []);

  const addParticle = useCallback((x: number, y: number, color: string) => {
    const id = particleIdRef.current++;
    setParticles(prev => [...prev, { id, x, y, color }]);
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  const triggerShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  }, []);

  const spawnFinger = useCallback(() => {
    const lvl = getLevel(scoreRef.current);
    const brokenChance = Math.min(BROKEN_CHANCE_BASE + lvl * 0.03, BROKEN_CHANCE_MAX);
    const isBroken = Math.random() < brokenChance;
    const speed = SPEED_BASE + lvl * SPEED_INCREMENT + Math.random() * 0.15;

    let specialType: FingerSpecialType = 'normal';
    if (isBroken) {
      const roll = Math.random();
      if (roll < 0.08) specialType = 'golden';
      else if (roll < 0.18) specialType = 'speed';
      else if (roll < 0.23 && lvl >= 3) specialType = 'heal';
    }

    const finger: Finger = {
      id: `f-${nextId++}`,
      x: 10 + Math.random() * 80,
      y: -5,
      isBroken,
      speed: specialType === 'speed' ? speed * 1.8 : speed,
      rotation: -15 + Math.random() * 30,
      fingerType: Math.floor(Math.random() * 5),
      specialType,
      fixed: false,
      opacity: 1,
    };
    return finger;
  }, [getLevel]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setFingers([]);
    setComboPopups([]);
    setParticles([]);
    setIsNewHighScore(false);
    setShowInitials(false);
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    lastSpawnRef.current = 0;
    setCountdown(3);
    setGameState('countdown');
  }, []);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;
    if (countdown <= 0) {
      sfx.playGo();
      setGameState('playing');
      music.startMusic();
      return;
    }
    sfx.playCountdown();
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameState, countdown, sfx, music]);

  const goToMenu = useCallback(() => {
    setGameState('menu');
    setFingers([]);
    setComboPopups([]);
    setParticles([]);
    setShowLeaderboard(false);
    setShowInitials(false);
    music.stopMusic();
  }, [music]);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused') return 'playing';
      return prev;
    });
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setGameState('gameover');
    sfx.playGameOver();
    music.stopMusic();
    const prev = parseInt(localStorage.getItem('falling-fingers-high') || '0', 10);
    if (finalScore > prev) {
      localStorage.setItem('falling-fingers-high', String(finalScore));
      setHighScore(finalScore);
      setIsNewHighScore(true);
    } else {
      setHighScore(prev);
    }
    if (isLeaderboardWorthy(finalScore)) {
      setShowInitials(true);
    }
  }, [sfx, music]);

  const submitInitials = useCallback((initials: string) => {
    addToLeaderboard({
      initials,
      score: scoreRef.current,
      combo: comboRef.current,
      date: new Date().toISOString(),
    });
    setShowInitials(false);
  }, []);

  const handleTap = useCallback((id: string) => {
    if (gameStateRef.current !== 'playing') return;

    setFingers(prev => {
      const finger = prev.find(f => f.id === id);
      if (!finger || finger.fixed) return prev;

      if (finger.isBroken) {
        sfx.playTap();
        const currentCombo = comboRef.current + 1;
        setCombo(currentCombo);
        setMaxCombo(m => Math.max(m, currentCombo));
        const multiplier = getComboMultiplier(currentCombo);

        let points = multiplier;
        let popupText = `+${points}`;
        let popupColor = 'hsl(160 100% 45%)';
        let particleColor = 'hsl(160, 100%, 45%)';

        if (finger.specialType === 'golden') {
          points = multiplier * 5;
          popupText = `+${points} 🌟`;
          popupColor = 'hsl(45 100% 55%)';
          particleColor = 'hsl(45, 100%, 55%)';
          sfx.playGoldenFix();
        } else if (finger.specialType === 'heal') {
          setLives(l => Math.min(l + 1, 5));
          popupText = `+${points} ❤️‍🩹`;
          popupColor = 'hsl(340 90% 55%)';
          particleColor = 'hsl(340, 90%, 55%)';
          sfx.playFix();
        } else {
          sfx.playFix();
        }

        if (currentCombo >= 5) {
          popupText += ` x${multiplier}`;
          sfx.playCombo(currentCombo);
        }

        addPopup(finger.x, finger.y, popupText, popupColor);
        addParticle(finger.x, finger.y, particleColor);

        setScore(s => {
          const newScore = s + points;
          setLevel(getLevel(newScore));
          return newScore;
        });

        setTimeout(() => {
          setFingers(p => p.filter(f => f.id !== id));
        }, FIXED_DISPLAY_TIME);
        return prev.map(f => f.id === id ? { ...f, fixed: true } : f);
      } else {
        sfx.playLoseLife();
        setCombo(0);
        comboRef.current = 0;
        addPopup(finger.x, finger.y, '-1 ❤️', 'hsl(0 85% 55%)');
        triggerShake();
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            endGame(scoreRef.current);
          }
          return newLives;
        });
        return prev.filter(f => f.id !== id);
      }
    });
  }, [endGame, getLevel, getComboMultiplier, addPopup, addParticle, triggerShake, sfx]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      if (gameStateRef.current !== 'playing') return;

      const delta = now - lastTime;
      lastTime = now;

      const lvl = getLevel(scoreRef.current);
      const spawnInterval = Math.max(SPAWN_INTERVAL_BASE - lvl * 60, SPAWN_INTERVAL_MIN);

      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const newFinger = spawnFinger();
        setFingers(prev => [...prev, newFinger]);
      }

      setFingers(prev => {
        const updated: Finger[] = [];
        let lostLife = false;

        for (const f of prev) {
          if (f.fixed) { updated.push(f); continue; }
          const newY = f.y + f.speed * (delta / 16);
          if (newY > 105) {
            if (f.isBroken) lostLife = true;
            continue;
          }
          updated.push({ ...f, y: newY });
        }

        if (lostLife) {
          sfx.playLoseLife();
          triggerShake();
          setCombo(0);
          comboRef.current = 0;
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) endGame(scoreRef.current);
            return newLives;
          });
        }

        return updated;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameState, spawnFinger, endGame, getLevel, sfx, triggerShake]);

  return {
    gameState,
    fingers,
    score,
    lives,
    level,
    combo,
    maxCombo,
    comboPopups,
    countdown,
    highScore,
    isNewHighScore,
    particles,
    screenShake,
    showLeaderboard,
    showInitials,
    music,
    startGame,
    goToMenu,
    togglePause,
    handleTap,
    removeParticle,
    submitInitials,
    setShowLeaderboard,
  };
}
