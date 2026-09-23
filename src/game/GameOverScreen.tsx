import InitialsInput from './InitialsInput';
import { GameMode } from './types';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  maxCombo: number;
  showInitials: boolean;
  gameMode: GameMode;
  onRestart: () => void;
  onMenu: () => void;
  onSubmitInitials: (initials: string) => void;
  onShowLeaderboard: () => void;
}

const GameOverScreen = ({
  score,
  highScore,
  isNewHighScore,
  maxCombo,
  showInitials,
  gameMode,
  onRestart,
  onMenu,
  onSubmitInitials,
  onShowLeaderboard,
}: GameOverScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-in fade-in duration-300 select-none">
      <div className="text-6xl mb-3 animate-bounce">💀</div>

      <h2
        className="font-display text-3xl font-black text-white tracking-tight mb-1"
        style={{ textShadow: '0 0 20px rgba(255, 69, 58, 0.5)' }}
      >
        GAME OVER
      </h2>

      {gameMode === 'daily' && (
        <span className="font-display text-[10px] px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 tracking-widest mb-3">
          📅 DAILY CHALLENGE
        </span>
      )}

      {isNewHighScore && (
        <div className="font-display text-xs text-[#2997ff] tracking-widest uppercase mb-4 animate-pulse font-bold">
          ✨ New High Score ✨
        </div>
      )}

      {/* Apple Frosted Glass Stats Card */}
      <div className="rounded-3xl bg-[#1d1d1f]/80 border border-white/10 backdrop-blur-xl p-6 mb-6 min-w-[240px] shadow-2xl">
        <div className="text-center mb-4">
          <span className="font-display text-[10px] text-white/50 tracking-widest uppercase font-semibold">FINAL SCORE</span>
          <div className="font-display text-5xl font-black text-white tracking-tight mt-1">{score}</div>
        </div>
        <div className="flex justify-around items-center border-t border-white/10 pt-4">
          <div className="text-center">
            <span className="font-display text-[10px] text-white/50 tracking-widest uppercase">BEST</span>
            <div className="font-display text-xl font-bold text-[#2997ff] mt-0.5">{highScore}</div>
          </div>
          {maxCombo >= 3 && (
            <div className="text-center">
              <span className="font-display text-[10px] text-white/50 tracking-widest uppercase">STREAK</span>
              <div className="font-display text-xl font-bold text-amber-400 mt-0.5">{maxCombo}x</div>
            </div>
          )}
        </div>
      </div>

      {showInitials && (
        <div className="mb-6">
          <InitialsInput onSubmit={onSubmitInitials} />
        </div>
      )}

      {/* Apple Pill Action Column */}
      <div className="flex flex-col gap-2.5 w-full max-w-[260px]">
        <button
          onClick={onRestart}
          className="w-full font-display text-base font-bold py-3.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white shadow-lg shadow-[#0066cc]/40 active:scale-95 transition-all duration-150 tracking-wider"
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onShowLeaderboard}
          className="w-full font-display text-xs font-bold py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95 transition-all duration-150 tracking-wider"
        >
          🏆 LEADERBOARD
        </button>
        <button
          onClick={onMenu}
          className="w-full font-display text-xs font-semibold py-2.5 rounded-full bg-transparent hover:bg-white/5 text-white/60 active:scale-95 transition tracking-wider"
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
