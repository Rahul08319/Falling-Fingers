import { GamePlatformBridge, PlatformId } from './types';
import { YouTubePlayablesAdapter } from './adapters/YouTubePlayables';
import { FacebookInstantAdapter } from './adapters/FacebookInstant';
import { PokiAdapter } from './adapters/PokiAdapter';
import { CrazyGamesAdapter } from './adapters/CrazyGamesAdapter';
import { YandexAdapter } from './adapters/YandexAdapter';
import { GameDistAdapter } from './adapters/GameDistAdapter';
import { DiscordAdapter } from './adapters/DiscordAdapter';
import { JioGamesAdapter } from './adapters/JioGamesAdapter';
import { Y8Adapter } from './adapters/Y8Adapter';
import { LaggedAdapter } from './adapters/LaggedAdapter';
import { MicrosoftStoreAdapter } from './adapters/MicrosoftStoreAdapter';
import { QuickGameAdapter } from './adapters/QuickGameAdapter';
import { MSNRedditAdapter } from './adapters/MSNRedditAdapter';
import { StandaloneAdapter } from './adapters/StandaloneAdapter';

export interface PlatformMetadata {
  id: PlatformId;
  name: string;
  badge: string;
  description: string;
}

export const PLATFORM_REGISTRY: PlatformMetadata[] = [
  { id: 'youtube', name: 'YouTube Playables', badge: '▶️ YT', description: 'Certified YouTube Playables Game API v1 with Ads & Save' },
  { id: 'facebook', name: 'Facebook Instant Games', badge: '🔵 FB', description: 'FBInstant SDK v7.1 social leaderboard & rewarded ads' },
  { id: 'poki', name: 'Poki', badge: '🕹️ Poki', description: 'PokiSDK commercial & rewarded breaks' },
  { id: 'crazygames', name: 'CrazyGames', badge: '🎮 Crazy', description: 'CrazyGames SDK v3 midgame and rewarded ads' },
  { id: 'yandex', name: 'Yandex Games', badge: '🇷🇺 Yandex', description: 'YaGames SDK cloud sync, full-screen & rewarded adv' },
  { id: 'gamedistribution', name: 'GameDistribution', badge: '🌐 GD', description: 'GameDistribution HTML5 publishing SDK' },
  { id: 'discord', name: 'Discord Activities', badge: '💬 Discord', description: 'Discord Embedded App SDK for voice/chat activities' },
  { id: 'jiogames', name: 'JioGames', badge: '🇮🇳 Jio', description: 'JioGames HTML5 SDK ads and cloud score submit' },
  { id: 'y8', name: 'Y8 / ID.net', badge: '🎱 Y8', description: 'Y8 ID.net API scores and ad network' },
  { id: 'lagged', name: 'Lagged', badge: '⚡ Lagged', description: 'Lagged Games high score boards and video ads' },
  { id: 'msstore', name: 'Microsoft Store (PWA)', badge: '🪟 MS Store', description: 'Windows Store PWA offline service worker and app lifecycle' },
  { id: 'quickgame', name: 'Huawei & Xiaomi Quick Games', badge: '📱 QuickGame', description: 'Quick Game (qg/hbs) mobile micro-app standard' },
  { id: 'msn_reddit', name: 'MSN & Reddit Games', badge: '🤖 Reddit/MSN', description: 'PostMessage sandboxed iframe embed protocol' },
  { id: 'standalone', name: 'Standalone Web (Mock)', badge: '💻 Web', description: 'Local development sandbox with simulated ads & storage' },
];

class PlatformManagerClass {
  private activeBridge: GamePlatformBridge;
  private listeners: ((bridge: GamePlatformBridge) => void)[] = [];

  constructor() {
    this.activeBridge = this.createAdapter(this.detectPlatform());
  }

  private detectPlatform(): PlatformId {
    if (typeof window === 'undefined') return 'standalone';

    // 1. Check URL query override (?platform=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPlatform = urlParams.get('platform') as PlatformId | null;
      if (queryPlatform && PLATFORM_REGISTRY.some((p) => p.id === queryPlatform)) {
        return queryPlatform;
      }
    } catch {
      // ignore URL parsing error
    }

    // 2. Check native platform environments
    if (window.ytgame?.IN_PLAYABLES_ENV || Boolean(window.ytgame)) return 'youtube';
    if (Boolean((window as any).FBInstant)) return 'facebook';
    if (Boolean((window as any).PokiSDK)) return 'poki';
    if (Boolean((window as any).CrazyGames?.SDK)) return 'crazygames';
    if (Boolean((window as any).YaGames)) return 'yandex';
    if (Boolean((window as any).gdsdk)) return 'gamedistribution';
    if (Boolean((window as any).DiscordSDK) || Boolean((window as any).discordSdk)) return 'discord';
    if (Boolean((window as any).JioGames)) return 'jiogames';
    if (Boolean((window as any).ID)) return 'y8';
    if (Boolean((window as any).LaggedAPI)) return 'lagged';
    if (Boolean((window as any).qg) || Boolean((window as any).hbs)) return 'quickgame';
    if (Boolean((window as any).Windows)) return 'msstore';
    if (window.parent && window.parent !== window) return 'msn_reddit';

    return 'youtube'; // Default to certified YouTube Playables implementation
  }

  private createAdapter(id: PlatformId): GamePlatformBridge {
    switch (id) {
      case 'youtube': return new YouTubePlayablesAdapter();
      case 'facebook': return new FacebookInstantAdapter();
      case 'poki': return new PokiAdapter();
      case 'crazygames': return new CrazyGamesAdapter();
      case 'yandex': return new YandexAdapter();
      case 'gamedistribution': return new GameDistAdapter();
      case 'discord': return new DiscordAdapter();
      case 'jiogames': return new JioGamesAdapter();
      case 'y8': return new Y8Adapter();
      case 'lagged': return new LaggedAdapter();
      case 'msstore': return new MicrosoftStoreAdapter();
      case 'quickgame': return new QuickGameAdapter();
      case 'msn_reddit': return new MSNRedditAdapter();
      case 'standalone':
      default:
        return new StandaloneAdapter();
    }
  }

  public getBridge(): GamePlatformBridge {
    return this.activeBridge;
  }

  public async setPlatform(id: PlatformId): Promise<void> {
    this.activeBridge = this.createAdapter(id);
    await this.activeBridge.initialize();
    this.listeners.forEach((fn) => fn(this.activeBridge));
  }

  public onPlatformChange(cb: (bridge: GamePlatformBridge) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== cb);
    };
  }

  public getPlatformList(): PlatformMetadata[] {
    return PLATFORM_REGISTRY;
  }
}

export const PlatformManager = new PlatformManagerClass();
