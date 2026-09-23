import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    ytgame?: {
      IN_PLAYABLES_ENV?: boolean;
      SDK_VERSION?: string;
      game?: {
        firstFrameReady?: () => void;
        gameReady?: () => void;
        loadData?: () => Promise<string>;
        saveData?: (data: string) => Promise<void>;
      };
      system?: {
        isAudioEnabled?: () => boolean;
        onAudioEnabledChange?: (callback: (enabled: boolean) => void) => () => void;
        onPause?: (callback: () => void) => () => void;
        onResume?: (callback: () => void) => () => void;
        getLanguage?: () => Promise<string>;
      };
      engagement?: {
        sendScore?: (score: { value: number }) => Promise<void>;
        openYTContent?: (content: { id: string; contentType?: 'VIDEO' | 'PLAYABLE' }) => Promise<void>;
      };
      health?: {
        logError?: () => void;
        logWarning?: () => void;
      };
      ads?: {
        requestInterstitialAd?: () => Promise<void>;
        requestRewardedAd?: (rewardId: string) => Promise<boolean>;
      };
    };
  }
}

export class YouTubePlayablesAdapter implements GamePlatformBridge {
  readonly id = 'youtube';
  readonly name = 'YouTube Playables';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'YouTube Playables Environment',
  };

  private get sdk() {
    return window.ytgame;
  }

  private isPlayablesEnv(): boolean {
    return Boolean(typeof window !== 'undefined' && window.ytgame && window.ytgame.IN_PLAYABLES_ENV);
  }

  async initialize(): Promise<void> {
    // YouTube SDK loads synchronously via <script src="https://www.youtube.com/game_api/v1"></script>
    if (this.isPlayablesEnv()) {
      // SDK initialized
    }
  }

  notifyFirstFrame(): void {
    try {
      this.sdk?.game?.firstFrameReady?.();
    } catch {
      this.logWarning('firstFrameReady error');
    }
  }

  notifyGameReady(): void {
    try {
      this.sdk?.game?.gameReady?.();
    } catch {
      this.logWarning('gameReady error');
    }
  }

  async saveData(data: string): Promise<void> {
    if (!this.isPlayablesEnv() || !this.sdk?.game?.saveData) {
      try {
        localStorage.setItem('falling-fingers-save-data', data);
      } catch {
        // storage quota exceeded
      }
      return;
    }

    try {
      // YouTube Playables specification: must be valid UTF-16 and <= 3 MiB
      const isWellFormed = (data as string & { isWellFormed?: () => boolean }).isWellFormed;
      if (data.length > 3 * 1024 * 1024 || (typeof isWellFormed === 'function' && !isWellFormed.call(data))) {
        this.logWarning('Save data exceeds 3MiB limit or is not well-formed UTF-16');
        return;
      }
      await this.sdk.game.saveData(data);
    } catch {
      this.logWarning('Failed to save data to YouTube cloud');
    }
  }

  async loadData(): Promise<string | null> {
    if (!this.isPlayablesEnv() || !this.sdk?.game?.loadData) {
      try {
        return localStorage.getItem('falling-fingers-save-data');
      } catch {
        return null;
      }
    }

    try {
      const raw = await this.sdk.game.loadData();
      return raw || null;
    } catch {
      this.logWarning('Failed to load data from YouTube cloud');
      return null;
    }
  }

  async sendScore(score: number): Promise<void> {
    if (!Number.isSafeInteger(score) || score < 0) return;
    if (this.isPlayablesEnv() && this.sdk?.engagement?.sendScore) {
      try {
        await this.sdk.engagement.sendScore({ value: Math.floor(score) });
      } catch {
        this.logWarning('Failed to submit score to YouTube');
      }
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isPlayablesEnv() || !this.sdk?.ads?.requestInterstitialAd) {
      return false;
    }

    try {
      await this.sdk.ads.requestInterstitialAd();
      return true;
    } catch {
      this.logWarning('Interstitial ad failed or dismissed');
      return false;
    }
  }

  async showRewardedAd(rewardId: string): Promise<boolean> {
    if (!this.isPlayablesEnv() || !this.sdk?.ads?.requestRewardedAd) {
      return false;
    }

    try {
      // Must pass clean rewardId without user personal info
      const cleanRewardId = rewardId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const earned = await this.sdk.ads.requestRewardedAd(cleanRewardId);
      return Boolean(earned);
    } catch {
      this.logWarning('Rewarded ad request failed');
      return false;
    }
  }

  isAudioEnabled(): boolean {
    if (this.isPlayablesEnv() && this.sdk?.system?.isAudioEnabled) {
      return this.sdk.system.isAudioEnabled();
    }
    return true;
  }

  onAudioEnabledChange(cb: (enabled: boolean) => void): () => void {
    if (this.isPlayablesEnv() && this.sdk?.system?.onAudioEnabledChange) {
      try {
        return this.sdk.system.onAudioEnabledChange(cb) || (() => {});
      } catch {
        return () => {};
      }
    }
    return () => {};
  }

  onPause(cb: () => void): () => void {
    if (this.isPlayablesEnv() && this.sdk?.system?.onPause) {
      try {
        return this.sdk.system.onPause(cb) || (() => {});
      } catch {
        return () => {};
      }
    }
    return () => {};
  }

  onResume(cb: () => void): () => void {
    if (this.isPlayablesEnv() && this.sdk?.system?.onResume) {
      try {
        return this.sdk.system.onResume(cb) || (() => {});
      } catch {
        return () => {};
      }
    }
    return () => {};
  }

  async getLanguage(): Promise<string | null> {
    if (this.isPlayablesEnv() && this.sdk?.system?.getLanguage) {
      try {
        return await this.sdk.system.getLanguage();
      } catch {
        return null;
      }
    }
    return typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  }

  async openExternalContent(id: string, type: 'VIDEO' | 'PLAYABLE' = 'VIDEO'): Promise<void> {
    if (this.isPlayablesEnv() && this.sdk?.engagement?.openYTContent) {
      try {
        await this.sdk.engagement.openYTContent({ id, contentType: type });
      } catch {
        this.logWarning('Failed to open external YouTube content');
      }
    }
  }

  logWarning(msg?: string): void {
    try {
      this.sdk?.health?.logWarning?.();
    } catch {
      // ignore
    }
  }

  logError(err?: unknown): void {
    try {
      this.sdk?.health?.logError?.();
    } catch {
      // ignore
    }
  }
}
