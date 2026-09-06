interface PauseOverlayProps {
  onResume: () => void;
  isSystemPaused: boolean;
}

const PauseOverlay = ({ onResume, isSystemPaused }: PauseOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-5xl mb-4">⏸️</div>
      <h2 className="font-display text-3xl font-black text-primary text-glow mb-8">{isSystemPaused ? 'PAUSED BY YOUTUBE' : 'PAUSED'}</h2>
      <div className="flex flex-col gap-3 w-full max-w-[220px]">
        {!isSystemPaused && (
          <button
            onClick={onResume}
            className="font-display text-lg font-bold px-8 py-3 rounded-2xl bg-primary text-primary-foreground glow-primary active:scale-95 transition-all duration-150 tracking-wider"
          >
            RESUME
          </button>
        )}
      </div>
    </div>
  );
};

export default PauseOverlay;
