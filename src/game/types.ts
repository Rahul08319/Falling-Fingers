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
