<div align="center">

# ✋ Falling Fingers

### A fast, tactile arcade game built for the web and YouTube Playables.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![YouTube Playables](https://img.shields.io/badge/YouTube-Playables-FF0000?logo=youtube&logoColor=white)](https://developers.google.com/youtube/gaming/playables)

**Catch the falling fingers. Protect your streak. Beat the next wave.**

</div>

---

## The game

Falling Fingers is a quick-play arcade experience where precision, timing, and combo control matter. It is designed to be immediately understandable on any screen—then become progressively more intense with boss waves, adaptive difficulty, and score-chasing goals.

| Play style | Progression | Player-friendly design |
| --- | --- | --- |
| Tap/click falling targets | Boss waves every 25 points | Responsive layouts for wide and tall screens |
| Protect streaks and avoid misses | Missions, milestones, and achievements | Larger-target, high-contrast, and reduced-motion modes |
| Chase a new high score | Daily seeded challenge and local leaderboard | Optional haptics and audio controls |

## Highlights

- **Boss waves** — clear a burst of broken fingers for a meaningful bonus.
- **Streak missions** — complete focused challenges to earn temporary boosts.
- **Five power-ups** — slow motion, magnet, freeze time, combo shield, and more.
- **Adaptive pacing** — the game reacts to recent accuracy to keep runs engaging.
- **Achievements** — recognize perfect rounds, boss clears, and score milestones.
- **Seasonal touches** — rotating visual accents and challenge energy without monetization.
- **Daily challenge** — compete against your best local result in today’s seeded run.

## YouTube Playables support

The project includes a non-monetization YouTube Playables integration:

- Loads the YouTube Game API before the app bundle.
- Reports the first rendered frame and interactive-ready state.
- Honors system audio, pause, and resume callbacks.
- Persists player settings and progress through Playables save data, with local fallback.
- Reports engagement scores and uses the platform language where available.
- Uses relative production asset paths and a responsive, orientation-independent viewport.
- Contains **no ads, IAP, or monetization flow**.

> **Verification note:** The integration is implemented for the official Test Suite. A final Test Suite pass requires a production `dist` upload from a working npm environment and access to the YouTube Playables Portal.

## Quick start

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Run locally

```bash
git clone https://github.com/Rahul08319/falling-fingers-fun.git
cd falling-fingers-fun
npm install
npm run dev
```

Open the local URL shown by Vite, then start a run from the title screen.

### Quality checks

```bash
npm run lint
npm test
npm run build
```

The production build is emitted to `dist/`. Upload that folder through the [YouTube Playables Test Suite](https://developers.google.com/youtube/gaming/playables/test_suite) after validating the generated bundle.

## Controls

| Input | Action |
| --- | --- |
| **Tap / click** | Fix a falling finger or collect a power-up |
| **Esc** | Pause or resume a local game |
| **Mute control** | Toggle music and sound effects |
| **Access menu** | Enable larger targets, high contrast, reduced motion, or haptics |

## Project structure

```text
src/
├── components/        # Menus, overlays, HUD, accessibility, achievements
├── game/              # Game loop, Playables bridge, audio, progression rules
├── pages/             # App-level screens
└── index.css          # Responsive and accessibility-aware styling
```

## Tech stack

- React + TypeScript
- Vite + SWC
- Tailwind CSS and shadcn/ui primitives
- Vitest + Testing Library
- YouTube Playables Game API

## Roadmap

- [x] Core falling-target loop
- [x] Playables lifecycle, save, audio, and pause integration
- [x] Boss waves, missions, power-ups, achievements, and accessibility settings
- [x] Responsive Playables viewport support
- [ ] Official YouTube Playables Test Suite submission
- [ ] Hosted global / friends leaderboard

## Contributing

Ideas, balancing feedback, accessibility suggestions, and bug reports are welcome. Keep pull requests focused, describe player-facing behavior, and run the quality checks above before opening one.

---

<div align="center">

Built with care by [Rahul Kumar](https://github.com/Rahul08319) · **Play fast. Stay sharp. Keep every finger falling.**

</div>
