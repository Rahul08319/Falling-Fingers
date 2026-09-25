import { useState, useRef, useCallback, useEffect } from 'react';
import { Finger, FingerSpecialType, GameState, Difficulty, GameMode, PowerUp, PowerUpType, DIFFICULTY_CONFIG } from './types';
import { useSoundEffects } from './useSoundEffects';
import { useBackgroundMusic } from './useBackgroundMusic';
import { isLeaderboardWorthy, addToLeaderboard } from './Leaderboard';
import { createSeededRandom, getDailySeed } from './dailySeed';
import { getAccessibility, unlockAchievement } from './progression';
import { BossWaveState } from './GameProgressPanel';
import {
  getPlayablesLanguage, loadPlayablesSave, notifyFirstFrameReady, notifyGameReady,
  PLAYABLES_SAVE_EVENT, reportPlayablesError, requestPlayablesSave, isAudioEnabled,
  savePlayablesData, sendPlayablesScore,
} from './playables';

const SPAWN_INTERVAL_BASE = 1200;
const SPAWN_INTERVAL_MIN = 400;
const BROKEN_CHANCE_BASE = 0.4;
const BROKEN_CHANCE_MAX = 0.7;
const SPEED_BASE = 0.3;
const SPEED_INCREMENT = 0.02;
const FIXED_DISPLAY_TIME = 400;
const POWERUP_SPAWN_CHANCE = 0.012; // per frame
const SHIELD_DURATION = 8000;
const SLOWMO_DURATION = 5000;
const FREEZE_DURATION = 3000;
const COMBO_SHIELD_DURATION = 15000;
const BOSS_INTERVAL = 25;

let nextId = 0;

export interface ParticleEvent {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface FloatingPowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  speed: number;
}

