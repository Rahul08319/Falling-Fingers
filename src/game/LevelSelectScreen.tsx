import { useState, useMemo } from 'react';
import { WORLDS, getLevelConfig, loadLevelProgress, LevelProgress } from './levels';

interface LevelSelectScreenProps {
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

const LevelSelectScreen = ({ onSelectLevel, onClose }: LevelSelectScreenProps) => {
  const [progress] = useState<LevelProgress>(() => loadLevelProgress());

  // Determine current active world tab based on highest unlocked level
  const defaultWorld = useMemo(() => {
    const w = Math.min(10, Math.floor((progress.unlockedLevel - 1) / 10) + 1);
    return Math.max(1, w);
  }, [progress.unlockedLevel]);

  const [selectedWorld, setSelectedWorld] = useState<number>(defaultWorld);

  // Generate levels for the selected world
  const worldLevels = useMemo(() => {
    if (selectedWorld <= 10) {
      const startLevel = (selectedWorld - 1) * 10 + 1;
      return Array.from({ length: 10 }, (_, i) => startLevel + i);
    } else {
      // World 11: Prestige Levels 101-120
      return Array.from({ length: 15 }, (_, i) => 101 + i);
    }
  }, [selectedWorld]);

  const currentWorldInfo = WORLDS[selectedWorld - 1] || WORLDS[0];

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#08090d] select-none text-white overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 filter blur-[90px]"
          style={{ background: 'radial-gradient(circle, #0066cc 0%, rgba(41,151,255,0) 70%)' }}
        />
      </div>

      {/* HEADER: Title & Overall Progress Stats */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-2xl mx-auto pt-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-sm active:scale-90 transition"
            title="Back to Menu"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <span>🗺️ 100+ Levels Campaign</span>
            </h1>
            <p className="text-[11px] text-white/50">Conquer 10 Worlds & Master Every Rhythm</p>
          </div>
        </div>

        {/* Global Stars & Highest Level Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-bold text-amber-300">
            <span>⭐</span>
            <span>{progress.totalStars}</span>
            <span className="text-white/40 text-[10px]">/ 300</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0066cc]/20 border border-[#2997ff]/40 text-xs font-bold text-[#2997ff]">
            <span>Lvl</span>
            <span>{progress.unlockedLevel}</span>
          </div>
        </div>
      </header>

      {/* WORLD SELECTOR CAROUSEL / TABS */}
      <div className="relative z-10 w-full max-w-2xl mx-auto my-3 overflow-x-auto no-scrollbar py-1">
        <div className="flex gap-1.5 min-w-max px-1">
          {WORLDS.slice(0, 10).map((w) => {
            const isSelected = selectedWorld === w.world;
            const worldStartLevel = (w.world - 1) * 10 + 1;
            const isWorldUnlocked = progress.unlockedLevel >= worldStartLevel;

            return (
              <button
                key={w.world}
                onClick={() => setSelectedWorld(w.world)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? 'bg-[#0066cc] text-white shadow-[0_2px_12px_rgba(0,102,204,0.5)] border border-[#2997ff]/50'
                    : isWorldUnlocked
                    ? 'bg-white/[0.06] text-white/80 hover:bg-white/[0.12] border border-white/10'
                    : 'bg-white/[0.02] text-white/30 border border-white/[0.05]'
                }`}
              >
                <span>{w.emoji}</span>
                <span>W{w.world}</span>
                {!isWorldUnlocked && <span className="text-[10px]">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* CURRENT WORLD BANNER */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mb-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentWorldInfo.emoji}</span>
            <h2 className="text-base font-black uppercase tracking-tight">
              World {currentWorldInfo.world}: {currentWorldInfo.name}
            </h2>
            <span className="text-xs text-white/40 font-semibold">({currentWorldInfo.levels})</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">{currentWorldInfo.desc}</p>
        </div>
      </div>

      {/* 10-LEVEL GRID FOR ACTIVE WORLD */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto overflow-y-auto px-1 py-2">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {worldLevels.map((lvl) => {
            const isUnlocked = lvl <= progress.unlockedLevel;
            const isCurrentNext = lvl === progress.unlockedLevel;
            const stars = progress.stars[lvl] || 0;
            const score = progress.scores[lvl] || 0;
            const cfg = getLevelConfig(lvl);

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(lvl)}
                className={`relative flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 active:scale-95 text-center min-h-[110px] ${
                  isCurrentNext
                    ? 'bg-[#0066cc]/30 border-[#2997ff] shadow-[0_0_20px_rgba(41,151,255,0.4)] animate-pulse'
                    : isUnlocked
                    ? 'bg-white/[0.07] hover:bg-white/[0.12] border-white/15'
                    : 'bg-white/[0.02] border-white/[0.05] opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Level Number or Lock Icon */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-white/50 tracking-wider">LVL</span>
                  {cfg.hasBossWave && <span className="text-xs" title="Boss Wave">🖐️</span>}
                </div>

                <div className="my-1">
                  {isUnlocked ? (
                    <span className="text-2xl font-black text-white tracking-tight">{lvl}</span>
                  ) : (
                    <span className="text-xl opacity-60">🔒</span>
                  )}
                </div>

                {/* Stars Display */}
                <div className="flex items-center gap-0.5 text-xs">
                  {isUnlocked ? (
                    [1, 2, 3].map((starNum) => (
                      <span
                        key={starNum}
                        className={starNum <= stars ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(255,214,10,0.8)]' : 'text-white/20'}
                      >
                        ★
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-white/30">Locked</span>
                  )}
                </div>

                {/* Target info preview */}
                {isUnlocked && (
                  <span className="text-[9px] text-white/50 mt-1 font-medium">
                    {cfg.targetFixes} fixes
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* FOOTER ACTION */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto pt-3 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={onClose}
          className="py-2.5 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-xs font-bold uppercase tracking-wider active:scale-95 transition"
        >
          ← Main Menu
        </button>

        <button
          onClick={() => onSelectLevel(progress.unlockedLevel)}
          className="py-2.5 px-6 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(0,102,204,0.4)] active:scale-95 transition flex items-center gap-1.5"
        >
          <span>Continue Level {progress.unlockedLevel}</span>
          <span>▶</span>
        </button>
      </footer>
    </div>
  );
};

export default LevelSelectScreen;
