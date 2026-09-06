/** Defensive adapter for the YouTube Playables SDK. Local development keeps
 * using localStorage because the SDK is a no-op outside Playables. */
type YtGame = {
  IN_PLAYABLES_ENV?: boolean;
  game?: { firstFrameReady?: () => void; gameReady?: () => void; loadData?: () => Promise<string>; saveData?: (data: string) => Promise<void> };
  system?: {
    isAudioEnabled?: () => boolean;
    onAudioEnabledChange?: (callback: (enabled: boolean) => void) => () => void;
    onPause?: (callback: () => void) => () => void;
    onResume?: (callback: () => void) => () => void;
    getLanguage?: () => Promise<string>;
  };
  engagement?: { sendScore?: (score: { value: number }) => Promise<void> };
  health?: { logError?: () => void; logWarning?: () => void };
};

declare global { interface Window { ytgame?: YtGame } }

const STORAGE_KEYS = [
  'falling-fingers-high', 'falling-fingers-muted', 'falling-fingers-leaderboard',
  'falling-fingers-leaderboard-daily', 'falling-fingers-leaderboard-daily-date',
  'falling-fingers-theme', 'falling-fingers-tutorial-seen',
  'falling-fingers-accessibility', 'falling-fingers-achievements',
] as const;
type SavePayload = { version: 1; storage: Partial<Record<(typeof STORAGE_KEYS)[number], string>> };

function sdk(): YtGame | undefined { return window.ytgame; }
export function isInPlayablesEnvironment(): boolean { return Boolean(sdk()?.IN_PLAYABLES_ENV); }
export function reportPlayablesWarning(): void { sdk()?.health?.logWarning?.(); }
export function reportPlayablesError(): void { sdk()?.health?.logError?.(); }
export function notifyFirstFrameReady(): void {
  try { sdk()?.game?.firstFrameReady?.(); } catch { reportPlayablesWarning(); }
}
export function notifyGameReady(): void {
  try { sdk()?.game?.gameReady?.(); } catch { reportPlayablesWarning(); }
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
    if (saved.version !== 1 || !saved.storage || typeof saved.storage !== 'object') {
      reportPlayablesWarning();
      return false;
    }
    for (const key of STORAGE_KEYS) {
      const value = saved.storage[key];
      if (typeof value === 'string') localStorage.setItem(key, value);
    }
    return true;
  } catch { reportPlayablesWarning(); return false; }
}

export async function savePlayablesData(): Promise<void> {
  if (!isInPlayablesEnvironment() || !sdk()?.game?.saveData) return;
  try {
    const data = JSON.stringify(readLocalSave());
    const isWellFormed = (data as string & { isWellFormed?: () => boolean }).isWellFormed;
    if (data.length > 3 * 1024 * 1024 || (isWellFormed && !isWellFormed.call(data))) {
      reportPlayablesWarning();
      return;
    }
    await sdk()!.game!.saveData!(data);
  } catch { reportPlayablesWarning(); }
}

export async function getPlayablesLanguage(): Promise<string | null> {
  if (!isInPlayablesEnvironment() || !sdk()?.system?.getLanguage) return null;
  try { return await sdk()!.system!.getLanguage!(); }
  catch { reportPlayablesWarning(); return null; }
}

export function sendPlayablesScore(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0 || !isInPlayablesEnvironment()) return;
  sdk()?.engagement?.sendScore?.({ value }).catch(() => reportPlayablesWarning());
}

export const PLAYABLES_SAVE_EVENT = 'falling-fingers-save';
export function requestPlayablesSave(): void { window.dispatchEvent(new Event(PLAYABLES_SAVE_EVENT)); }
