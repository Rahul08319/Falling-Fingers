/**
 * Non-monetized YouTube Playables integration.
 * The game uses only the lifecycle, audio, save, locale, health, and score APIs.
 */

declare global {
  interface Window {
    ytgame?: {
      IN_PLAYABLES_ENV?: boolean;
      game?: {
        firstFrameReady?: () => void;
        gameReady?: () => void;
        loadData?: () => Promise<string>;
        saveData?: (data: string) => Promise<void>;
      };
      system?: {
        isAudioEnabled?: () => boolean;
        onAudioEnabledChange?: (callback: (enabled: boolean) => void) => (() => void) | void;
        onPause?: (callback: () => void) => (() => void) | void;
        onResume?: (callback: () => void) => (() => void) | void;
        getLanguage?: () => Promise<string>;
      };
      engagement?: { sendScore?: (score: { value: number }) => Promise<void> };
      health?: { reportWarning?: (message?: string) => void; reportError?: (error?: unknown) => void };
    };
  }
}

const STORAGE_KEYS = [
  'falling-fingers-high', 'falling-fingers-muted', 'falling-fingers-leaderboard',
  'falling-fingers-leaderboard-daily', 'falling-fingers-leaderboard-daily-date',
  'falling-fingers-theme', 'falling-fingers-tutorial-seen',
  'falling-fingers-accessibility', 'falling-fingers-achievements',
] as const;

export type SavePayload = { version: 1; storage: Partial<Record<(typeof STORAGE_KEYS)[number], string>> };

const sdk = () => window.ytgame;
export const isInPlayablesEnvironment = () => Boolean(sdk()?.IN_PLAYABLES_ENV);
export const isAudioEnabled = () => sdk()?.system?.isAudioEnabled?.() ?? true;
export const reportPlayablesWarning = (message?: string) => sdk()?.health?.reportWarning?.(message);
export const reportPlayablesError = (error?: unknown) => sdk()?.health?.reportError?.(error);

export function notifyFirstFrameReady(): void {
  try { sdk()?.game?.firstFrameReady?.(); } catch { reportPlayablesWarning('First-frame notification failed'); }
}

export function notifyGameReady(): void {
  try { sdk()?.game?.gameReady?.(); } catch { reportPlayablesWarning('Game-ready notification failed'); }
}

function readLocalSave(): SavePayload {
  const storage: SavePayload['storage'] = {};
  for (const key of STORAGE_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) storage[key] = value;
  }
  return { version: 1, storage };
}

export async function loadPlayablesSave(): Promise<boolean> {
  if (!isInPlayablesEnvironment() || !sdk()?.game?.loadData) return false;
  try {
    const raw = await sdk()!.game!.loadData!();
    if (!raw) return false;
    const saved = JSON.parse(raw) as SavePayload;
    if (saved.version !== 1 || !saved.storage || typeof saved.storage !== 'object') return false;
    for (const key of STORAGE_KEYS) {
      const value = saved.storage[key];
      if (typeof value === 'string') localStorage.setItem(key, value);
    }
    return true;
  } catch {
    reportPlayablesWarning('Could not load saved game data');
    return false;
  }
}

export async function savePlayablesData(): Promise<void> {
  if (!isInPlayablesEnvironment() || !sdk()?.game?.saveData) return;
  try {
    const data = JSON.stringify(readLocalSave());
    const isWellFormed = (data as string & { isWellFormed?: () => boolean }).isWellFormed;
    if (data.length > 3 * 1024 * 1024 || (isWellFormed && !isWellFormed.call(data))) {
      reportPlayablesWarning('Save data is too large or malformed');
      return;
    }
    await sdk()!.game!.saveData!(data);
  } catch {
    reportPlayablesWarning('Could not save game data');
  }
}

export const getPlayablesLanguage = () => sdk()?.system?.getLanguage?.() ?? Promise.resolve(null);

export function sendPlayablesScore(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) return;
  sdk()?.engagement?.sendScore?.({ value }).catch(() => reportPlayablesWarning('Score report failed'));
}

export const PLAYABLES_SAVE_EVENT = 'falling-fingers-save';
export const requestPlayablesSave = () => window.dispatchEvent(new Event(PLAYABLES_SAVE_EVENT));
