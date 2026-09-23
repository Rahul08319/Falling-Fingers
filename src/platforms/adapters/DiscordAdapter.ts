import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    DiscordSDK?: any;
    discordSdk?: any;
  }
}

export class DiscordAdapter implements GamePlatformBridge {
  readonly id = 'discord';
  readonly name = 'Discord Activities';
  readonly capabilities: PlatformCapabilities = {
    hasAds: false,
    hasRewardedAds: false,
    hasCloudSave: true,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: true,
    environmentName: 'Discord Embedded App SDK (Activity)',
  };

  private sdk: any = null;

  async initialize(): Promise<void> {
    if (typeof window !== 'undefined' && (window.DiscordSDK || window.discordSdk)) {
      this.sdk = window.discordSdk || new window.DiscordSDK(process.env.VITE_DISCORD_CLIENT_ID || 'dummy');
      try {
        await this.sdk.ready();
      } catch (e) {
        this.logWarning('Discord SDK ready failed: ' + String(e));
      }
    }
  }

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
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(score: number): Promise<void> {
    // Discord activity status or custom channel postMessage
    console.log('[Discord] Submitted activity score:', score);
  }

  async showInterstitialAd(): Promise<boolean> {
    return false;
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    // Discord activities do not use programmatic interstitial ads; grants rewarded perks directly or via server
    return true;
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
    console.warn('[Discord]', msg);
  }

  logError(err?: unknown): void {
    console.error('[Discord]', err);
  }
}
