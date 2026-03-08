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
  score, highScore, isNewHighScore, maxCombo, showInitials, gameMode,
  onRestart, onMenu, onSubmitInitials, onShowLeaderboard,
}: GameOverScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-in fade-in duration-500">
      <div className="text-6xl mb-4">💀</div>

      <h2 className="font-display text-3xl font-black text-accent mb-2"
        style={{ textShadow: '0 0 20px hsl(340 90% 55% / 0.6)' }}>
        GAME OVER
      </h2>

      {gameMode === 'daily' && (
        <span className="font-display text-xs px-3 py-1 rounded-full bg-accent/20 text-accent tracking-widest mb-2">
          📅 DAILY CHALLENGE
        </span>
      )}

      {isNewHighScore && (
        <div className="font-display text-sm text-primary text-glow tracking-widest mb-4 animate-pulse">
          ✨ NEW HIGH SCORE ✨
        </div>
      )}

      <div className="bg-card rounded-2xl p-6 mb-6 min-w-[200px] border border-border">
        <div className="text-center mb-3">
          <span className="font-display text-xs text-muted-foreground tracking-widest">SCORE</span>
          <div className="font-display text-4xl font-black text-primary text-glow">{score}</div>
        </div>
        <div className="text-center mb-3">
          <span className="font-display text-xs text-muted-foreground tracking-widest">BEST</span>
          <div className="font-display text-xl font-bold text-secondary" style={{ textShadow: '0 0 10px hsl(280 80% 55% / 0.4)' }}>
            {highScore}
          </div>
        </div>
        {maxCombo >= 3 && (
          <div className="text-center">
            <span className="font-display text-xs text-muted-foreground tracking-widest">MAX COMBO</span>
            <div className="font-display text-lg font-bold text-accent">{maxCombo}x</div>
          </div>
        )}
      </div>

      {showInitials && (
        <div className="mb-6">
          <InitialsInput onSubmit={onSubmitInitials} />
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-[250px]">
        <button
          onClick={onRestart}
          className="font-display text-lg font-bold px-8 py-3 rounded-2xl bg-primary text-primary-foreground glow-primary active:scale-95 transition-all duration-150 tracking-wider"
        >
          RETRY
        </button>
        <button
          onClick={onShowLeaderboard}
          className="font-display text-sm font-bold px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground active:scale-95 transition-all duration-150 tracking-wider"
        >
          🏆 LEADERBOARD
        </button>
        <button
          onClick={onMenu}
          className="font-display text-sm font-bold px-8 py-3 rounded-2xl bg-muted text-muted-foreground active:scale-95 transition-all duration-150 tracking-wider"
        >
          MENU
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
