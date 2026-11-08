import { getLevelConfig } from './levels';

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
  gameMode?: string;
  campaignLevel?: number;
  levelFixes?: number;
}

const GameProgressPanel = ({
  score,
  missionProgress,
  bossWave,
  gameMode,
  campaignLevel,
  levelFixes,
}: GameProgressPanelProps) => {
  const nextMilestone = 25 - (score % 25 || 25);
  const lvlConfig = campaignLevel ? getLevelConfig(campaignLevel) : null;

  return (
    <div className="absolute top-14 left-3 z-30 flex flex-col gap-1.5 pointer-events-none">
      {gameMode === 'levels' && lvlConfig ? (
        <div className="rounded-xl border border-emerald-500/40 bg-[#12131a]/85 backdrop-blur-xl px-3 py-1.5 shadow-lg flex flex-col gap-1 min-w-[135px]">
          <div className="flex items-center justify-between text-[10px] font-bold text-white/90">
            <span>{lvlConfig.worldEmoji} LVL {campaignLevel}</span>
            <span className="text-emerald-400 font-mono">{levelFixes || 0}/{lvlConfig.targetFixes}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (((levelFixes || 0) / lvlConfig.targetFixes) * 100))}%` }}
            />
          </div>
          <div className="text-[9px] text-white/40 truncate">
            {lvlConfig.worldName}
          </div>
        </div>
      ) : bossWave?.active ? (
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
