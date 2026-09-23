import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    YaGames?: {
      init(): Promise<{
        features?: { LoadingAPI?: { ready(): void } };
        environment?: { i18n?: { lang?: string } };
        getPlayer?: () => Promise<{
          setData(data: Record<string, unknown>): Promise<void>;
          getData(keys?: string[]): Promise<Record<string, unknown>>;
        }>;
        adv: {
          showFullscreenAdv(callbacks: { onOpen?: () => void; onClose?: (wasShown: boolean) => void; onError?: (err: unknown) => void }): void;
          showRewardedVideo(callbacks: { onOpen?: () => void; onRewarded?: () => void; onClose?: () => void; onError?: (err: unknown) => void }): void;
        };
        getLeaderboards?: () => Promise<{
          setLeaderboardScore(name: string, score: number): Promise<void>;
        }>;
      }>;
    };
  }
}

export class YandexAdapter implements GamePlatformBridge {
  readonly id = 'yandex';
  readonly name = 'Yandex Games';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'Yandex Games SDK (YaGames)',
  };

  private ysdk: any = null;
  private player: any = null;

  async initialize(): Promise<void> {
    if (typeof window !== 'undefined' && window.YaGames) {
      try {
        this.ysdk = await window.YaGames.init();
        if (this.ysdk.getPlayer) {
          this.player = await this.ysdk.getPlayer().catch(() => null);
        }
      } catch (e) {
        this.logWarning('Yandex init error: ' + String(e));
      }
    }
  }

  notifyFirstFrame(): void {}

  notifyGameReady(): void {
    if (this.ysdk?.features?.LoadingAPI?.ready) {
      this.ysdk.features.LoadingAPI.ready();
    }
  }

  async saveData(data: string): Promise<void> {
    if (this.player?.setData) {
      try {
        await this.player.setData({ gameSave: data });
        return;
      } catch {
        // fallback
      }
    }
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    if (this.player?.getData) {
      try {
        const res = await this.player.getData(['gameSave']);
        if (res && typeof res.gameSave === 'string') return res.gameSave;
      } catch {
        // fallback
      }
    }
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(score: number): Promise<void> {
    if (this.ysdk?.getLeaderboards) {
      try {
        const lb = await this.ysdk.getLeaderboards();
        await lb.setLeaderboardScore('falling_fingers_high', Math.floor(score));
      } catch (e) {
        this.logWarning('Yandex leaderboard error: ' + String(e));
      }
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.ysdk?.adv?.showFullscreenAdv) return false;
    return new Promise((resolve) => {
      this.ysdk.adv.showFullscreenAdv({
        onClose: (wasShown: boolean) => resolve(wasShown),
        onError: () => resolve(false),
      });
    });
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.ysdk?.adv?.showRewardedVideo) return false;
    return new Promise((resolve) => {
      let earned = false;
      this.ysdk.adv.showRewardedVideo({
        onRewarded: () => { earned = true; },
        onClose: () => resolve(earned),
        onError: () => resolve(false),
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
    if (this.ysdk?.environment?.i18n?.lang) {
      return this.ysdk.environment.i18n.lang;
    }
    return typeof navigator !== 'undefined' ? navigator.language : 'ru';
  }

  logWarning(msg?: string): void {
    console.warn('[Yandex]', msg);
  }

  logError(err?: unknown): void {
    console.error('[Yandex]', err);
  }
}
