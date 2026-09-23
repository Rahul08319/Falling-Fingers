import { useState } from 'react';
import { Difficulty, GameMode, DIFFICULTY_CONFIG } from './types';
import { getDailyDateString } from './dailySeed';
import { getSeasonalEvent } from './themes';

interface MenuScreenProps {
  onStart: (mode: GameMode, difficulty: Difficulty) => void;
  onShowLeaderboard: () => void;
  onShowThemes: () => void;
  onShowTutorial: () => void;
  onShowAccessibility: () => void;
  onShowAchievements: () => void;
  highScore: number;
}

const MenuScreen = ({
  onStart,
  onShowLeaderboard,
  onShowThemes,
  onShowTutorial,
  onShowAccessibility,
  onShowAchievements,
  highScore,
}: MenuScreenProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];
  const seasonal = getSeasonalEvent();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative select-none overflow-hidden bg-gradient-to-b from-[#0d0d11] via-[#121218] to-[#09090c]">
      {/* Apple Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 filter blur-[90px] animate-apple-breathe"
          style={{ background: 'radial-gradient(circle, #0066cc 0%, rgba(41,151,255,0) 70%)' }}
        />
        <div
          className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full opacity-15 filter blur-[80px] animate-apple-float"
          style={{ background: 'radial-gradient(circle, #5e5ce6 0%, rgba(94,92,230,0) 70%)' }}
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 filter blur-md"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: i % 2 === 0 ? '#0066cc' : '#30d158',
              animation: `apple-float ${6 + i * 1.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Main Glass Showcase Card */}
      <div className="apple-glass-card rounded-[32px] px-6 py-8 sm:px-10 sm:py-10 max-w-sm w-full flex flex-col items-center relative z-10 animate-apple-float">
        {/* Hero Visual with Ambient Glow */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-[#0066cc]/30 filter blur-xl rounded-full scale-125 animate-pulse" />
          <div className="text-6xl sm:text-7xl relative animate-apple-breathe">🩹</div>
        </div>

        {/* Title — Apple Display Typography */}
        <div className="text-center mb-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.035em] leading-tight">
            Falling Fingers
          </h1>
          <p className="text-xs text-white/50 tracking-normal mt-0.5 font-medium">
            Rhythm Precision · Tap to Heal
          </p>
        </div>

        {/* Seasonal Pill */}
        <div className="my-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md text-[11px] font-semibold tracking-tight text-white/90 shadow-sm"
          >
            <span>{seasonal.emoji}</span>
            <span>{seasonal.name}</span>
          </span>
        </div>

        {/* Apple Segmented Control for Difficulty */}
        <div className="w-full bg-white/[0.06] p-1 rounded-full border border-white/10 flex items-center justify-between gap-1 mb-2 backdrop-blur-xl shadow-inner">
          {difficulties.map((d) => {
            const cfg = DIFFICULTY_CONFIG[d];
            const selected = selectedDifficulty === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`flex-1 py-1.5 px-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 ${
                  selected
                    ? 'apple-btn-primary text-white shadow-md'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs">{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-white/40 tracking-tight mb-5">
          {DIFFICULTY_CONFIG[selectedDifficulty].lives} lives · {selectedDifficulty === 'easy' ? 'gentle pace' : selectedDifficulty === 'hard' ? 'intense velocity' : 'balanced speed'}
        </div>

        {/* Primary Action Button (Apple Pill) */}
        <button
          onClick={() => onStart('classic', selectedDifficulty)}
          className="w-full py-3.5 px-6 rounded-full apple-btn-primary apple-pill-btn text-base font-semibold tracking-tight active:scale-[0.97] transition-all shadow-[0_8px_24px_rgba(0,102,204,0.4)]"
        >
          Start Game
        </button>

        {/* Daily Challenge Pill */}
        <button
          onClick={() => onStart('daily', selectedDifficulty)}
          className="w-full py-2.5 px-5 mt-2.5 rounded-full apple-glass apple-pill-btn text-xs font-medium text-white/90 hover:bg-white/[0.12] active:scale-[0.97] transition flex items-center justify-center gap-2"
        >
          <span>📅 Daily Challenge</span>
          <span className="text-[10px] text-white/40">· {getDailyDateString()}</span>
        </button>

        {/* Power-up Chips (Apple Translucent Surface) */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-5 pt-4 border-t border-white/[0.08] w-full">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70">🌟 5× Gold</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70">⚡ Swift</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70">❤️ +1 Heal</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70">🛡️ Shield</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70">🐌 Stasis</span>
        </div>

        {/* Secondary Tool Bar (Apple Capsule Row) */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3.5 w-full">
          <button
            onClick={onShowLeaderboard}
            className="apple-glass apple-pill-btn text-[11px] px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/[0.14]"
          >
            🏆 Scores
          </button>
          <button
            onClick={onShowThemes}
            className="apple-glass apple-pill-btn text-[11px] px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/[0.14]"
          >
            🎨 Themes
          </button>
          <button
            onClick={onShowTutorial}
            className="apple-glass apple-pill-btn text-[11px] px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/[0.14]"
          >
            ❓ Guide
          </button>
          <button
            onClick={onShowAchievements}
            className="apple-glass apple-pill-btn text-[11px] px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/[0.14]"
          >
            🏅 Badges
          </button>
          <button
            onClick={onShowAccessibility}
            className="apple-glass apple-pill-btn text-[11px] px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/[0.14]"
          >
            ♿ Access
          </button>
        </div>

        {/* High Score Minimalist Apple Typography */}
        {highScore > 0 && (
          <div className="mt-4 pt-3 border-t border-white/[0.08] w-full text-center">
            <span className="text-[10px] font-medium text-white/40 tracking-wider uppercase">Personal Best</span>
            <div className="text-xl font-bold text-[#2997ff] tracking-tight">
              {highScore.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuScreen;
