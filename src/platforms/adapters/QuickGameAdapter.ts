import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    qg?: {
      setStorage?(opts: { key: string; value: string; success?: () => void }): void;
      getStorage?(opts: { key: string; success?: (res: { data: string }) => void }): void;
      createInterstitialAd?(opts: { adUnitId: string }): {
        load(): Promise<void>;
        show(): Promise<void>;
        onClose(cb: () => void): void;
      };
      createRewardedVideoAd?(opts: { adUnitId: string }): {
        load(): Promise<void>;
        show(): Promise<void>;
        onClose(cb: (res: { isEnded: boolean }) => void): void;
      };
      onShow?(cb: () => void): void;
      onHide?(cb: () => void): void;
    };
    hbs?: any;
  }
}

export class QuickGameAdapter implements GamePlatformBridge {
  readonly id = 'quickgame';
  readonly name = 'Huawei & Xiaomi Quick Games';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: false,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'Quick Game Runtime (qg / hbs)',
  };

  private get qg() {
    return typeof window !== 'undefined' ? window.qg : undefined;
  }

  async initialize(): Promise<void> {}
  notifyFirstFrame(): void {}
  notifyGameReady(): void {}

  async saveData(data: string): Promise<void> {
    if (this.qg?.setStorage) {
      this.qg.setStorage({ key: 'falling-fingers-save', value: data });
      return;
    }
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    if (this.qg?.getStorage) {
      return new Promise((resolve) => {
        this.qg!.getStorage!({
          key: 'falling-fingers-save',
          success: (res) => resolve(res.data || null),
        });
      });
    }
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(_score: number): Promise<void> {}

  async showInterstitialAd(): Promise<boolean> {
    if (!this.qg?.createInterstitialAd) return false;
    try {
      const ad = this.qg.createInterstitialAd({ adUnitId: 'qg-interstitial-01' });
      await ad.load();
      await ad.show();
      return true;
    } catch {
      return false;
    }
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.qg?.createRewardedVideoAd) return false;
    return new Promise(async (resolve) => {
      try {
        const ad = this.qg!.createRewardedVideoAd!({ adUnitId: 'qg-rewarded-01' });
        ad.onClose((res) => resolve(Boolean(res?.isEnded)));
        await ad.load();
        await ad.show();
      } catch {
        resolve(false);
      }
    });
  }

  isAudioEnabled(): boolean {
    return true;
  }

  onAudioEnabledChange(_cb: (enabled: boolean) => void): () => void {
    return () => {};
  }

  onPause(cb: () => void): () => void {
    if (this.qg?.onHide) {
      this.qg.onHide(cb);
    }
    return () => {};
  }

  onResume(cb: () => void): () => void {
    if (this.qg?.onShow) {
      this.qg.onShow(cb);
    }
    return () => {};
  }

  async getLanguage(): Promise<string | null> {
    return typeof navigator !== 'undefined' ? navigator.language : 'zh-CN';
  }

  logWarning(msg?: string): void {
    console.warn('[QuickGame]', msg);
  }

  logError(err?: unknown): void {
    console.error('[QuickGame]', err);
  }
}
