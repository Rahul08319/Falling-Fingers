import { useState, useRef, useCallback, useEffect } from 'react';
import { Finger, GameState } from './types';

const SPAWN_INTERVAL_BASE = 1200;
const SPAWN_INTERVAL_MIN = 400;
const BROKEN_CHANCE_BASE = 0.4;
const BROKEN_CHANCE_MAX = 0.7;
const SPEED_BASE = 0.3;
const SPEED_INCREMENT = 0.02;
const FIXED_DISPLAY_TIME = 400;

let nextId = 0;

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [fingers, setFingers] = useState<Finger[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('falling-fingers-high') || '0', 10);
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameStateRef = useRef<GameState>('menu');

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const getLevel = useCallback((s: number) => Math.floor(s / 10) + 1, []);

  const spawnFinger = useCallback(() => {
    const lvl = getLevel(scoreRef.current);
    const brokenChance = Math.min(BROKEN_CHANCE_BASE + lvl * 0.03, BROKEN_CHANCE_MAX);
    const isBroken = Math.random() < brokenChance;
    const speed = SPEED_BASE + lvl * SPEED_INCREMENT + Math.random() * 0.15;

    const finger: Finger = {
      id: `f-${nextId++}`,
      x: 10 + Math.random() * 80,
      y: -5,
      isBroken,
      speed,
      rotation: -15 + Math.random() * 30,
      fingerType: Math.floor(Math.random() * 5),
      fixed: false,
      opacity: 1,
    };
    return finger;
  }, [getLevel]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setFingers([]);
    setIsNewHighScore(false);
    scoreRef.current = 0;
    livesRef.current = 3;
    lastSpawnRef.current = 0;
    setGameState('playing');
  }, []);

  const goToMenu = useCallback(() => {
    setGameState('menu');
    setFingers([]);
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setGameState('gameover');
    const prev = parseInt(localStorage.getItem('falling-fingers-high') || '0', 10);
    if (finalScore > prev) {
      localStorage.setItem('falling-fingers-high', String(finalScore));
      setHighScore(finalScore);
      setIsNewHighScore(true);
    } else {
      setHighScore(prev);
    }
  }, []);

  const handleTap = useCallback((id: string) => {
    if (gameStateRef.current !== 'playing') return;

    setFingers(prev => {
      const finger = prev.find(f => f.id === id);
      if (!finger || finger.fixed) return prev;

      if (finger.isBroken) {
        // Correct tap - fix it
        setScore(s => {
          const newScore = s + 1;
          setLevel(getLevel(newScore));
          return newScore;
        });
        // Show fixed state briefly then remove
        setTimeout(() => {
          setFingers(p => p.filter(f => f.id !== id));
        }, FIXED_DISPLAY_TIME);
        return prev.map(f => f.id === id ? { ...f, fixed: true } : f);
      } else {
        // Wrong tap - lose a life
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
  }, [endGame, getLevel]);

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

      // Spawn
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const newFinger = spawnFinger();
        setFingers(prev => [...prev, newFinger]);
      }

      // Move fingers down
      setFingers(prev => {
        const updated: Finger[] = [];
        let lostLife = false;

        for (const f of prev) {
          if (f.fixed) {
            updated.push(f);
            continue;
          }
          const newY = f.y + f.speed * (delta / 16);
          if (newY > 105) {
            // Fell off screen
            if (f.isBroken) {
              lostLife = true;
            }
            // Remove it
            continue;
          }
          updated.push({ ...f, y: newY });
        }

        if (lostLife) {
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              endGame(scoreRef.current);
            }
            return newLives;
          });
        }

        return updated;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameState, spawnFinger, endGame, getLevel]);

  return {
    gameState,
    fingers,
    score,
    lives,
    level,
    highScore,
    isNewHighScore,
    startGame,
    goToMenu,
    handleTap,
  };
}
