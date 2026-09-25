<div align="center">

# ✋ Falling Fingers

### An arcade reflex game for quick, satisfying runs.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![YouTube Playables](https://img.shields.io/badge/YouTube-Playables-FF0000?logo=youtube&logoColor=white)](https://developers.google.com/youtube/gaming/playables)

**Tap the broken fingers. Protect your combo. Survive the next wave.**

</div>

---

## The game

**Falling Fingers** is a fast arcade game about timing and precision. Broken fingers fall from above—tap them before they escape, avoid healthy ones, chain correct hits, and push for a new high score.

It is a game first: short runs, clear feedback, rising pressure, and satisfying score chasing.

## What’s inside

| Action | Challenge | Progression |
| --- | --- | --- |
| Tap broken fingers | Avoid wrong taps and missed targets | Boss waves every 25 points |
| Build combos | Keep your lives intact | Streak missions and milestones |
| Collect power-ups | Handle increasing speed | Achievements and daily challenge |

- **Boss waves** — a burst of broken fingers with a bonus for clearing it.
- **Power-ups** — magnet, freeze time, slow motion, shield, and combo shield.
- **Adaptive difficulty** — the pace responds to how accurately you play.
- **Daily challenge** — a seeded run and local daily leaderboard.
- **Accessibility options** — larger targets, high contrast, reduced motion, and optional haptics.
- **Seasonal visual accents** — fresh atmosphere without changing the core game.

## How to play

1. Tap or click a **broken** finger to fix it and earn points.
2. Do **not** tap healthy fingers—they cost a life.
3. Do not let broken fingers reach the bottom.
4. Chain correct fixes to grow your combo and score.
5. Clear boss waves and complete missions for an edge.

| Control | Result |
| --- | --- |
| Tap / click | Fix a broken finger or collect a power-up |
| Esc | Pause or resume a local run |
| Mute control | Toggle game audio |
| Options | Configure accessibility settings |

## YouTube Playables readiness

Falling Fingers includes the non-monetized Playables integration needed for a YouTube game:

- Game API script loads before the app bundle.
- First-frame and ready lifecycle notifications.
- Platform audio, pause, and resume support.
- Save/load for settings and local progression, with local fallback.
- Score reporting and platform-language detection.
- Responsive, orientation-independent viewport and relative production paths.
- **No ads, rewarded revives, IAP, or monetization flow.**

> The code is prepared for the [YouTube Playables Test Suite](https://developers.google.com/youtube/gaming/playables/test_suite). A passing certification result can only be claimed after a working production bundle is uploaded and run through the official suite.

## Run the game locally

```bash
git clone https://github.com/Rahul08319/Falling-Fingers.git
cd Falling-Fingers
npm install
npm run dev
```

## Validate a release build

```bash
npm run lint
npm test
npm run build
```

The production game bundle is created in `dist/`.

## Game architecture

```text
src/
├── game/          # Loop, rules, gameplay UI, audio, progression, Playables bridge
├── pages/         # Screen coordination
├── components/    # Shared UI primitives
└── index.css      # Responsive and accessible game presentation
```

## Roadmap

- [x] Core arcade loop
- [x] Boss waves, missions, power-ups, and adaptive difficulty
- [x] Local leaderboard, achievements, and accessibility options
- [x] Non-monetized YouTube Playables integration
- [ ] Official YouTube Playables Test Suite upload and result
- [ ] Optional online leaderboard

---

<div align="center">

Built by [Rahul Kumar](https://github.com/Rahul08319) · **Play fast. Stay sharp.**

</div>
