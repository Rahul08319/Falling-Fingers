import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    FBInstant?: {
      initializeAsync(): Promise<void>;
      startGameAsync(): Promise<void>;
      setLoadingProgress(percentage: number): void;
      getLocale(): string;
      player: {
        getID(): string;
        getName(): string;
        getDataAsync(keys: string[]): Promise<Record<string, unknown>>;
        setDataAsync(data: Record<string, unknown>): Promise<void>;
      };
      getLeaderboardAsync(name: string): Promise<{
        setScoreAsync(score: number, extraData?: string): Promise<void>;
      }>;
      getInterstitialAdAsync(placementId: string): Promise<{
        loadAsync(): Promise<void>;
        showAsync(): Promise<void>;
      }>;
      getRewardedVideoAsync(placementId: string): Promise<{
        loadAsync(): Promise<void>;
        showAsync(): Promise<void>;
      }>;
      onPause(cb: () => void): void;
    };
  }
}

export class FacebookInstantAdapter implements GamePlatformBridge {
  readonly id = 'facebook';
  readonly name = 'Facebook Instant Games';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: true,
    hasAudioControl: false,
    hasPauseControl: true,
    hasSocialShare: true,
    environmentName: 'Facebook Instant Games v7.1',
  };

  private isFB(): boolean {
    return typeof window !== 'undefined' && Boolean(window.FBInstant);
  }

  async initialize(): Promise<void> {
    if (this.isFB()) {
      try {
        await window.FBInstant!.initializeAsync();
        window.FBInstant!.setLoadingProgress(100);
      } catch (e) {
        this.logWarning('FBInstant init error: ' + String(e));
      }
    }
  }

  notifyFirstFrame(): void {
    if (this.isFB()) {
      window.FBInstant?.setLoadingProgress(50);
    }
  }

  notifyGameReady(): void {
    if (this.isFB()) {
      window.FBInstant?.startGameAsync().catch((err) => this.logWarning('FBInstant startGameAsync failed: ' + String(err)));
    }
  }

  async saveData(data: string): Promise<void> {
    if (this.isFB()) {
      try {
        await window.FBInstant!.player.setDataAsync({ gameSave: data });
        return;
      } catch (e) {
        this.logWarning('FBInstant setDataAsync failed: ' + String(e));
      }
    }
    try {
      localStorage.setItem('falling-fingers-save-data', data);
    } catch {
      // ignore
    }
  }

  async loadData(): Promise<string | null> {
    if (this.isFB()) {
      try {
        const res = await window.FBInstant!.player.getDataAsync(['gameSave']);
        if (res && typeof res.gameSave === 'string') {
          return res.gameSave;
        }
      } catch (e) {
        this.logWarning('FBInstant getDataAsync failed: ' + String(e));
      }
    }
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(score: number): Promise<void> {
    if (this.isFB()) {
      try {
        const lb = await window.FBInstant!.getLeaderboardAsync('Global_Scores');
        await lb.setScoreAsync(Math.floor(score));
      } catch (e) {
        this.logWarning('FBInstant leaderboard error: ' + String(e));
      }
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isFB()) return false;
    try {
      const ad = await window.FBInstant!.getInterstitialAdAsync('FALLING_FINGERS_INTERSTITIAL');
      await ad.loadAsync();
      await ad.showAsync();
      return true;
    } catch {
      return false;
    }
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.isFB()) return false;
    try {
      const ad = await window.FBInstant!.getRewardedVideoAsync('FALLING_FINGERS_REWARDED');
      await ad.loadAsync();
      await ad.showAsync();
      return true;
    } catch {
      return false;
    }
  }

  isAudioEnabled(): boolean {
    return true;
  }

  onAudioEnabledChange(_cb: (enabled: boolean) => void): () => void {
    return () => {};
  }

  onPause(cb: () => void): () => void {
    if (this.isFB()) {
      try {
        window.FBInstant?.onPause(cb);
      } catch {
        // ignore
      }
    }
    return () => {};
  }

  onResume(_cb: () => void): () => void {
    return () => {};
  }

  async getLanguage(): Promise<string | null> {
    if (this.isFB()) {
      try {
        return window.FBInstant!.getLocale();
      } catch {
        // ignore
      }
    }
    return typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  }

  logWarning(msg?: string): void {
    console.warn('[FacebookInstant]', msg);
  }

  logError(err?: unknown): void {
    console.error('[FacebookInstant]', err);
  }
}
