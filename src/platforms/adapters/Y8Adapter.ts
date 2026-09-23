import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    ID?: {
      init(options: any): void;
      GameScores: {
        submit(scoreObj: { score: number; table: string }, callback?: (res: any) => void): void;
      };
      Ads: {
        display(callback?: (res: any) => void): void;
      };
    };
  }
}

export class Y8Adapter implements GamePlatformBridge {
  readonly id = 'y8';
  readonly name = 'Y8 / ID.net';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: false,
    hasCloudSave: false,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'Y8 Games (ID.net SDK)',
  };

  private isY8(): boolean {
    return typeof window !== 'undefined' && Boolean(window.ID);
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
    if (this.isY8() && window.ID?.GameScores?.submit) {
      window.ID.GameScores.submit({ score: Math.floor(score), table: 'Leaderboard' });
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isY8() || !window.ID?.Ads?.display) return false;
    return new Promise((resolve) => {
      window.ID!.Ads.display(() => resolve(true));
    });
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    return false;
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
    console.warn('[Y8]', msg);
  }

  logError(err?: unknown): void {
    console.error('[Y8]', err);
  }
}
