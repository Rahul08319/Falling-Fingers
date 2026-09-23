# 🎮 Standalone Multi-Platform Builds (Zero Aggregator)

Each folder in this directory contains a complete, self-contained standalone build of **Falling Fingers** tailored specifically for that platform's native SDK and publishing guidelines.

## 📦 Directory Structure

| Platform | Folder | Target SDK | Native Features |
|:---|:---|:---|:---|
| 🎮 **YouTube Playables** | [`youtube-playables/`](./youtube-playables) | `ytgame` v1 | Head SDK, firstFrameReady, gameReady, audio callbacks, UTF-16 saves, interstitial & rewarded ads |
| 📘 **Facebook Instant Games** | [`facebook-instant/`](./facebook-instant) | `FBInstant` v7.1 | fbapp-config.json, player cloud storage, interstitial ads, rewarded ads |
| 🟣 **Poki** | [`poki/`](./poki) | `PokiSDK` v2 | commercialBreak, rewardedBreak, responsive canvas |
| 🔴 **CrazyGames** | [`crazygames/`](./crazygames) | `CrazyGames.SDK` v3 | adBreak, rewardedAd, system error tracking |
| 🟡 **Yandex Games** | [`yandex/`](./yandex) | `YaGames` v2 | Cloud save storage, fullscreen adv, rewarded adv |
| 🔵 **GameDistribution** | [`gamedistribution/`](./gamedistribution) | `gdsdk` HTML5 | Auto-interstitial breaks, GD_OPTIONS init |
| 💜 **Discord Activities** | [`discord/`](./discord) | Embedded App SDK | discord-activity.json manifest, embedded client layout |
| 🟢 **JioGames** | [`jiogames/`](./jiogames) | JioGames HTML5 | Responsive touch layout, game-center compatible |
| ⚪ **Y8 / ID.net** | [`y8/`](./y8) | `ID.net` SDK | ID.net auto-init, achievements, score API |
| 🔶 **Lagged** | [`lagged/`](./lagged) | Lagged API v1 | Leaderboard and rewarded ads |
| 🪟 **Microsoft Store** | [`microsoft-store/`](./microsoft-store) | PWA + Service Worker | manifest.webmanifest, standalone window display, offline caching |
| 🤖 **Huawei & Xiaomi** | [`quickgame-huawei-xiaomi/`](./quickgame-huawei-xiaomi) | `qg` / `hbs` | manifest.json Quick App configuration, portrait lock |
| 📰 **MSN & Reddit** | [`msn-reddit/`](./msn-reddit) | `postMessage` Embed | Safe cross-domain iframe handshake, responsive embedding |

## 🚀 How to Submit

To submit any version to its respective store or developer portal:
1. Open the folder for your target platform (e.g. `platforms/youtube-playables/`).
2. Zip all files within that folder (ensure `index.html` is at the zip root).
3. Upload the zip directly to the platform's developer dashboard.
