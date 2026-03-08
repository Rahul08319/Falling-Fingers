interface MenuScreenProps {
  onStart: () => void;
  highScore: number;
}

const MenuScreen = ({ onStart, highScore }: MenuScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${160 + Math.random() * 120} 80% 50%)`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-7xl mb-4 animate-bounce">🩹</div>

      <h1 className="font-display text-4xl font-black text-primary text-glow mb-2 text-center tracking-tight">
        FALLING
      </h1>
      <h1 className="font-display text-5xl font-black text-accent mb-6 text-center tracking-tight"
        style={{ textShadow: '0 0 20px hsl(340 90% 55% / 0.6)' }}>
        FINGERS
      </h1>

      <p className="font-body text-lg text-muted-foreground text-center mb-4 max-w-xs leading-relaxed">
        Tap the <span className="text-accent font-bold">broken</span> fingers to fix them.
        <br />Don't let them escape!
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xs">
        <span className="text-xs font-display px-2 py-1 rounded-lg bg-card border border-border text-muted-foreground">🌟 Golden = 5x pts</span>
        <span className="text-xs font-display px-2 py-1 rounded-lg bg-card border border-border text-muted-foreground">⚡ Speed = fast</span>
        <span className="text-xs font-display px-2 py-1 rounded-lg bg-card border border-border text-muted-foreground">❤️‍🩹 Heal = +1 life</span>
      </div>

      <button
        onClick={onStart}
        className="font-display text-xl font-bold px-12 py-4 rounded-2xl bg-primary text-primary-foreground glow-primary active:scale-95 transition-all duration-150 tracking-wider"
      >
        PLAY
      </button>

      {highScore > 0 && (
        <div className="mt-6 text-center">
          <span className="font-display text-xs text-muted-foreground tracking-widest">BEST</span>
          <div className="font-display text-2xl font-bold text-secondary" style={{ textShadow: '0 0 15px hsl(280 80% 55% / 0.5)' }}>
            {highScore}
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default MenuScreen;
