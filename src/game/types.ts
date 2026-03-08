export interface Finger {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  isBroken: boolean;
  speed: number;
  rotation: number;
  fingerType: number; // 0-4 for different finger shapes
  fixed: boolean;
  opacity: number;
}

export type GameState = 'menu' | 'playing' | 'gameover';
