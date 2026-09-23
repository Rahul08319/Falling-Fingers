import { GamePlatformBridge, PlatformCapabilities } from '../types';

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: {
        init(): Promise<void>;
        game: {
          loadingStart(): void;
          loadingStop(): void;
          gameplayStart(): void;
          gameplayStop(): void;
        };
        ad: {
          requestAd(type: 'midgame' | 'rewarded', callbacks?: {
            adStarted?: () => void;
            adFinished?: () => void;
            adError?: (error: unknown) => void;
          }): Promise<void>;
        };
        data?: {
          setItem(key: string, value: string): Promise<void>;
          getItem(key: string): Promise<string | null>;
        };
      };
    };
  }
}

export class CrazyGamesAdapter implements GamePlatformBridge {
  readonly id = 'crazygames';
  readonly name = 'CrazyGames';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: false,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: false,
    environmentName: 'CrazyGames SDK v3',
  };

  private isCrazy(): boolean {
    return typeof window !== 'undefined' && Boolean(window.CrazyGames?.SDK);
  }

  async initialize(): Promise<void> {
    if (this.isCrazy()) {
      try {
        await window.CrazyGames!.SDK!.init();
        window.CrazyGames!.SDK!.game.loadingStart();
      } catch (e) {
        this.logWarning('CrazyGames init error: ' + String(e));
      }
    }
  }

  notifyFirstFrame(): void {}

  notifyGameReady(): void {
    if (this.isCrazy()) {
      window.CrazyGames?.SDK?.game.loadingStop();
      window.CrazyGames?.SDK?.game.gameplayStart();
    }
  }

  async saveData(data: string): Promise<void> {
    if (this.isCrazy() && window.CrazyGames?.SDK?.data) {
      try {
        await window.CrazyGames.SDK.data.setItem('falling-fingers-save', data);
        return;
      } catch {
        // fallback
      }
    }
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    if (this.isCrazy() && window.CrazyGames?.SDK?.data) {
      try {
        const val = await window.CrazyGames.SDK.data.getItem('falling-fingers-save');
        if (val) return val;
      } catch {
        // fallback
      }
    }
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(_score: number): Promise<void> {}

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isCrazy()) return false;
    return new Promise((resolve) => {
      window.CrazyGames?.SDK?.game.gameplayStop();
      window.CrazyGames?.SDK?.ad.requestAd('midgame', {
        adFinished: () => {
          window.CrazyGames?.SDK?.game.gameplayStart();
          resolve(true);
        },
        adError: () => {
          window.CrazyGames?.SDK?.game.gameplayStart();
          resolve(false);
        },
      });
    });
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    if (!this.isCrazy()) return false;
    return new Promise((resolve) => {
      window.CrazyGames?.SDK?.game.gameplayStop();
      let earned = false;
      window.CrazyGames?.SDK?.ad.requestAd('rewarded', {
        adStarted: () => { earned = true; },
        adFinished: () => {
          window.CrazyGames?.SDK?.game.gameplayStart();
          resolve(earned);
        },
        adError: () => {
          window.CrazyGames?.SDK?.game.gameplayStart();
          resolve(false);
        },
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
    return typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  }

  logWarning(msg?: string): void {
    console.warn('[CrazyGames]', msg);
  }

  logError(err?: unknown): void {
    console.error('[CrazyGames]', err);
  }
}
