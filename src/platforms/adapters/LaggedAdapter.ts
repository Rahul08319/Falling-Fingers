import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    LaggedAPI?: {
      init(devId: string, pubId: string): void;
      Scores: {
        save(scoreObj: { score: number; board: string }, cb?: (res: any) => void): void;
      };
      showAd(): void;
      showRewardedAd(cb?: (success: boolean) => void): void;
    };
  }
}

export class LaggedAdapter implements GamePlatformBridge {
  readonly id = 'lagged';
  readonly name = 'Lagged';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: false,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'Lagged Games API',
  };

  private isLagged(): boolean {
    return typeof window !== 'undefined' && Boolean(window.LaggedAPI);
  }

  async initialize(): Promise<void> {}
  notifyFirstFrame(): void {}
  notifyGameReady(): void {}

  async saveData(data: string): Promise<void> {
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(score: number): Promise<void> {
    if (this.isLagged() && window.LaggedAPI?.Scores?.save) {
      window.LaggedAPI.Scores.save({ score: Math.floor(score), board: 'high_score' });
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isLagged() || !window.LaggedAPI?.showAd) return false;
    window.LaggedAPI.showAd();
    return true;
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.isLagged() || !window.LaggedAPI?.showRewardedAd) return false;
    return new Promise((resolve) => {
      window.LaggedAPI!.showRewardedAd!((success) => resolve(Boolean(success)));
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
    return typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  }

  logWarning(msg?: string): void {
    console.warn('[Lagged]', msg);
  }

  logError(err?: unknown): void {
    console.error('[Lagged]', err);
  }
}
