import { requestPlayablesSave } from './playables';

const ACCESSIBILITY_KEY = 'falling-fingers-accessibility';
const ACHIEVEMENTS_KEY = 'falling-fingers-achievements';

export type AccessibilitySettings = {
  largerTargets: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  haptics: boolean;
};

export const defaultAccessibility: AccessibilitySettings = {
  largerTargets: false,
  highContrast: false,
  reducedMotion: false,
  haptics: true,
};

export const ACHIEVEMENTS = [
  { id: 'first-fix', emoji: '🩹', name: 'First Aid', description: 'Fix your first broken finger.' },
  { id: 'combo-10', emoji: '🔥', name: 'On Fire', description: 'Reach a 10-finger combo.' },
  { id: 'score-50', emoji: '⭐', name: 'Rising Star', description: 'Score 50 points in one run.' },
  { id: 'boss-clear', emoji: '🖐️', name: 'Palm Pilot', description: 'Clear a boss wave.' },
  { id: 'daily-finish', emoji: '📅', name: 'Daily Doer', description: 'Finish a Daily Challenge.' },
] as const;

export function getAccessibility(): AccessibilitySettings {
  try {
    return { ...defaultAccessibility, ...JSON.parse(localStorage.getItem(ACCESSIBILITY_KEY) || '{}') };
  } catch {
    return defaultAccessibility;
  }
}

export function applyAccessibility(settings: AccessibilitySettings): void {
  const root = document.documentElement;
  root.dataset.highContrast = String(settings.highContrast);
  root.dataset.reducedMotion = String(settings.reducedMotion);
}

export function saveAccessibility(settings: AccessibilitySettings): void {
  localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(settings));
  applyAccessibility(settings);
  requestPlayablesSave();
}

export function getAchievements(): string[] {
  try { return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]'); }
  catch { return []; }
}

export function unlockAchievement(id: string): boolean {
  const unlocked = getAchievements();
  if (unlocked.includes(id)) return false;
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...unlocked, id]));
  requestPlayablesSave();
  return true;
}
