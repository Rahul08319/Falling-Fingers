interface BossWaveState {
  wave: number;
  fixed: number;
  target: number;
  active: boolean;
  cleared: boolean;
}

interface GameProgressPanelProps {
  score: number;
  missionProgress: number;
  bossWave: BossWaveState | null;
}

const GameProgressPanel = ({ score, missionProgress, bossWave }: GameProgressPanelProps) => {
  const nextMilestone = 25 - (score % 25 || 25);

  return (
    <div className="absolute top-14 left-3 z-30 flex flex-col gap-1.5 pointer-events-none">
      {bossWave?.active ? (
        <div className="rounded-xl border border-accent/70 bg-background/85 px-3 py-1.5 shadow-lg">
          <div className="font-display text-[10px] tracking-widest text-accent">🖐️ BOSS WAVE {bossWave.wave}</div>
          <div className="font-display text-xs text-foreground">FIX {bossWave.fixed}/{bossWave.target} · +10 BONUS</div>
        </div>
      ) : (
        <div className="rounded-lg bg-card/75 px-2 py-1 font-display text-[9px] tracking-wider text-muted-foreground">
          NEXT BOSS · {nextMilestone} PTS
        </div>
      )}
      <div className="rounded-lg bg-card/75 px-2 py-1 font-display text-[9px] tracking-wider text-muted-foreground">
        🎯 MISSION · {missionProgress}/10
      </div>
    </div>
  );
};

export type { BossWaveState };
export default GameProgressPanel;
