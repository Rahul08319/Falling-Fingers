import { useState, useEffect } from 'react';
import { Difficulty, GameMode, DIFFICULTY_CONFIG } from './types';
import { getDailyDateString } from './dailySeed';
import { getSeasonalEvent } from './themes';
import { PlatformManager } from '../platforms';

interface MenuScreenProps {
  onStart: (mode: GameMode, difficulty: Difficulty) => void;
  onShowLeaderboard: () => void;
  onShowThemes: () => void;
  onShowTutorial: () => void;
  onShowAccessibility: () => void;
  onShowAchievements: () => void;
  onShowPlatforms?: () => void;
  highScore: number;
}

const MenuScreen = ({
  onStart,
  onShowLeaderboard,
  onShowThemes,
  onShowTutorial,
  onShowAccessibility,
  onShowAchievements,
  onShowPlatforms,
  highScore,
}: MenuScreenProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [platformName, setPlatformName] = useState(() => PlatformManager.getBridge().name);

  useEffect(() => {
    return PlatformManager.onPlatformChange((bridge) => {
      setPlatformName(bridge.name);
    });
  }, []);

  const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];
  const seasonal = getSeasonalEvent();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative select-none">
      {/* Background Ambient Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-15 filter blur-sm"
            style={{
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#0066cc' : 'hsl(340 90% 55%)',
              animation: `float ${4 + Math.random() * 5}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top Platform Runtime Pill (Apple Style) */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
        <button
          onClick={onShowPlatforms}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-xl shadow-md active:scale-95 transition text-[11px] font-semibold text-white/90"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{platformName}</span>
          <span className="text-white/40">· Switch</span>
        </button>
      </div>

      {/* Hero Visual */}
      <div className="text-7xl mb-2 animate-bounce mt-8">🩹</div>

      {/* Title with Apple Typography Tight Tracking */}
      <div className="text-center mb-1">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-[-0.03em] drop-shadow-md">
          FALLING
        </h1>
        <h1
          className="font-display text-5xl sm:text-6xl font-black text-[#2997ff] tracking-[-0.03em]"
          style={{ textShadow: '0 0 30px rgba(41, 151, 255, 0.45)' }}
        >
          FINGERS
        </h1>
      </div>

      <p className="font-body text-base text-white/70 text-center mb-3 max-w-xs leading-snug">
        Tap the <span className="text-[#2997ff] font-bold">broken</span> fingers to fix them.
        <br />Don't let them fall!
      </p>

      {/* Seasonal Badge */}
      <span
        className="mb-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-1 font-display text-[10px] tracking-widest text-white/90"
        style={{ color: 'hsl(var(--seasonal-accent))' }}
      >
        {seasonal.emoji} {seasonal.name}
      </span>

      {/* Power-up Quick Guide Chips */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4 max-w-xs">
        <span className="text-[11px] font-display px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">🌟 Gold 5x</span>
        <span className="text-[11px] font-display px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">⚡ Fast</span>
        <span className="text-[11px] font-display px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">❤️‍🩹 Heal +1</span>
        <span className="text-[11px] font-display px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">🛡️ Shield</span>
        <span className="text-[11px] font-display px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">🐌 Slow</span>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-2">
        {difficulties.map((d) => {
          const cfg = DIFFICULTY_CONFIG[d];
          const selected = selectedDifficulty === d;
          return (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`font-display text-xs font-bold px-4 py-2 rounded-full transition-all duration-150 active:scale-95 border ${
                selected
                  ? 'bg-[#0066cc] text-white border-[#2997ff] shadow-lg shadow-[#0066cc]/40'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              {cfg.emoji} {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-white/50 font-body mb-4">
        {DIFFICULTY_CONFIG[selectedDifficulty].lives} lives • {selectedDifficulty === 'easy' ? 'slower' : selectedDifficulty === 'hard' ? 'faster' : 'normal'} speed
      </div>

      {/* Primary Action Button (Apple Pill) */}
      <button
        onClick={() => onStart('classic', selectedDifficulty)}
        className="font-display text-lg font-bold px-14 py-4 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white shadow-xl shadow-[#0066cc]/40 active:scale-95 transition-all duration-150 tracking-wider"
      >
        PLAY NOW
      </button>

      {/* Daily Challenge Pill */}
      <button
        onClick={() => onStart('daily', selectedDifficulty)}
        className="font-display text-xs font-bold px-8 py-2.5 mt-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white active:scale-95 transition-all duration-150 tracking-wider flex items-center gap-1.5"
      >
        <span>📅 DAILY CHALLENGE</span>
        <span className="text-[10px] text-white/50">({getDailyDateString()})</span>
      </button>

      {/* Secondary Tool Bar (Apple Capsule Row) */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-4 max-w-sm">
        <button
          onClick={onShowLeaderboard}
          className="font-display text-[11px] font-bold px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95 transition tracking-wider"
        >
          🏆 SCORES
        </button>
        <button
          onClick={onShowThemes}
          className="font-display text-[11px] font-bold px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95 transition tracking-wider"
        >
          🎨 THEMES
        </button>
        <button
          onClick={onShowTutorial}
          className="font-display text-[11px] font-bold px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95 transition tracking-wider"
        >
          ❓ HOW
        </button>
        <button
          onClick={onShowAchievements}
          className="font-display text-[11px] font-bold px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95 transition tracking-wider"
        >
          🏅 BADGES
        </button>
        <button
          onClick={onShowAccessibility}
          className="font-display text-[11px] font-bold px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95 transition tracking-wider"
        >
          ♿ ACCESS
        </button>
        <button
          onClick={onShowPlatforms}
          className="font-display text-[11px] font-bold px-3 py-2 rounded-full bg-[#0066cc]/40 hover:bg-[#0066cc]/60 border border-[#2997ff]/40 text-[#2997ff] active:scale-95 transition tracking-wider"
        >
          🌐 SDKs
        </button>
      </div>

      {highScore > 0 && (
        <div className="mt-4 text-center">
          <span className="font-display text-[10px] text-white/50 tracking-widest uppercase">BEST SCORE</span>
          <div className="font-display text-2xl font-bold text-[#2997ff]" style={{ textShadow: '0 0 15px rgba(41, 151, 255, 0.5)' }}>
            {highScore}
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-16px) scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default MenuScreen;
