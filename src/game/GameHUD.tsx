interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
  combo: number;
  isMuted: boolean;
  onPause: () => void;
  onToggleMute: () => void;
}

const GameHUD = ({ score, lives, level, combo, isMuted, onPause, onToggleMute }: GameHUDProps) => {
  const maxLives = 5;
  return (
    <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between px-4 py-2.5 rounded-full bg-[#1d1d1f]/75 backdrop-blur-xl border border-white/10 shadow-lg select-none">
      {/* Controls cluster */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPause}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 transition flex items-center justify-center text-sm"
          title="Pause"
        >
          ⏸️
        </button>
        <button
          onClick={onToggleMute}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 transition flex items-center justify-center text-sm"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="flex items-center gap-1 pl-1">
          <span className="font-display text-[10px] text-white/50 tracking-wider">LVL</span>
          <span className="font-display text-sm font-bold text-[#2997ff]">{level}</span>
        </div>
      </div>

      {/* Center Score & Combo Badge */}
      <div className="flex flex-col items-center">
        <div className="font-display text-xl font-black text-white tracking-tight leading-none">
          {score}
        </div>
        {combo >= 3 && (
          <span
            className="font-display text-[10px] font-bold tracking-widest uppercase animate-pulse mt-0.5"
            style={{
              color: combo >= 20 ? '#fbbf24' : combo >= 10 ? '#c084fc' : '#34d399',
              textShadow: '0 0 8px currentColor',
            }}
          >
            {combo}x STREAK
          </span>
        )}
      </div>

      {/* Lives cluster */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxLives }).map((_, i) => (
          <span
            key={i}
            className={`text-base transition-all duration-300 ${
              i < lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75 filter grayscale'
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