export function useGameLoop() {
  const music = useBackgroundMusic();
  const sfx = useSoundEffects(!music.isMuted);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [isPlayablesReady, setIsPlayablesReady] = useState(false);
  const [isSystemPaused, setIsSystemPaused] = useState(false);
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
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [floatingPowerUps, setFloatingPowerUps] = useState<FloatingPowerUp[]>([]);
  const [missionProgress, setMissionProgress] = useState(0);
  const [bossWave, setBossWave] = useState<BossWaveState | null>(null);
  const adaptiveDifficultyRef = useRef(1);

  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const gameStateRef = useRef<GameState>('menu');
  const popupIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const seededRandRef = useRef<(() => number) | null>(null);
  const difficultyRef = useRef<Difficulty>('normal');
  const musicRef = useRef(music);
  const pausedBySystemRef = useRef(false);
  const bossSpawnedRef = useRef<number | null>(null);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { musicRef.current = music; }, [music]);

  useEffect(() => {
    let active = true;
    let removeAudioListener: (() => void) | undefined;
    let removePauseListener: (() => void) | undefined;
    let removeResumeListener: (() => void) | undefined;
    const saveOnDemand = () => { void savePlayablesData(); };
    const logUnhandledError = () => reportPlayablesError();

    const initialise = async () => {
      notifyFirstFrameReady();
      await loadPlayablesSave();
      if (!active) return;
      setHighScore(parseInt(localStorage.getItem('falling-fingers-high') || '0', 10));

      musicRef.current.setSystemAudio(isAudioEnabled());
      removeAudioListener = window.ytgame?.system?.onAudioEnabledChange?.((enabled) => musicRef.current.setSystemAudio(enabled)) ?? undefined;
      removePauseListener = window.ytgame?.system?.onPause?.(() => {
        if (gameStateRef.current === 'playing') {
          pausedBySystemRef.current = true;
          setIsSystemPaused(true);
          setGameState('paused');
          musicRef.current.stopMusic();
        }
        requestPlayablesSave();
      });
      removeResumeListener = window.ytgame?.system?.onResume?.(() => {
        if (pausedBySystemRef.current && gameStateRef.current === 'paused') {
          pausedBySystemRef.current = false;
          setIsSystemPaused(false);
          setGameState('playing');
          musicRef.current.startMusic();
        }
      });
      const language = await getPlayablesLanguage();
      if (language && active) document.documentElement.lang = language;
      if (!active) return;
      setIsPlayablesReady(true);
    };

    window.addEventListener(PLAYABLES_SAVE_EVENT, saveOnDemand);
    window.addEventListener('error', logUnhandledError);
    window.addEventListener('unhandledrejection', logUnhandledError);
    void initialise();
    return () => {
      active = false;
      removeAudioListener?.();
      removePauseListener?.();
      removeResumeListener?.();
      window.removeEventListener(PLAYABLES_SAVE_EVENT, saveOnDemand);
      window.removeEventListener('error', logUnhandledError);
      window.removeEventListener('unhandledrejection', logUnhandledError);
    };
  }, []);

  // This runs after React has committed the interactive menu, never while the
  // loading screen is still the only visible UI.
  useEffect(() => {
    if (isPlayablesReady) notifyGameReady();
  }, [isPlayablesReady]);

  // Lightweight hooks for deterministic Playwright inspection of the live game.
  useEffect(() => {
    const host = window as typeof window & {
      render_game_to_text?: () => string;
      advanceTime?: (ms: number) => void;
    };
    host.render_game_to_text = () => JSON.stringify({
      coordinateSystem: 'x/y are percentages; origin is top-left; y increases downward',
      mode: gameState, score, lives, level, combo, missionProgress,
      bossWave, fingers: fingers.filter(f => !f.fixed).map(f => ({ id: f.id, x: f.x, y: f.y, broken: f.isBroken, bossWave: f.bossWave })),
      powerUps: powerUps.filter(p => p.active).map(p => p.type),
    });
    host.advanceTime = (ms) => {
      if (gameStateRef.current !== 'playing') return;
      setFingers(prev => prev.map(f => f.fixed ? f : { ...f, y: f.y + f.speed * (ms / 16) }));
    };
    return () => { delete host.render_game_to_text; delete host.advanceTime; };
  }, [gameState, score, lives, level, combo, missionProgress, bossWave, fingers, powerUps]);

  const getRand = useCallback(() => {
    if (seededRandRef.current) return seededRandRef.current();
    return Math.random();
  }, []);

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

  const isSlowMoActive = useCallback(() => {
    return powerUps.some(p => p.type === 'slowmo' && p.active);
  }, [powerUps]);

  const isShieldActive = useCallback(() => {
    return powerUps.some(p => p.type === 'shield' && p.active);
  }, [powerUps]);

  const consumeShield = useCallback(() => {
    setPowerUps(prev => {
      const idx = prev.findIndex(p => p.type === 'shield' && p.active);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], active: false };
      return updated;
    });
  }, []);

  const spawnFinger = useCallback(() => {
    const lvl = getLevel(scoreRef.current);
    const rand = getRand;
    const brokenChance = Math.min(BROKEN_CHANCE_BASE + lvl * 0.03, BROKEN_CHANCE_MAX);
    const isBroken = rand() < brokenChance;
    const cfg = DIFFICULTY_CONFIG[difficultyRef.current];
    const speed = (SPEED_BASE + lvl * SPEED_INCREMENT + rand() * 0.15) * cfg.speedMult;

    let specialType: FingerSpecialType = 'normal';
    if (isBroken) {
      const roll = rand();
      if (roll < 0.08) specialType = 'golden';
      else if (roll < 0.18) specialType = 'speed';
      else if (roll < 0.23 && lvl >= 3) specialType = 'heal';
    }

    const finger: Finger = {
      id: `f-${nextId++}`,
      x: 10 + rand() * 80,
      y: -5,
      isBroken,
      speed: specialType === 'speed' ? speed * 1.8 : speed,
      rotation: -15 + rand() * 30,
      fingerType: Math.floor(rand() * 5),
      specialType,
      fixed: false,
      opacity: 1,
    };
    return finger;
  }, [getLevel, getRand]);

  // Every 25 points starts a short boss wave: five broken fingers from a giant hand.
  useEffect(() => {
    if (!bossWave?.active || bossSpawnedRef.current === bossWave.wave) return;
    bossSpawnedRef.current = bossWave.wave;
    setFingers(prev => [
      ...prev,
      ...Array.from({ length: bossWave.target }, (_, index): Finger => ({
        id: `boss-${bossWave.wave}-${nextId++}`,
        x: 15 + index * (70 / Math.max(1, bossWave.target - 1)),
        y: -8 - index * 8,
        isBroken: true,
        speed: 0.22 + index * 0.02,
        rotation: -12 + index * 6,
        fingerType: index,
        specialType: 'normal',
        fixed: false,
        opacity: 1,
        bossWave: bossWave.wave,
      })),
    ]);
  }, [bossWave]);

  const startGame = useCallback((mode: GameMode = 'classic', diff: Difficulty = 'normal') => {
    const cfg = DIFFICULTY_CONFIG[diff];
    setDifficulty(diff);
    setGameMode(mode);
    setScore(0);
    setLives(cfg.lives);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setFingers([]);
    setComboPopups([]);
    setParticles([]);
    setPowerUps([]);
    setFloatingPowerUps([]);
    setMissionProgress(0);
    setBossWave(null);
    adaptiveDifficultyRef.current = 1;
    bossSpawnedRef.current = null;
    setIsNewHighScore(false);
    setShowInitials(false);
    scoreRef.current = 0;
    livesRef.current = cfg.lives;
    comboRef.current = 0;
    lastSpawnRef.current = 0;
    difficultyRef.current = diff;

    if (mode === 'daily') {
      seededRandRef.current = createSeededRandom(getDailySeed());
    } else {
      seededRandRef.current = null;
    }

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
    setPowerUps([]);
    setFloatingPowerUps([]);
    setBossWave(null);
    setShowLeaderboard(false);
    setShowInitials(false);
    music.stopMusic();
  }, [music]);

  const togglePause = useCallback(() => {
    if (pausedBySystemRef.current) return;
    setGameState(prev => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused') return 'playing';
      return prev;
    });
  }, []);

  const consumePowerUp = useCallback((type: PowerUpType) => {
    setPowerUps(prev => {
      const idx = prev.findIndex(p => p.type === type && p.active);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], active: false };
      return updated;
    });
  }, []);

  const toggleMute = useCallback(() => {
    music.toggleMute();
    requestPlayablesSave();
  }, [music]);

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
    if (gameMode === 'daily') unlockAchievement('daily-finish');
    sendPlayablesScore(finalScore);
    requestPlayablesSave();
  }, [sfx, music, gameMode]);

  const submitInitials = useCallback((initials: string) => {
    addToLeaderboard({
      initials,
      score: scoreRef.current,
      combo: comboRef.current,
      date: new Date().toISOString(),
    });
    setShowInitials(false);
    requestPlayablesSave();
  }, []);

  const collectPowerUp = useCallback((id: string) => {
    setFloatingPowerUps(prev => {
      const pu = prev.find(p => p.id === id);
      if (!pu) return prev;
      sfx.playFix();
      const now = Date.now();
      if (pu.type === 'magnet') {
        setFingers(fingers => {
          const target = fingers.find(f => f.isBroken && !f.fixed);
          if (!target) return fingers;
          addPopup(target.x, target.y, '🧲 AUTO-FIX!', 'hsl(45 100% 55%)');
          setScore(score => score + 2);
          setTimeout(() => setFingers(items => items.filter(f => f.id !== target.id)), FIXED_DISPLAY_TIME);
          return fingers.map(f => f.id === target.id ? { ...f, fixed: true } : f);
        });
      } else {
        const dur = pu.type === 'shield' ? SHIELD_DURATION : pu.type === 'slowmo' ? SLOWMO_DURATION : pu.type === 'freeze' ? FREEZE_DURATION : COMBO_SHIELD_DURATION;
        const label: Record<Exclude<PowerUpType, 'magnet'>, string> = {
          shield: '🛡️ SHIELD!', slowmo: '🐌 SLOW-MO!', freeze: '❄️ FREEZE!', comboShield: '🔥 COMBO SHIELD!',
        };
        setPowerUps(pups => [...pups, { type: pu.type, active: true, duration: dur, startTime: now }]);
        addPopup(pu.x, pu.y, label[pu.type], 'hsl(var(--primary))');
        setTimeout(() => setPowerUps(pups => pups.filter(p => p.startTime !== now || p.type !== pu.type)), dur);
      }
      return prev.filter(p => p.id !== id);
    });
  }, [sfx, addPopup]);

  const handleTap = useCallback((id: string) => {
    if (gameStateRef.current !== 'playing') return;

    setFingers(prev => {
      const finger = prev.find(f => f.id === id);
      if (!finger || finger.fixed) return prev;

      if (finger.isBroken) {
        sfx.playTap();
        if (getAccessibility().haptics && navigator.vibrate) navigator.vibrate(12);
        const currentCombo = comboRef.current + 1;
        setCombo(currentCombo);
        setMaxCombo(m => Math.max(m, currentCombo));
        adaptiveDifficultyRef.current = Math.min(1.35, adaptiveDifficultyRef.current + 0.015);
        if (currentCombo === 1) unlockAchievement('first-fix');
        if (currentCombo >= 10) unlockAchievement('combo-10');
        setMissionProgress(progress => {
          const next = progress + 1;
          if (next < 10) return next;
          const now = Date.now();
          setPowerUps(pups => [...pups, { type: 'comboShield', active: true, duration: COMBO_SHIELD_DURATION, startTime: now }]);
          addPopup(finger.x, finger.y, '🎯 MISSION COMPLETE!', 'hsl(45 100% 55%)');
          setTimeout(() => setPowerUps(pups => pups.filter(p => p.startTime !== now)), COMBO_SHIELD_DURATION);
          return 0;
        });
        if (finger.bossWave) {
          setBossWave(wave => {
            if (!wave || !wave.active || wave.wave !== finger.bossWave) return wave;
            const fixed = wave.fixed + 1;
            if (fixed < wave.target) return { ...wave, fixed };
            setScore(total => total + 10);
            unlockAchievement('boss-clear');
            addPopup(50, 30, '🖐️ BOSS CLEARED +10!', 'hsl(45 100% 55%)');
            return { ...wave, fixed, active: false, cleared: true };
          });
        }
        const multiplier = getComboMultiplier(currentCombo);
        const slowMoBoost = powerUps.some(p => p.type === 'slowmo' && p.active) ? 2 : 1;

        let points = multiplier * slowMoBoost;
        let popupText = `+${points}${slowMoBoost > 1 ? ' 🐌' : ''}`;
        let popupColor = 'hsl(160 100% 45%)';
        let particleColor = 'hsl(160, 100%, 45%)';

        if (finger.specialType === 'golden') {
          points = multiplier * 5 * slowMoBoost;
          popupText = `+${points} 🌟${slowMoBoost > 1 ? '🐌' : ''}`;
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
          if (newScore >= 50) unlockAchievement('score-50');
          if (Math.floor(newScore / BOSS_INTERVAL) > Math.floor(s / BOSS_INTERVAL)) {
            const wave = Math.floor(newScore / BOSS_INTERVAL);
            setBossWave(current => current?.active ? current : { wave, fixed: 0, target: 5, active: true, cleared: false });
          }
          return newScore;
        });

        setTimeout(() => {
          setFingers(p => p.filter(f => f.id !== id));
        }, FIXED_DISPLAY_TIME);
        return prev.map(f => f.id === id ? { ...f, fixed: true } : f);
      } else {
        // Tapped healthy finger
        const shieldActive = powerUps.some(p => p.type === 'shield' && p.active);
        if (shieldActive) {
          consumeShield();
          addPopup(finger.x, finger.y, '🛡️ BLOCKED!', 'hsl(200 80% 55%)');
          return prev.filter(f => f.id !== id);
        }

        const comboShieldActive = powerUps.some(p => p.type === 'comboShield' && p.active);
        if (comboShieldActive) {
          consumePowerUp('comboShield');
          addPopup(finger.x, finger.y, '🔥 COMBO SAVED!', 'hsl(45 100% 55%)');
          return prev.filter(f => f.id !== id);
        }

        sfx.playLoseLife();
        setCombo(0);
        comboRef.current = 0;
        setMissionProgress(0);
        adaptiveDifficultyRef.current = Math.max(0.8, adaptiveDifficultyRef.current - 0.12);
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
  }, [endGame, getLevel, getComboMultiplier, addPopup, addParticle, triggerShake, sfx, powerUps, consumeShield, consumePowerUp]);

  // Update power-up expiration
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      const now = Date.now();
      setPowerUps(prev => prev.filter(p => now - p.startTime < p.duration));
    }, 200);
    return () => clearInterval(interval);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      if (gameStateRef.current !== 'playing') return;

      const delta = now - lastTime;
      lastTime = now;

      const lvl = getLevel(scoreRef.current);
      const cfg = DIFFICULTY_CONFIG[difficultyRef.current];
      const spawnInterval = Math.max((SPAWN_INTERVAL_BASE * cfg.spawnMult - lvl * 60) / adaptiveDifficultyRef.current, SPAWN_INTERVAL_MIN);

      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        const newFinger = spawnFinger();
        setFingers(prev => [...prev, newFinger]);
      }

      // Possibly spawn power-up
      if (Math.random() < POWERUP_SPAWN_CHANCE * (delta / 16)) {
        const powerUpTypes: PowerUpType[] = ['shield', 'slowmo', 'magnet', 'freeze', 'comboShield'];
        const puType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        setFloatingPowerUps(prev => [...prev, {
          id: `pu-${nextId++}`,
          type: puType,
          x: 10 + Math.random() * 80,
          y: -5,
          speed: 0.2 + Math.random() * 0.1,
        }]);
      }

      const slowMo = powerUps.some(p => p.type === 'slowmo' && p.active);
      const freeze = powerUps.some(p => p.type === 'freeze' && p.active);
      const speedFactor = freeze ? 0 : (slowMo ? 0.4 : 1) * adaptiveDifficultyRef.current;

      setFingers(prev => {
        const updated: Finger[] = [];
        let lostLife = false;

        for (const f of prev) {
          if (f.fixed) { updated.push(f); continue; }
          const newY = f.y + f.speed * speedFactor * (delta / 16);
          if (newY > 105) {
            if (f.isBroken) {
              // Shield blocks missed broken fingers too
              const shieldActive = powerUps.some(p => p.type === 'shield' && p.active);
              if (shieldActive) {
                consumeShield();
                // Don't lose life
              } else if (powerUps.some(p => p.type === 'comboShield' && p.active)) {
                consumePowerUp('comboShield');
              } else {
                lostLife = true;
              }
            }
            continue;
          }
          updated.push({ ...f, y: newY });
        }

        if (lostLife) {
          sfx.playLoseLife();
          triggerShake();
          setCombo(0);
          comboRef.current = 0;
          setMissionProgress(0);
          adaptiveDifficultyRef.current = Math.max(0.8, adaptiveDifficultyRef.current - 0.12);
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

      // Move floating power-ups
      setFloatingPowerUps(prev =>
        prev
          .map(pu => ({ ...pu, y: pu.y + pu.speed * speedFactor * (delta / 16) }))
          .filter(pu => pu.y < 105)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameState, spawnFinger, endGame, getLevel, sfx, triggerShake, powerUps, consumeShield, consumePowerUp]);

  return {
    gameState,
    isPlayablesReady,
    isSystemPaused,
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
    difficulty,
    gameMode,
    powerUps,
    floatingPowerUps,
    missionProgress,
    bossWave,
    music,
    startGame,
    goToMenu,
    togglePause,
    toggleMute,
    handleTap,
    removeParticle,
    submitInitials,
    setShowLeaderboard,
    collectPowerUp,
  };
}
