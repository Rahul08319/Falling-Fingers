import { describe, it, expect, beforeEach } from 'vitest';
import { WORLDS, getLevelConfig, loadLevelProgress, saveLevelClear } from '../game/levels';

describe('100+ Level Campaign System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Worlds Structure', () => {
    it('defines 10 core worlds and an infinite prestige tier (world 11)', () => {
      expect(WORLDS).toHaveLength(11);
      expect(WORLDS[0].name).toBe('Gentle Touch');
      expect(WORLDS[0].emoji).toBe('🌱');
      expect(WORLDS[9].name).toBe('Grandmaster Trials');
      expect(WORLDS[9].emoji).toBe('👑');
      expect(WORLDS[10].name).toBe('Infinite Transcendence');
      expect(WORLDS[10].emoji).toBe('🌌');
    });
  });

  describe('Level Progression Curves', () => {
    it('generates valid configs for levels 1 through 100', () => {
      for (let lvl = 1; lvl <= 100; lvl++) {
        const config = getLevelConfig(lvl);
        expect(config.level).toBe(lvl);
        expect(config.world).toBeGreaterThanOrEqual(1);
        expect(config.world).toBeLessThanOrEqual(10);
        expect(config.targetFixes).toBeGreaterThanOrEqual(8);
        expect(config.targetFixes).toBeLessThanOrEqual(65);
        expect(config.baseSpeed).toBeGreaterThanOrEqual(0.24);
        expect(config.baseSpeed).toBeLessThanOrEqual(0.66);
        expect(config.spawnInterval).toBeGreaterThanOrEqual(420);
        expect(config.spawnInterval).toBeLessThanOrEqual(1350);
        expect(config.brokenChance).toBeGreaterThanOrEqual(0.35);
        expect(config.brokenChance).toBeLessThanOrEqual(0.75);

        // Stars requirements must strictly ascend
        expect(config.starsRequirement[0]).toBeLessThan(config.starsRequirement[1]);
        expect(config.starsRequirement[1]).toBeLessThan(config.starsRequirement[2]);
      }
    });

    it('smoothly scales difficulty as levels advance', () => {
      const lvl1 = getLevelConfig(1);
      const lvl50 = getLevelConfig(50);
      const lvl100 = getLevelConfig(100);

      expect(lvl1.targetFixes).toBe(8);
      expect(lvl50.targetFixes).toBeGreaterThan(lvl1.targetFixes);
      expect(lvl100.targetFixes).toBeGreaterThan(lvl50.targetFixes);
      expect(lvl100.targetFixes).toBe(65);

      expect(lvl1.baseSpeed).toBeLessThan(lvl50.baseSpeed);
      expect(lvl50.baseSpeed).toBeLessThan(lvl100.baseSpeed);

      expect(lvl1.spawnInterval).toBeGreaterThan(lvl50.spawnInterval);
      expect(lvl50.spawnInterval).toBeGreaterThan(lvl100.spawnInterval);
    });

    it('schedules boss encounters on world finales (level % 10 === 0)', () => {
      expect(getLevelConfig(10).hasBossWave).toBe(true);
      expect(getLevelConfig(20).hasBossWave).toBe(true);
      expect(getLevelConfig(50).hasBossWave).toBe(true);
      expect(getLevelConfig(100).hasBossWave).toBe(true);
      expect(getLevelConfig(1).hasBossWave).toBe(false);
      expect(getLevelConfig(2).hasBossWave).toBe(false);
    });

    it('generates infinite prestige configs beyond level 100', () => {
      const lvl105 = getLevelConfig(105);
      expect(lvl105.world).toBe(11);
      expect(lvl105.targetFixes).toBeGreaterThan(65);
      expect(lvl105.worldName).toBe('Infinite Transcendence');
    });
  });

  describe('Progress Persistence & Star Scoring', () => {
    it('initializes default progress correctly', () => {
      const progress = loadLevelProgress();
      expect(progress.unlockedLevel).toBe(1);
      expect(progress.stars).toEqual({});
      expect(progress.scores).toEqual({});
      expect(progress.totalStars).toBe(0);
    });

    it('awards 3 stars when clearing with high score, combo >= 10, and livesLeft >= 2', () => {
      const result = saveLevelClear(1, 500, 12, 3);
      expect(result.starsEarned).toBe(3);
      expect(result.isNewUnlock).toBe(true);
      expect(result.nextLevel).toBe(2);

      const progress = loadLevelProgress();
      expect(progress.unlockedLevel).toBe(2);
      expect(progress.stars[1]).toBe(3);
      expect(progress.scores[1]).toBe(500);
      expect(progress.totalStars).toBe(3);
    });

    it('retains higher star rating if replayed with lower score', () => {
      saveLevelClear(1, 500, 12, 3);
      const replayResult = saveLevelClear(1, 80, 2, 1);
      expect(replayResult.starsEarned).toBe(1);

      const progress = loadLevelProgress();
      expect(progress.stars[1]).toBe(3);
      expect(progress.scores[1]).toBe(500);
    });

    it('accumulates stars across multiple cleared levels', () => {
      saveLevelClear(1, 300, 10, 2); // 3 stars
      saveLevelClear(2, 350, 10, 2); // 3 stars
      saveLevelClear(3, 150, 5, 1);  // 2 stars

      const progress = loadLevelProgress();
      expect(progress.unlockedLevel).toBe(4);
      expect(progress.totalStars).toBe(8);
    });
  });
});
