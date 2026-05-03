export interface Theme {
  id: string;
  name: string;
  emoji: string;
  unlockScore: number;
  description: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'neon',
    name: 'Neon Cyber',
    emoji: '💚',
    unlockScore: 0,
    description: 'The default cyberpunk look',
    vars: {
      '--background': '220 20% 6%',
      '--foreground': '180 100% 90%',
      '--card': '220 25% 10%',
      '--primary': '160 100% 45%',
      '--secondary': '280 80% 55%',
      '--accent': '340 90% 55%',
      '--game-glow': '160 100% 45%',
      '--game-neon': '280 80% 55%',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Wave',
    emoji: '🌅',
    unlockScore: 50,
    description: 'Warm retro vaporwave palette',
    vars: {
      '--background': '280 30% 8%',
      '--foreground': '40 100% 92%',
      '--card': '280 30% 13%',
      '--primary': '25 100% 60%',
      '--secondary': '320 90% 60%',
      '--accent': '50 100% 60%',
      '--game-glow': '25 100% 60%',
      '--game-neon': '320 90% 60%',
    },
  },
  {
    id: 'ice',
    name: 'Glacier',
    emoji: '🧊',
    unlockScore: 150,
    description: 'Cool icy blues and whites',
    vars: {
      '--background': '210 40% 8%',
      '--foreground': '195 100% 92%',
      '--card': '210 40% 13%',
      '--primary': '195 100% 55%',
      '--secondary': '220 90% 65%',
      '--accent': '170 90% 55%',
      '--game-glow': '195 100% 55%',
      '--game-neon': '220 90% 65%',
    },
  },
  {
    id: 'inferno',
    name: 'Inferno',
    emoji: '🔥',
    unlockScore: 300,
    description: 'Volcanic reds and embers',
    vars: {
      '--background': '0 30% 6%',
      '--foreground': '30 100% 92%',
      '--card': '0 30% 11%',
      '--primary': '15 100% 55%',
      '--secondary': '350 90% 55%',
      '--accent': '40 100% 55%',
      '--game-glow': '15 100% 55%',
      '--game-neon': '350 90% 55%',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    emoji: '🟢',
    unlockScore: 500,
    description: 'Pure green hacker terminal',
    vars: {
      '--background': '120 20% 4%',
      '--foreground': '120 100% 85%',
      '--card': '120 25% 8%',
      '--primary': '120 100% 50%',
      '--secondary': '140 100% 45%',
      '--accent': '90 100% 55%',
      '--game-glow': '120 100% 50%',
      '--game-neon': '140 100% 45%',
    },
  },
  {
    id: 'royal',
    name: 'Royal Gold',
    emoji: '👑',
    unlockScore: 800,
    description: 'Luxurious gold and purple',
    vars: {
      '--background': '270 40% 8%',
      '--foreground': '45 100% 92%',
      '--card': '270 40% 13%',
      '--primary': '45 100% 55%',
      '--secondary': '270 80% 60%',
      '--accent': '320 90% 60%',
      '--game-glow': '45 100% 55%',
      '--game-neon': '270 80% 60%',
    },
  },
];

const THEME_KEY = 'falling-fingers-theme';
const BEST_KEY = 'falling-fingers-high';

export function getActiveThemeId(): string {
  return localStorage.getItem(THEME_KEY) || 'neon';
}

export function setActiveThemeId(id: string) {
  localStorage.setItem(THEME_KEY, id);
  applyTheme(id);
}

export function isThemeUnlocked(theme: Theme): boolean {
  const best = parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
  return best >= theme.unlockScore;
}

export function applyTheme(id: string) {
  const theme = THEMES.find(t => t.id === id) || THEMES[0];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function getNextUnlock(currentBest: number): Theme | null {
  return THEMES.find(t => t.unlockScore > currentBest) || null;
}

export function checkNewlyUnlocked(prevBest: number, newBest: number): Theme[] {
  return THEMES.filter(t => t.unlockScore > prevBest && t.unlockScore <= newBest);
}
