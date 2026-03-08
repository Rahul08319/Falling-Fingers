export interface Finger {
  id: string;
  x: number;
  y: number;
  isBroken: boolean;
  speed: number;
  rotation: number;
  fingerType: number; // 0-4 for different finger shapes
  specialType: FingerSpecialType;
  fixed: boolean;
  opacity: number;
}

export type FingerSpecialType = 'normal' | 'golden' | 'speed' | 'heal';

export type GameState = 'menu' | 'countdown' | 'playing' | 'paused' | 'gameover';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type GameMode = 'classic' | 'daily';

export interface PowerUp {
  type: 'shield' | 'slowmo';
  active: boolean;
  duration: number; // ms remaining
  startTime: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { speedMult: number; lives: number; spawnMult: number; label: string; emoji: string }> = {
  easy: { speedMult: 0.7, lives: 5, spawnMult: 1.3, label: 'EASY', emoji: '🟢' },
  normal: { speedMult: 1.0, lives: 3, spawnMult: 1.0, label: 'NORMAL', emoji: '🟡' },
  hard: { speedMult: 1.4, lives: 2, spawnMult: 0.7, label: 'HARD', emoji: '🔴' },
};
