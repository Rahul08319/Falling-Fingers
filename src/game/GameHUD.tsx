interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
}

const GameHUD = ({ score, lives, level }: GameHUDProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-display text-sm text-muted-foreground">LVL</span>
        <span className="font-display text-lg font-bold text-primary text-glow">{level}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-display text-xs text-muted-foreground tracking-widest">SCORE</span>
        <span className="font-display text-2xl font-black text-primary text-glow">{score}</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`text-xl transition-all duration-300 ${
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
