import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    JioGames?: {
      init?: (callbacks: any) => void;
      postScore?: (score: number) => void;
      showAd?: (type: string, callbacks: any) => void;
      cacheAd?: (type: string) => void;
    };
  }
}

export class JioGamesAdapter implements GamePlatformBridge {
  readonly id = 'jiogames';
  readonly name = 'JioGames';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: false,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'JioGames HTML5 SDK',
  };

  private isJio(): boolean {
    return typeof window !== 'undefined' && Boolean(window.JioGames);
  }

  async initialize(): Promise<void> {
    if (this.isJio() && window.JioGames?.init) {
      window.JioGames.init({});
    }
  }

  notifyFirstFrame(): void {}
  notifyGameReady(): void {}

  async saveData(data: string): Promise<void> {
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(score: number): Promise<void> {
    if (this.isJio() && window.JioGames?.postScore) {
      window.JioGames.postScore(Math.floor(score));
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isJio() || !window.JioGames?.showAd) return false;
    return new Promise((resolve) => {
      window.JioGames!.showAd!('interstitial', {
        onAdClosed: () => resolve(true),
        onAdFailed: () => resolve(false),
      });
    });
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.isJio() || !window.JioGames?.showAd) return false;
    return new Promise((resolve) => {
      let earned = false;
      window.JioGames!.showAd!('rewarded', {
        onRewarded: () => { earned = true; },
        onAdClosed: () => resolve(earned),
        onAdFailed: () => resolve(false),
      });
    });
  }

  isAudioEnabled(): boolean {
    return true;
  }

  onAudioEnabledChange(_cb: (enabled: boolean) => void): () => void {
    return () => {};
  }

  onPause(cb: () => void): () => void {
    window.addEventListener('blur', cb);
    return () => window.removeEventListener('blur', cb);
  }

  onResume(cb: () => void): () => void {
    window.addEventListener('focus', cb);
    return () => window.removeEventListener('focus', cb);
  }

  async getLanguage(): Promise<string | null> {
    return typeof navigator !== 'undefined' ? navigator.language : 'en-IN';
  }

  logWarning(msg?: string): void {
    console.warn('[JioGames]', msg);
  }

  logError(err?: unknown): void {
    console.error('[JioGames]', err);
  }
}
