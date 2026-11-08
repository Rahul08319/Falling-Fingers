<div align="center">

# ✋ Falling Fingers

### An arcade reflex game for quick, satisfying runs & 100+ Level Campaign.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Apple Design](https://img.shields.io/badge/Apple_Design-HIG_2026-0066cc?logo=apple&logoColor=white)](https://developer.apple.com/design/)
[![Fluid Motion](https://img.shields.io/badge/Motion-Fluid_Spring_Physics-2997ff)](https://developer.apple.com/design/)
[![100+ Levels](https://img.shields.io/badge/Campaign-100%2B_Levels-30d158?logo=target)](https://github.com/Rahul08319/Falling-Fingers)
[![13 Platforms](https://img.shields.io/badge/Platforms-13_Native_SDKs-ff9f0a)](https://github.com/Rahul08319/Falling-Fingers)
[![YouTube Playables](https://img.shields.io/badge/YouTube-Playables-FF0000?logo=youtube&logoColor=white)](https://developers.google.com/youtube/gaming/playables)

**Tap the broken fingers. Protect your combo. Conquer all 10 Worlds and survive the infinite trials.**

</div>

---

## 🎮 The Game

**Falling Fingers** is a fast arcade game about timing and precision. Broken fingers fall from above—tap them before they escape, avoid healthy ones, chain correct hits, and master every rhythm across endless arcade and the new **100+ Level Campaign**.

It is a game first: snappy runs, clear visual feedback, rising pressure, and satisfying stage completions.

---

## 🗺️ 100+ Level Campaign Mode

A complete journey spanning **10 distinct worlds (100 levels)** plus **World 11 (Infinite Prestige Tier)**, featuring bespoke speed curves, custom spawn rhythms, boss encounters, and a 3-star rating system:

| World | Name | Emoji | Levels | Theme & Challenge |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Gentle Touch** | 🌱 | 1 – 10 | Reflex fundamentals & basic rhythm |
| **2** | **Velocity Steps** | ⚡ | 11 – 20 | Accelerated drops & double rhythms |
| **3** | **Golden Horizon** | ✨ | 21 – 30 | Gold finger rushes & streak combos |
| **4** | **Rapid Reflexes** | 🔥 | 31 – 40 | High tempo & tight hit windows |
| **5** | **Twin Storm** | 🌪️ | 41 – 50 | Dense multi-finger cascades |
| **6** | **Hand of Titans** | 🖐️ | 51 – 60 | Giant boss waves & survival runs |
| **7** | **Stasis Zone** | 🛡️ | 61 – 70 | Strategic shield & freeze deployments |
| **8** | **Hyper Beats** | ⚡ | 71 – 80 | Relentless velocity & swift fingers |
| **9** | **Chaos Realm** | 🌀 | 81 – 90 | Erratic trajectories & extreme speed |
| **10** | **Grandmaster Trials** | 👑 | 91 – 100 | The ultimate arcade precision challenge |
| **11** | **Infinite Transcendence** | 🌌 | 101+ | Endless prestige levels for true masters |

### ⭐ 3-Star Grading Engine
Each stage evaluates your score, maximum combo streak, and remaining lives:
- **⭐ (1 Star)**: Target broken fingers fixed.
- **⭐⭐ (2 Stars)**: High score threshold or sustained 5x combo streak.
- **⭐⭐⭐ (3 Stars)**: Master score benchmark, 10x+ streak, and minimum 2 lives preserved.

---

## 🚀 Standalone Multi-Platform Packaging (13 Platforms)

Falling Fingers is engineered with zero middleware dependencies (no third-party aggregators). Each platform uses its dedicated native SDK bridge:

```bash
npm run build:platforms
```

Automatically generates independent, self-contained packages in `platforms/` and `dist/platforms/`:

1. **YouTube Playables** (`dist/platforms/youtube-playables/`)
2. **Facebook Instant Games** (`dist/platforms/facebook-instant/`)
3. **Poki** (`dist/platforms/poki/`)
4. **CrazyGames** (`dist/platforms/crazygames/`)
5. **Yandex Games** (`dist/platforms/yandex/`)
6. **GameDistribution** (`dist/platforms/gamedistribution/`)
7. **Discord Activities** (`dist/platforms/discord/`)
8. **JioGames** (`dist/platforms/jiogames/`)
9. **Y8 / ID.net** (`dist/platforms/y8/`)
10. **Lagged** (`dist/platforms/lagged/`)
11. **Microsoft Store PWA** (`dist/platforms/microsoft-store/`)
12. **Huawei & Xiaomi Quick Games** (`dist/platforms/quickgame-huawei-xiaomi/`)
13. **MSN & Reddit Games** (`dist/platforms/msn-reddit/`)

---

## 🍎 Apple Design System & Fluid Motion Physics

Falling Fingers is calibrated to Apple Human Interface Guidelines (HIG):

- **SF Pro Display & Text Typography**: Strict negative letter-spacing for sharp, high-speed readability.
- **Action Blue (`#0066cc`) & Action Blue Light (`#2997ff`)**: Clear visual affordances across interactive HUD elements.
- **Frosted Glass Stage Clear Modals**: Multi-layered real-time CSS backdrops (`backdrop-blur-xl`, `bg-[#12131a]/80`, `border-white/15`).
- **Fluid Spring Motion**: Critically damped spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) for instantaneous touch response.
- **Haptic Tactile Feedback**: Tap targets respond with `transform: scale(0.95)` on `:active` with sub-100ms spring return.
- **Dark Slate Arcade Aesthetic**: Slate canvases (`#090a0f`) allowing finger indicators and neon combos to pop with maximum visual contrast.

---

## 🕹️ Controls & Core Mechanics

| Action | Control | Result |
| --- | :---: | --- |
| **Fix Finger** | Tap / Click | Fix broken finger (+points, combo streak) |
| **Healthy Finger** | Avoid | Tapping a healthy finger loses 1 Life ❤️ |
| **Power-Ups** | Tap floating item | Magnet 🧲, Freeze ❄️, Slow-Mo 🐌, Shield 🛡️ |
| **Pause Game** | `Esc` or ⏸️ | Opens frosted pause overlay |
| **Toggle Sound** | 🔊 / 🔇 | Instant mute / unmute with local persistence |

---

## 🛠️ Development & Testing

```bash
# Clone the repository
git clone https://github.com/Rahul08319/Falling-Fingers.git
cd Falling-Fingers

# Install dependencies
npm install

# Run live development server
npm run dev

# Run unit tests
npm test

# Build production bundle & all 13 platform distributions
npm run build:platforms
```

---

## 📁 Repository Structure

```text
Falling-Fingers/
├── platforms/                  # Standalone packaged distribution folders for 13 platforms
├── scripts/
│   └── build-platforms.js      # Multi-platform post-build orchestrator
├── src/
│   ├── game/
│   │   ├── levels.ts           # 100+ level generator, curves, and progress storage
│   │   ├── LevelSelectScreen.tsx # World carousel and interactive level select map
│   │   ├── LevelClearModal.tsx # Apple frosted glass stage victory modal
│   │   ├── GameProgressPanel.tsx # Live in-game level progress and target HUD
│   │   ├── GameHUD.tsx         # Score, combo streak, lives, and level indicators
│   │   ├── GameOverScreen.tsx  # Stage failure and endless summary screen
│   │   ├── MenuScreen.tsx      # Arcade main menu with Campaign CTA
│   │   ├── useGameLoop.ts      # Core physics, spawn timing, and tap resolution loop
│   │   ├── playables.ts        # YouTube Playables official SDK integration
│   │   └── types.ts            # TypeScript definitions for modes, states, and entities
│   ├── pages/
│   │   └── Index.tsx           # Primary screen coordinator and view routing
│   └── test/
│       ├── levels.test.ts      # Comprehensive test suite for all 100+ levels
│       └── setup.ts            # Vitest environment and storage polyfills
```

---

<div align="center">

Built by [Rahul Kumar](https://github.com/Rahul08319) · **Play fast. Stay sharp.**

</div>
