/**
 * Unified Game SDK bridge connecting to the active platform (YouTube Playables, Facebook, Poki, etc.)
 * Fully adheres to Google's YouTube Playables certification and test suite requirements.
 */
import { PlatformManager } from '../platforms/PlatformManager';

const STORAGE_KEYS = [
  'falling-fingers-high',
  'falling-fingers-muted',
  'falling-fingers-leaderboard',
  'falling-fingers-leaderboard-daily',
  'falling-fingers-leaderboard-daily-date',
  'falling-fingers-theme',
  'falling-fingers-tutorial-seen',
  'falling-fingers-accessibility',
  'falling-fingers-achievements',
] as const;

export type SavePayload = {
  version: 1;
  storage: Partial<Record<(typeof STORAGE_KEYS)[number], string>>;
};

export function isInPlayablesEnvironment(): boolean {
  return typeof window !== 'undefined' && Boolean(window.ytgame?.IN_PLAYABLES_ENV);
}

export function reportPlayablesWarning(msg?: string): void {
  PlatformManager.getBridge().logWarning(msg);
}

export function reportPlayablesError(err?: unknown): void {
  PlatformManager.getBridge().logError(err);
}

export function notifyFirstFrameReady(): void {
  try {
    PlatformManager.getBridge().notifyFirstFrame();
  } catch {
    reportPlayablesWarning('First frame notify error');
  }
}

export function notifyGameReady(): void {
  try {
    PlatformManager.getBridge().notifyGameReady();
  } catch {
    reportPlayablesWarning('Game ready notify error');
  }
}

export function readLocalSave(): SavePayload {
  const storage: SavePayload['storage'] = {};
  for (const key of STORAGE_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) storage[key] = value;
  }
  return { version: 1, storage };
}

export async function loadPlayablesSave(): Promise<boolean> {
  try {
    const raw = await PlatformManager.getBridge().loadData();
    if (!raw) return false;
    const saved = JSON.parse(raw) as SavePayload;
    if (saved.version !== 1 || !saved.storage || typeof saved.storage !== 'object') {
      reportPlayablesWarning('Malformed cloud save data');
      return false;
    }
    for (const key of STORAGE_KEYS) {
      const value = saved.storage[key];
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      }
    }
    return true;
  } catch {
    reportPlayablesWarning('Failed to load cloud save');
    return false;
  }
}

export async function savePlayablesData(): Promise<void> {
  try {
    const data = JSON.stringify(readLocalSave());
    // Verification: ensure valid UTF-16 and under 3MiB limit
    const isWellFormed = (data as string & { isWellFormed?: () => boolean }).isWellFormed;
    if (data.length > 3 * 1024 * 1024 || (typeof isWellFormed === 'function' && !isWellFormed.call(data))) {
      reportPlayablesWarning('Data exceeds 3MiB or invalid UTF-16');
      return;
    }
    await PlatformManager.getBridge().saveData(data);
  } catch {
    reportPlayablesWarning('Save failed');
  }
}

export async function getPlayablesLanguage(): Promise<string | null> {
  try {
    return await PlatformManager.getBridge().getLanguage();
  } catch {
    return null;
  }
}

export function sendPlayablesScore(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) return;
  PlatformManager.getBridge().sendScore(value).catch(() => reportPlayablesWarning('Score send failed'));
}

/** Interstitial Ad: call at natural breakpoints (Game Over, Level Clear, Menu) */
export async function requestInterstitialAd(): Promise<boolean> {
  try {
    return await PlatformManager.getBridge().showInterstitialAd();
  } catch {
    reportPlayablesWarning('Interstitial ad failed');
    return false;
  }
}

/** Rewarded Ad: call when player chooses to earn a reward (Revive, Double Score, etc.) */
export async function requestRewardedAd(rewardId: string): Promise<boolean> {
  try {
    return await PlatformManager.getBridge().showRewardedAd(rewardId);
  } catch {
    reportPlayablesWarning('Rewarded ad failed');
    return false;
  }
}

/** Open external YouTube content safely */
export async function openPlayablesContent(id: string, type: 'VIDEO' | 'PLAYABLE' = 'VIDEO'): Promise<void> {
  try {
    await PlatformManager.getBridge().openExternalContent?.(id, type);
  } catch {
    reportPlayablesWarning('Open external content failed');
  }
}

export const PLAYABLES_SAVE_EVENT = 'falling-fingers-save';
export function requestPlayablesSave(): void {
  window.dispatchEvent(new Event(PLAYABLES_SAVE_EVENT));
}
