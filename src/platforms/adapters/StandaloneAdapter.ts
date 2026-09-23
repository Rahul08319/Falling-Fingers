import { GamePlatformBridge, PlatformCapabilities } from '../types';

export class StandaloneAdapter implements GamePlatformBridge {
  readonly id = 'standalone';
  readonly name = 'Standalone Web / Local Mock';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: true,
    environmentName: 'Standalone Web Environment',
  };

  private audioListeners: ((enabled: boolean) => void)[] = [];
  private audioEnabled = true;

  async initialize(): Promise<void> {}
  notifyFirstFrame(): void {}
  notifyGameReady(): void {}

  async saveData(data: string): Promise<void> {
    try {
      localStorage.setItem('falling-fingers-save-data', data);
    } catch {
      // ignore
    }
  }

  async loadData(): Promise<string | null> {
    try {
      return localStorage.getItem('falling-fingers-save-data');
    } catch {
      return null;
    }
  }

  async sendScore(score: number): Promise<void> {
    console.log('[Standalone] Score recorded:', score);
  }

  async showInterstitialAd(): Promise<boolean> {
    console.log('[Standalone Mock] Interstitial Ad played');
    return true;
  }

  async showRewardedAd(rewardId: string): Promise<boolean> {
    console.log('[Standalone Mock] Rewarded Ad watched for reward:', rewardId);
    return true;
  }

  isAudioEnabled(): boolean {
    return this.audioEnabled;
  }

  setAudioEnabled(enabled: boolean): void {
    this.audioEnabled = enabled;
    this.audioListeners.forEach((l) => l(enabled));
  }

  onAudioEnabledChange(cb: (enabled: boolean) => void): () => void {
    this.audioListeners.push(cb);
    return () => {
      this.audioListeners = this.audioListeners.filter((l) => l !== cb);
    };
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
    console.warn('[Standalone]', msg);
  }

  logError(err?: unknown): void {
    console.error('[Standalone]', err);
  }
}
