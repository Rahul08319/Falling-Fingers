import { useEffect } from 'react';
import { getLevelConfig, LevelConfig } from './levels';

interface LevelClearModalProps {
  level: number;
  score: number;
  maxCombo: number;
  starsEarned: number;
  isNewUnlock: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
  onMenu: () => void;
}

const LevelClearModal = ({
  level,
  score,
  maxCombo,
  starsEarned,
  isNewUnlock,
  onNextLevel,
  onReplay,
  onLevelSelect,
  onMenu,
}: LevelClearModalProps) => {
  const config: LevelConfig = getLevelConfig(level);
  const nextConfig: LevelConfig = getLevelConfig(level + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[32px] bg-[#12131a] border border-white/15 p-6 sm:p-8 flex flex-col items-center shadow-2xl text-center relative overflow-hidden">
        {/* Victory Glow Beam */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-35 filter blur-[70px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #30d158 0%, rgba(48,209,88,0) 70%)' }}
        />

        {/* Level Badges Header */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs font-semibold text-white/80 mb-2">
          <span>{config.worldEmoji}</span>
          <span>{config.worldName}</span>
          <span className="text-white/40">· Lvl {level}</span>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
          Stage Cleared!
        </h2>
        <p className="text-xs text-emerald-400 font-bold tracking-wider uppercase mb-5">
          {isNewUnlock ? '✨ New Level Unlocked! ✨' : 'Target Completed'}
        </p>

        {/* Animated Stars Reward */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starNum) => {
            const hasStar = starNum <= starsEarned;
            return (
              <div
                key={starNum}
                className={`text-4xl sm:text-5xl transition-all duration-500 transform ${
                  hasStar
                    ? 'scale-110 drop-shadow-[0_0_16px_rgba(255,214,10,0.8)] animate-bounce'
                    : 'opacity-25 grayscale scale-90'
                }`}
                style={{ animationDelay: `${starNum * 150}ms` }}
              >
                ⭐
              </div>
            );
          })}
        </div>

        {/* Stats Card */}
        <div className="w-full rounded-2xl bg-white/[0.05] border border-white/10 p-4 mb-6">
          <div className="text-center mb-3">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Stage Score</span>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">{score.toLocaleString()}</div>
          </div>
          <div className="flex justify-around items-center border-t border-white/[0.08] pt-3">
            <div className="text-center">
              <span className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Max Streak</span>
              <div className="text-base font-bold text-amber-400 mt-0.5">{maxCombo}×</div>
            </div>
            <div className="text-center">
              <span className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Fixes Target</span>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{config.targetFixes}/{config.targetFixes}</div>
            </div>
          </div>
        </div>

        {/* Primary Next Level Button */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 px-6 rounded-full bg-[#30d158] hover:bg-[#34c759] text-black font-black text-base uppercase tracking-wider shadow-[0_6px_24px_rgba(48,209,88,0.4)] active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>Level {level + 1}</span>
            <span>▶</span>
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={onReplay}
              className="flex-1 py-2.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-xs font-semibold active:scale-95 transition"
            >
              ↺ Replay
            </button>
            <button
              onClick={onLevelSelect}
              className="flex-1 py-2.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-xs font-semibold active:scale-95 transition"
            >
              🗺️ 100 Levels
            </button>
          </div>

          <button
            onClick={onMenu}
            className="text-xs font-medium text-white/50 hover:text-white pt-1 transition"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelClearModal;
