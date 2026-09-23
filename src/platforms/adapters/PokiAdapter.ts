import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    PokiSDK?: {
      init(): Promise<void>;
      gameLoadingFinished(): void;
      gameplayStart(): void;
      gameplayStop(): void;
      commercialBreak(): Promise<void>;
      rewardedBreak(): Promise<boolean>;
    };
  }
}

export class PokiAdapter implements GamePlatformBridge {
  readonly id = 'poki';
  readonly name = 'Poki';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: false,
    hasLeaderboard: false,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'Poki Publishing SDK v2',
  };

  private isPoki(): boolean {
    return typeof window !== 'undefined' && Boolean(window.PokiSDK);
  }

  async initialize(): Promise<void> {
    if (this.isPoki()) {
      try {
        await window.PokiSDK!.init();
      } catch (e) {
        this.logWarning('PokiSDK init failed: ' + String(e));
      }
    }
  }

  notifyFirstFrame(): void {}

  notifyGameReady(): void {
    if (this.isPoki()) {
      window.PokiSDK?.gameLoadingFinished();
      window.PokiSDK?.gameplayStart();
    }
  }

  async saveData(data: string): Promise<void> {
    try {
      localStorage.setItem('falling-fingers-save-data', data);
    } catch {
      // ignore
    }
  }

  async loadData(): Promise<string | null> {
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(_score: number): Promise<void> {}

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isPoki()) return false;
    try {
      window.PokiSDK?.gameplayStop();
      await window.PokiSDK?.commercialBreak();
      window.PokiSDK?.gameplayStart();
      return true;
    } catch {
      window.PokiSDK?.gameplayStart();
      return false;
    }
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.isPoki()) return false;
    try {
      window.PokiSDK?.gameplayStop();
      const success = await window.PokiSDK?.rewardedBreak();
      window.PokiSDK?.gameplayStart();
      return Boolean(success);
    } catch {
      window.PokiSDK?.gameplayStart();
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
    console.warn('[Poki]', msg);
  }

  logError(err?: unknown): void {
    console.error('[Poki]', err);
  }
}
