import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    gdsdk?: {
      showAd(type?: 'rewarded'): Promise<void>;
      play(): void;
      pause(): void;
    };
  }
}

export class GameDistAdapter implements GamePlatformBridge {
  readonly id = 'gamedistribution';
  readonly name = 'GameDistribution';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: false,
    hasLeaderboard: false,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'GameDistribution HTML5 SDK',
  };

  private isGD(): boolean {
    return typeof window !== 'undefined' && Boolean(window.gdsdk);
  }

  async initialize(): Promise<void> {}
  notifyFirstFrame(): void {}
  notifyGameReady(): void {
    if (this.isGD()) {
      window.gdsdk?.play();
    }
  }

  async saveData(data: string): Promise<void> {
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(_score: number): Promise<void> {}

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isGD()) return false;
    try {
      await window.gdsdk?.showAd();
      return true;
    } catch {
      return false;
    }
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.isGD()) return false;
    try {
      await window.gdsdk?.showAd('rewarded');
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
    console.warn('[GameDistribution]', msg);
  }

  logError(err?: unknown): void {
    console.error('[GameDistribution]', err);
  }
}
