/**
 * Unified GamePlatformBridge interface across all 13 supported web & gaming platforms.
 * Completely standalone - ZERO Playgama or third-party aggregator dependency.
 */

export type PlatformId =
  | 'youtube'
  | 'facebook'
  | 'poki'
  | 'crazygames'
  | 'yandex'
  | 'gamedistribution'
  | 'discord'
  | 'jiogames'
  | 'y8'
  | 'lagged'
  | 'msstore'
  | 'quickgame'
  | 'msn_reddit'
  | 'standalone';

export interface PlatformCapabilities {
  hasAds: boolean;
  hasRewardedAds: boolean;
  hasCloudSave: boolean;
  hasLeaderboard: boolean;
  hasAudioControl: boolean;
  hasPauseControl: boolean;
  hasSocialShare: boolean;
  environmentName: string;
}

export interface GamePlatformBridge {
  readonly id: PlatformId;
  readonly name: string;
  readonly capabilities: PlatformCapabilities;

  /** Initialize platform SDK (load scripts, authenticate, fetch initial player state) */
  initialize(): Promise<void>;

  /** Inform platform that the first graphical frame has rendered */
  notifyFirstFrame(): void;

  /** Inform platform that gameplay or main menu is now fully interactive */
  notifyGameReady(): void;

  /** Save serialized game data to platform cloud (or localStorage fallback) */
  saveData(data: string): Promise<void>;

  /** Load serialized game data from platform cloud (or localStorage fallback) */
  loadData(): Promise<string | null>;

  /** Submit leaderboard score (must be integer) */
  sendScore(score: number): Promise<void>;

  /** Request interstitial ad at natural breakpoint (Game Over, Level Clear, Menu) */
  showInterstitialAd(): Promise<boolean>;

  /** Request rewarded ad for in-game perk (revive life, double coins, skin unlock) */
  showRewardedAd(rewardId: string): Promise<boolean>;

  /** Current system audio enabled status */
  isAudioEnabled(): boolean;

  /** Subscribe to platform audio toggles (e.g. YouTube player or Facebook mute toggle) */
  onAudioEnabledChange(cb: (enabled: boolean) => void): () => void;

  /** Subscribe to platform pause events (e.g. tab switched, overlay opened) */
  onPause(cb: () => void): () => void;

  /** Subscribe to platform resume events */
  onResume(cb: () => void): () => void;

  /** Get user's preferred language (BCP-47 tag, e.g. "en-US") */
  getLanguage(): Promise<string | null>;

  /** Optional external content link (e.g. YouTube video / channel) */
  openExternalContent?(id: string, type?: 'VIDEO' | 'PLAYABLE'): Promise<void>;

  /** Telemetry warnings and errors */
  logWarning(msg?: string): void;
  logError(err?: unknown): void;
}
