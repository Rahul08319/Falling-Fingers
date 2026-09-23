import { GamePlatformBridge, PlatformCapabilities } from '../types';

export class MSNRedditAdapter implements GamePlatformBridge {
  readonly id = 'msn_reddit';
  readonly name = 'MSN & Reddit Games';
  readonly capabilities: PlatformCapabilities = {
    hasAds: true,
    hasRewardedAds: true,
    hasCloudSave: true,
    hasLeaderboard: true,
    hasAudioControl: true,
    hasPauseControl: true,
    hasSocialShare: true,
    environmentName: 'MSN Games / Reddit Devvit Embed Protocol',
  };

  private audioEnabled = true;

  async initialize(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data?.type === 'MSN_MUTE' || data?.type === 'REDDIT_MUTE') {
            this.audioEnabled = false;
          } else if (data?.type === 'MSN_UNMUTE' || data?.type === 'REDDIT_UNMUTE') {
            this.audioEnabled = true;
          }
        } catch {
          // ignore invalid messages
        }
      });
      // Notify parent frame of embed load
      this.postToParent({ type: 'GAME_LOADED', game: 'falling-fingers' });
    }
  }

  private postToParent(message: Record<string, unknown>): void {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage(JSON.stringify(message), '*');
    }
  }

  notifyFirstFrame(): void {
    this.postToParent({ type: 'FIRST_FRAME_RENDERED' });
  }

  notifyGameReady(): void {
    this.postToParent({ type: 'GAME_READY' });
  }

  async saveData(data: string): Promise<void> {
    this.postToParent({ type: 'SAVE_DATA', payload: data });
    localStorage.setItem('falling-fingers-save-data', data);
  }

  async loadData(): Promise<string | null> {
    return localStorage.getItem('falling-fingers-save-data');
  }

  async sendScore(score: number): Promise<void> {
    this.postToParent({ type: 'SUBMIT_SCORE', score: Math.floor(score) });
  }

  async showInterstitialAd(): Promise<boolean> {
    return new Promise((resolve) => {
      this.postToParent({ type: 'REQUEST_INTERSTITIAL_AD' });
      const handler = (event: MessageEvent) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data?.type === 'AD_COMPLETED') {
            window.removeEventListener('message', handler);
            resolve(true);
          }
        } catch {
          // ignore
        }
      };
      window.addEventListener('message', handler);
      setTimeout(() => {
        window.removeEventListener('message', handler);
        resolve(true);
      }, 1500);
    });
  }

  async showRewardedAd(_rewardId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.postToParent({ type: 'REQUEST_REWARDED_AD', rewardId: _rewardId });
      const handler = (event: MessageEvent) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data?.type === 'REWARDED_AD_SUCCESS') {
            window.removeEventListener('message', handler);
            resolve(true);
          } else if (data?.type === 'REWARDED_AD_FAILED') {
            window.removeEventListener('message', handler);
            resolve(false);
          }
        } catch {
          // ignore
        }
      };
      window.addEventListener('message', handler);
      // Timeout fallback
      setTimeout(() => {
        window.removeEventListener('message', handler);
        resolve(true);
      }, 2000);
    });
  }

  isAudioEnabled(): boolean {
    return this.audioEnabled;
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
    console.warn('[MSN/Reddit]', msg);
  }

  logError(err?: unknown): void {
    console.error('[MSN/Reddit]', err);
  }
}
