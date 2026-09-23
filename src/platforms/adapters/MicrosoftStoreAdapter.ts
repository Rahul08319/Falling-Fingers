import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    Windows?: any;
  }
}

export class MicrosoftStoreAdapter implements GamePlatformBridge {
  readonly id = 'msstore';
  readonly name = 'Microsoft Store (PWA)';
  readonly capabilities: PlatformCapabilities = {
    hasAds: false,
    hasRewardedAds: false,
    hasCloudSave: true,
    hasLeaderboard: false,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: true,
    environmentName: 'Windows PWA / Microsoft Store Host',
  };

  async initialize(): Promise<void> {
    // Register Service Worker for offline play if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
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

  async sendScore(_score: number): Promise<void> {}

  async showInterstitialAd(): Promise<boolean> {
    return false;
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    return true; // Unlocked perks for full store app
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
    console.warn('[MS Store]', msg);
  }

  logError(err?: unknown): void {
    console.error('[MS Store]', err);
  }
}
