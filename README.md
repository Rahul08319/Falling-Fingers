<div align="center">

<br />

<!-- Apple Design Hero Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0066cc&height=220&section=header&text=Falling%20Fingers&fontSize=62&fontColor=ffffff&fontAlignY=38&desc=A%20precision%20rhythm%20tap%20game%20crafted%20with%20Apple%20design%20standards&descAlignY=62&descSize=17&animation=fadeIn" width="100%" alt="Falling Fingers Banner" />

<br />

[![YouTube Playables Certified](https://img.shields.io/badge/YouTube_Playables-Certified_v1-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://developers.google.com/youtube/gaming/playables)
[![13 Native Platforms](https://img.shields.io/badge/Platforms-13_Native_SDKs-0066cc?style=for-the-badge&logo=apple&logoColor=white)](#-13-native-platform-versions)
[![Zero Aggregators](https://img.shields.io/badge/Middleware-Zero_Playgama-30d158?style=for-the-badge&logo=checkmarx&logoColor=white)](#-zero-third-party-aggregators)
[![Apple Design](https://img.shields.io/badge/Design-Apple_HIG_Fluid-1d1d1f?style=for-the-badge&logo=apple&logoColor=white)](#-apple-design-system)

<br />

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-f5f5f7?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-30d158?style=flat-square&logo=githubactions&logoColor=white)](#)

<br />

> **Tap the broken fingers. Feel the rhythm. Master precision.**  
> *Designed from the ground up for YouTube Playables certification and distributed across 13 major web gaming platforms.*

<br />

</div>

---

## ✦ Overview

**Falling Fingers** is a fast-paced, tactile arcade rhythm game designed with Apple Arcade standards and fluid physics motion. Players test their reflexes against falling finger sprites, triggering combos, collecting randomized power-ups, and deploying tactical revives.

The game features a **pure native multi-platform architecture**: every single gaming platform communicates directly with its official JavaScript SDK. **No Playgama, no GameAnalytics bloat, and zero third-party middleware.**

---

## ✦ 13 Native Platform Versions

All 13 standalone, ready-to-upload distributions are packaged directly inside the [`platforms/`](./platforms) directory. Each folder contains its own self-contained production bundle, platform manifest, and native SDK injection:

| Platform | Distribution Folder | Native SDK | Cloud Save | Ads | Status |
|:---|:---|:---:|:---:|:---:|:---:|
| 🎮 **YouTube Playables** | [`platforms/youtube-playables/`](./platforms/youtube-playables) | `ytgame` v1 | ✅ | ✅ | ![Certified](https://img.shields.io/badge/-Certified-30d158?style=flat-square) |
| 📘 **Facebook Instant Games** | [`platforms/facebook-instant/`](./platforms/facebook-instant) | `FBInstant` v7.1 | ✅ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🟣 **Poki** | [`platforms/poki/`](./platforms/poki) | `PokiSDK` v2 | ❌ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🔴 **CrazyGames** | [`platforms/crazygames/`](./platforms/crazygames) | `CrazyGames.SDK` v3 | ❌ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🟡 **Yandex Games** | [`platforms/yandex/`](./platforms/yandex) | `YaGames` v2 | ✅ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🔵 **GameDistribution** | [`platforms/gamedistribution/`](./platforms/gamedistribution) | `gdsdk` HTML5 | ❌ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 💜 **Discord Activities** | [`platforms/discord/`](./platforms/discord) | Embedded App SDK | ✅ | ❌ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🟢 **JioGames** | [`platforms/jiogames/`](./platforms/jiogames) | JioGames HTML5 | ✅ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| ⚪ **Y8 / ID.net** | [`platforms/y8/`](./platforms/y8) | `ID.net` SDK | ✅ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🔶 **Lagged** | [`platforms/lagged/`](./platforms/lagged) | Lagged API v1 | ❌ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🪟 **Microsoft Store** | [`platforms/microsoft-store/`](./platforms/microsoft-store) | PWA + ServiceWorker | ✅ | ❌ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 🤖 **Huawei & Xiaomi** | [`platforms/quickgame-huawei-xiaomi/`](./platforms/quickgame-huawei-xiaomi) | `qg` / `hbs` Quick App | ✅ | ✅ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |
| 📰 **MSN & Reddit** | [`platforms/msn-reddit/`](./platforms/msn-reddit) | `postMessage` Embed | ❌ | ❌ | ![Live](https://img.shields.io/badge/-Ready-0066cc?style=flat-square) |

---

## ✦ Apple Design System

The user interface follows Apple's Human Interface Guidelines (HIG) and fluid motion principles:

- **Typography**: Apple SF Pro system font stack with negative optical tracking (`tracking-[-0.035em]`), crisp hierarchy, and high contrast legibility.
- **Materials**: Multi-layer frosted glass surfaces (`backdrop-filter: blur(36px) saturate(200%)`, `border: 1px solid rgba(255,255,255,0.14)`).
- **Interactive Pill Controls**: All buttons and segmented selectors use Apple's signature pill form factor (`rounded-full`) with instant press feedback (`active:scale-[0.96]`) and Action Blue `#0066cc` highlight.
- **Fluid Animation**: Spring physics easing (`cubic-bezier(0.16, 1, 0.3, 1)`), interruptible state transitions, ambient lighting orbs, and breathing glow indicators.

---

## ✦ YouTube Playables Certification Checklist

Every requirement specified by the [YouTube Playables Documentation](https://developers.google.com/youtube/gaming/playables) is certified and pre-validated:

```
[✓] SDK Placement: Loaded in <head> BEFORE any game script
[✓] First Frame: window.ytgame.game.firstFrameReady() called on initial canvas render
[✓] Game Ready: window.ytgame.game.gameReady() invoked when menu is interactive
[✓] Audio Sync: isAudioEnabled() checked on boot + onAudioEnabledChange subscription
[✓] Pause/Resume: onPause saves player progress; onResume restores animation loop
[✓] UTF-16 Data Safety: saveData validates UTF-16 well-formedness and enforces <= 3 MiB
[✓] Integer Scores: sendScore validates Number.isSafeInteger before submission
[✓] Interstitial Ads: Triggered gracefully on Game Over and menu navigation
[✓] Rewarded Revive: 5-second countdown modal with ad-completion reward callback
[✓] Sandboxed Assets: Built with relative base path (base: './')
```

---

## ✦ Zero Third-Party Aggregators

Unlike games reliant on aggregator SDKs like Playgama or GameMonetize, Falling Fingers implements an isolated platform bridge pattern:

```
                             ┌─────────────────────────┐
                             │    Game Loop / UI       │
                             └────────────┬────────────┘
                                          │
                             ┌────────────▼────────────┐
                             │     PlatformManager     │
                             └────────────┬────────────┘
         ┌────────────────────────────────┼────────────────────────────────┐
         │                                │                                │
┌────────▼────────┐              ┌────────▼────────┐              ┌────────▼────────┐
│ YouTubePlayables│              │ FacebookInstant │              │  Poki / Crazy   │
│  (ytgame SDK)   │              │  (FBInstant SDK)│              │  (Native SDKs)  │
└─────────────────┘              └─────────────────┘              └─────────────────┘
```

- **Direct Communication**: Each adapter speaks directly to the platform's native window API.
- **Auto-Detection**: `PlatformManager` automatically detects the execution environment at runtime.
- **URL Override**: Force any platform mode for local testing via query parameter (e.g. `?platform=facebook`).

---

## ✦ Project Structure

```
Falling-Fingers/
├── index.html                        # YouTube Playables certified SDK loader
├── vite.config.ts                    # Relative asset paths (base: './')
├── scripts/
│   └── build-platforms.js            # Standalone multi-platform packager
│
├── platforms/                        # 13 Standalone, ready-to-publish packages
│   ├── youtube-playables/            # YouTube Playables (Certified v1)
│   ├── facebook-instant/             # Facebook Instant Games (fbapp-config.json)
│   ├── poki/                         # Poki SDK v2
│   ├── crazygames/                   # CrazyGames SDK v3
│   ├── yandex/                       # Yandex Games
│   ├── gamedistribution/             # GameDistribution
│   ├── discord/                      # Discord Activities
│   ├── jiogames/                     # JioGames HTML5
│   ├── y8/                           # Y8 / ID.net
│   ├── lagged/                       # Lagged API
│   ├── microsoft-store/              # Microsoft Store PWA (manifest + sw.js)
│   ├── quickgame-huawei-xiaomi/      # Huawei & Xiaomi Quick Apps
│   └── msn-reddit/                   # MSN & Reddit Embed
│
├── src/
│   ├── platforms/                    # Multi-Platform Adapter Layer
│   │   ├── types.ts                  # GamePlatformBridge interface
│   │   ├── PlatformManager.ts        # Singleton runtime environment detector
│   │   └── adapters/                 # 13 native TypeScript platform adapters
│   │
│   ├── game/                         # Core Gameplay & Apple Design UI
│   │   ├── useGameLoop.ts            # Main loop, physics, sound, save state
│   │   ├── MenuScreen.tsx            # Apple glass showcase card & segmented controls
│   │   ├── GameScreen.tsx            # Finger sprites, particles, power-ups
│   │   ├── GameHUD.tsx               # Floating frosted pill HUD
│   │   ├── GameOverScreen.tsx        # High-contrast Apple stats card
│   │   └── RewardedReviveModal.tsx   # 5-second countdown revive ring
│   │
│   └── pages/
│       └── Index.tsx                 # Viewport manager & modal conductor
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js**: $\ge 18.0.0$
- **npm**: $\ge 9.0.0$

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Rahul08319/Falling-Fingers.git
cd Falling-Fingers

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:8080`. In local mode, the YouTube Playables SDK automatically operates in mock mode with zero errors.

### Production Build

```bash
# Standard Vite production build
npm run build

# Build AND generate all 13 standalone platform versions
npm run build:platforms
```

Output distributions are generated into both [`platforms/`](./platforms) (tracked in Git) and `dist/platforms/`.

---

## ✦ Submitting to Platforms

To submit to any platform:
1. Navigate to the platform's folder in [`platforms/`](./platforms).
2. Zip all files within that directory (with `index.html` at the zip root).
3. Upload the zip file directly to that platform's developer portal.

---

## ✦ License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<br />

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0066cc&height=120&section=footer&animation=fadeIn" width="100%" alt="Footer Wave" />

<br />

**Falling Fingers** · Crafted with ❤️ by [Rahul08319](https://github.com/Rahul08319)  
*Certified for YouTube Playables · 13 Native Platforms · Zero Aggregators*

</div>
