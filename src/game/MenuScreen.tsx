import { useState, useMemo } from 'react';
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

  // Floating background fingers for live arcade game atmosphere
  const backgroundFingers = useMemo(() => [
    { id: 1, icon: '👆', left: 12, delay: 0, duration: 6, broken: false },
    { id: 2, icon: '🩹', left: 28, delay: 2, duration: 7, broken: true },
    { id: 3, icon: '🖐️', left: 52, delay: 1, duration: 8, broken: false },
    { id: 4, icon: '✌️', left: 74, delay: 3, duration: 6.5, broken: true },
    { id: 5, icon: '🤞', left: 88, delay: 1.5, duration: 7.5, broken: false },
    { id: 6, icon: '🩹', left: 40, delay: 4, duration: 9, broken: true },
  ], []);

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden bg-[#090a0f]">
      {/* Background Animated Game Arena Particles & Drifting Fingers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Game Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-25 filter blur-[120px]"
          style={{ background: 'radial-gradient(circle, #0066cc 0%, rgba(41,151,255,0) 70%)' }}
        />
        <div
          className="absolute bottom-10 left-1/3 w-[400px] h-[400px] rounded-full opacity-20 filter blur-[100px]"
          style={{ background: 'radial-gradient(circle, #ff2d55 0%, rgba(255,45,85,0) 70%)' }}
        />

        {/* Live Drifting Arcade Sprites Preview */}
        {backgroundFingers.map((f) => (
          <div
            key={f.id}
            className="absolute text-4xl sm:text-5xl opacity-20"
            style={{
              left: `${f.left}%`,
              animation: `arcade-fall ${f.duration}s linear infinite`,
              animationDelay: `${f.delay}s`,
              filter: f.broken ? 'drop-shadow(0 0 12px rgba(255, 69, 58, 0.7))' : 'none',
            }}
          >
            {f.icon}
          </div>
        ))}

        {/* Arcade Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* TOP BAR: Score Trophy + Seasonal Badge */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-lg mx-auto pt-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/10 shadow-sm">
          <span className="text-sm">🏆</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold text-white/50 tracking-wider uppercase leading-none">High Score</span>
            <span className="text-sm font-black text-[#2997ff] leading-none mt-0.5">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/10 text-xs font-semibold text-white/90 shadow-sm">
          <span>{seasonal.emoji}</span>
          <span>{seasonal.name}</span>
        </div>
      </header>

      {/* CENTER STAGE: Game Title, Hero Mascot & Primary Action */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto text-center px-2">
        {/* Animated Bandage Hero Character */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-[#0066cc]/40 filter blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="text-7xl sm:text-8xl relative animate-bounce">
            🩹
          </div>
        </div>

        {/* Title — Heavy Arcade Typography with Apple Letter-Spacing */}
        <div className="mb-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.04em] uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Falling Fingers
          </h1>
          <p className="text-xs sm:text-sm text-[#2997ff] font-bold tracking-widest uppercase mt-1">
            Tap Broken Fingers · Beat The Clock
          </p>
        </div>

        {/* Power-Up Preview HUD Pill */}
        <div className="flex items-center justify-center gap-2 my-3 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-lg">
          <span className="text-[11px] font-semibold text-white/70" title="Gold 5x">🌟 5×</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] font-semibold text-white/70" title="Swift Speed">⚡ Fast</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] font-semibold text-white/70" title="Extra Life">❤️‍🩹 Heal</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] font-semibold text-white/70" title="Damage Shield">🛡️ Shield</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] font-semibold text-white/70" title="Time Slow">🐌 Freeze</span>
        </div>

        {/* Arcade Difficulty Selector */}
        <div className="w-full max-w-xs bg-black/40 backdrop-blur-2xl p-1 rounded-full border border-white/10 flex items-center justify-between gap-1 mb-2 shadow-inner">
          {difficulties.map((d) => {
            const cfg = DIFFICULTY_CONFIG[d];
            const selected = selectedDifficulty === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-tight transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 ${
                  selected
                    ? 'bg-[#0066cc] text-white shadow-[0_2px_12px_rgba(0,102,204,0.6)] border border-[#2997ff]/50'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/[0.05]'
                }`}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-white/40 font-medium mb-4">
          {DIFFICULTY_CONFIG[selectedDifficulty].lives} Lives · {selectedDifficulty === 'easy' ? 'Gentle Rhythm' : selectedDifficulty === 'hard' ? 'Insane Velocity' : 'Standard Tempo'}
        </div>

        {/* PRIMARY ARCADE PLAY BUTTON */}
        <button
          onClick={() => onStart('classic', selectedDifficulty)}
          className="w-full max-w-xs py-4 px-8 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-lg font-black tracking-wider uppercase shadow-[0_8px_32px_rgba(0,102,204,0.55)] active:scale-95 transition-all duration-150 border border-[#2997ff]/40 flex items-center justify-center gap-2 animate-pulse"
        >
          <span>▶</span>
          <span>PLAY GAME</span>
        </button>

        {/* DAILY CHALLENGE ARCADE BUTTON */}
        <button
          onClick={() => onStart('daily', selectedDifficulty)}
          className="w-full max-w-xs py-2.5 px-6 mt-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-xs font-bold tracking-wider uppercase active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>📅 Daily Challenge</span>
          <span className="text-[10px] text-white/40">({getDailyDateString()})</span>
        </button>
      </main>

      {/* BOTTOM ARCADE DOCK: Game Mode Controls */}
      <footer className="relative z-10 w-full max-w-lg mx-auto pb-2">
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-lg">
          <button
            onClick={onShowLeaderboard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition"
          >
            🏆 <span>Scores</span>
          </button>
          <button
            onClick={onShowThemes}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition"
          >
            🎨 <span>Themes</span>
          </button>
          <button
            onClick={onShowTutorial}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition"
          >
            ❓ <span>How to Play</span>
          </button>
          <button
            onClick={onShowAchievements}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition"
          >
            🏅 <span>Badges</span>
          </button>
          <button
            onClick={onShowAccessibility}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition"
          >
            ♿ <span>Options</span>
          </button>
        </div>
      </footer>

      {/* Global Falling Finger Keyframe Animation */}
      <style>{`
        @keyframes arcade-fall {
          0% {
            transform: translateY(-80px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.25;
          }
          90% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuScreen;
