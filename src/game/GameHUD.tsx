interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
  combo: number;
  onPause: () => void;
}

const GameHUD = ({ score, lives, level, combo, onPause }: GameHUDProps) => {
  const maxLives = 5;
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onPause}
          className="font-display text-lg text-muted-foreground active:scale-90 transition-transform p-1"
        >
          ⏸️
        </button>
        <div className="flex items-center gap-1">
          <span className="font-display text-sm text-muted-foreground">LVL</span>
          <span className="font-display text-lg font-bold text-primary text-glow">{level}</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span className="font-display text-xs text-muted-foreground tracking-widest">SCORE</span>
        <span className="font-display text-2xl font-black text-primary text-glow">{score}</span>
        {combo >= 3 && (
          <span
            className="font-display text-xs font-bold tracking-wider animate-pulse"
            style={{
              color: combo >= 20 ? 'hsl(45 100% 55%)' : combo >= 10 ? 'hsl(280 80% 55%)' : 'hsl(160 100% 45%)',
              textShadow: `0 0 8px currentColor`,
            }}
          >
            {combo}x COMBO!
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: maxLives }).map((_, i) => (
          <span
            key={i}
            className={`text-lg transition-all duration-300 ${
              i < lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
            }`}
          >
            {i < lives ? '❤️' : '🖤'}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GameHUD;
