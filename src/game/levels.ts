/**
 * Falling Fingers — 100+ Level Campaign System
 * 10 Distinct Worlds, 100 Hand-tuned & Procedurally Balanced Levels + Infinite Prestige Tier
 */
import { requestPlayablesSave } from './playables';

export interface LevelConfig {
  level: number;
  world: number;
  worldName: string;
  worldEmoji: string;
  targetFixes: number; // Goal: number of broken fingers fixed to clear
  baseSpeed: number; // Base falling speed
  spawnInterval: number; // Milliseconds between spawns
  brokenChance: number; // Probability finger is broken
  goldenChance: number; // Special golden finger probability
  speedFingerChance: number; // High-velocity finger probability
  healChance: number; // Extra life finger probability
  starsRequirement: [number, number, number]; // Minimum scores for 1, 2, 3 stars
  hasBossWave?: boolean; // Mini-boss encounter mid-level
  description: string;
}

export interface LevelProgress {
  unlockedLevel: number;
  stars: Record<number, number>; // level -> 1..3
  scores: Record<number, number>; // level -> score
  totalStars: number;
}

export const WORLDS = [
  { world: 1, name: "Gentle Touch", emoji: "🌱", levels: "1-10", desc: "Reflex fundamentals & basic timing" },
  { world: 2, name: "Velocity Steps", emoji: "⚡", levels: "11-20", desc: "Accelerated drops & double rhythms" },
  { world: 3, name: "Golden Horizon", emoji: "✨", levels: "21-30", desc: "Gold finger rushes & combo streaks" },
  { world: 4, name: "Rapid Reflexes", emoji: "🔥", levels: "31-40", desc: "High tempo & tight hit windows" },
  { world: 5, name: "Twin Storm", emoji: "🌪️", levels: "41-50", desc: "Dense multi-finger cascades" },
  { world: 6, name: "Hand of Titans", emoji: "🖐️", levels: "51-60", desc: "Giant boss waves & survival runs" },
  { world: 7, name: "Stasis Zone", emoji: "🛡️", levels: "61-70", desc: "Strategic shield & freeze deployments" },
  { world: 8, name: "Hyper Beats", emoji: "⚡", levels: "71-80", desc: "Relentless velocity & swift fingers" },
  { world: 9, name: "Chaos Realm", emoji: "🌀", levels: "81-90", desc: "Erratic trajectories & extreme speed" },
  { world: 10, name: "Grandmaster Trials", emoji: "👑", levels: "91-100", desc: "The ultimate arcade precision challenge" },
  { world: 11, name: "Infinite Transcendence", emoji: "🌌", levels: "101+", desc: "Endless prestige levels for masters" },
] as const;

/**
 * Returns configuration for any level from 1 to 100+
 */
export function getLevelConfig(level: number): LevelConfig {
  const safeLevel = Math.max(1, level);
  const worldIndex = Math.min(10, Math.floor((safeLevel - 1) / 10));
  const worldInfo = WORLDS[worldIndex];
  const world = worldIndex + 1;
  const stageInWorld = ((safeLevel - 1) % 10) + 1;

  // Progressive parameters based on level curve
  const progressRatio = Math.min(1, (safeLevel - 1) / 99); // 0 at lvl 1, 1 at lvl 100

  // Target fixes scale smoothly: 8 at level 1 to 65 at level 100
  const targetFixes = Math.floor(8 + progressRatio * 57 + (safeLevel > 100 ? (safeLevel - 100) * 2 : 0));

  // Base speed: 0.24 to 0.65
  const baseSpeed = Number((0.24 + progressRatio * 0.41 + (safeLevel > 100 ? (safeLevel - 100) * 0.01 : 0)).toFixed(3));

  // Spawn interval: 1350ms down to 480ms
  const spawnInterval = Math.max(420, Math.floor(1350 - progressRatio * 870));

  // Broken finger ratio: 35% up to 72%
  const brokenChance = Number((0.35 + progressRatio * 0.37).toFixed(2));

  // Special item probabilities
  const goldenChance = Number((0.08 + Math.sin(safeLevel * 0.4) * 0.05 + progressRatio * 0.06).toFixed(2));
  const speedFingerChance = Number((0.06 + progressRatio * 0.18).toFixed(2));
  const healChance = Number((0.05 + (stageInWorld === 5 || stageInWorld === 10 ? 0.05 : 0)).toFixed(2));

  // Star scoring requirements based on target fixes
  const star1 = targetFixes * 10;
  const star2 = Math.floor(targetFixes * 16);
  const star3 = Math.floor(targetFixes * 24);

  // Boss wave encounters on level 10 of each world or levels > 50 with multiples of 5
  const hasBossWave = stageInWorld === 10 || (safeLevel >= 50 && safeLevel % 5 === 0);

  return {
    level: safeLevel,
    world,
    worldName: worldInfo.name,
    worldEmoji: worldInfo.emoji,
    targetFixes,
    baseSpeed,
    spawnInterval,
    brokenChance,
    goldenChance,
    speedFingerChance,
    healChance,
    starsRequirement: [star1, star2, star3],
    hasBossWave,
    description: `World ${world} · Stage ${stageInWorld} — Fix ${targetFixes} broken fingers${hasBossWave ? ' (Boss Wave!)' : ''}`,
  };
}

const LEVEL_PROGRESS_KEY = 'falling-fingers-level-progress';

export function loadLevelProgress(): LevelProgress {
  try {
    const raw = localStorage.getItem(LEVEL_PROGRESS_KEY);
    if (!raw) {
      return { unlockedLevel: 1, stars: {}, scores: {}, totalStars: 0 };
    }
    const data = JSON.parse(raw);
    const stars: Record<number, number> = data.stars || {};
    let totalStars = 0;
    Object.values(stars).forEach(s => { totalStars += (s || 0); });

    return {
      unlockedLevel: Math.max(1, data.unlockedLevel || 1),
      stars,
      scores: data.scores || {},
      totalStars,
    };
  } catch {
    return { unlockedLevel: 1, stars: {}, scores: {}, totalStars: 0 };
  }
}

export function saveLevelClear(level: number, score: number, combo: number, livesLeft: number): { starsEarned: number; isNewUnlock: boolean; nextLevel: number } {
  const current = loadLevelProgress();
  const config = getLevelConfig(level);

  // Calculate stars earned (1 to 3)
  let starsEarned = 1;
  if (score >= config.starsRequirement[2] && combo >= 10 && livesLeft >= 2) {
    starsEarned = 3;
  } else if (score >= config.starsRequirement[1] || combo >= 5) {
    starsEarned = 2;
  }

  // Update stars & scores if improved
  const prevStars = current.stars[level] || 0;
  if (starsEarned > prevStars) {
    current.stars[level] = starsEarned;
  }

  const prevScore = current.scores[level] || 0;
  if (score > prevScore) {
    current.scores[level] = score;
  }

  // Unlock next level
  const nextLevel = level + 1;
  let isNewUnlock = false;
  if (nextLevel > current.unlockedLevel) {
    current.unlockedLevel = nextLevel;
    isNewUnlock = true;
  }

  // Re-tally total stars
  let totalStars = 0;
  Object.values(current.stars).forEach(s => { totalStars += (s || 0); });
  current.totalStars = totalStars;

  localStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(current));
  requestPlayablesSave();

  return { starsEarned, isNewUnlock, nextLevel };
}
