import { useEffect } from 'react';
import { Finger, PowerUp } from './types';
import FingerSprite from './FingerSprite';
import GameHUD from './GameHUD';
import ComboPopup from './ComboPopup';
import PauseOverlay from './PauseOverlay';
import ParticleExplosion from './ParticleExplosion';
import PowerUpItem from './PowerUpItem';
import PowerUpIndicator from './PowerUpIndicator';
import GameProgressPanel, { BossWaveState } from './GameProgressPanel';
import { getAccessibility } from './progression';
import { ParticleEvent, FloatingPowerUp } from './useGameLoop';

interface GameScreenProps {
  fingers: Finger[];
  score: number;
  lives: number;
  level: number;
  combo: number;
  comboPopups: { id: number; x: number; y: number; text: string; color: string }[];
  particles: ParticleEvent[];
  isPaused: boolean;
  isSystemPaused: boolean;
  screenShake: boolean;
  isMuted: boolean;
  powerUps: PowerUp[];
  floatingPowerUps: FloatingPowerUp[];
  missionProgress: number;
  bossWave: BossWaveState | null;
  gameMode: string;
  onTap: (id: string) => void;
  onPause: () => void;
  onResume: () => void;
  onRemoveParticle: (id: number) => void;
  onToggleMute: () => void;
  onCollectPowerUp: (id: string) => void;
}

const GameScreen = ({
  fingers, score, lives, level, combo, comboPopups, particles,
  isPaused, isSystemPaused, screenShake, isMuted, powerUps, floatingPowerUps, missionProgress, bossWave, gameMode,
  onTap, onPause, onResume, onRemoveParticle, onToggleMute, onCollectPowerUp,
}: GameScreenProps) => {
  const shieldActive = powerUps.some(p => p.type === 'shield' && p.active);
  const slowMoActive = powerUps.some(p => p.type === 'slowmo' && p.active);
  const { largerTargets } = getAccessibility();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') (isPaused ? onResume : onPause)();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPaused, onPause, onResume]);

  return (
    <div
      className="playables-viewport relative transition-transform"
      style={{
        transform: screenShake
          ? `translate(${(Math.random() - 0.5) * 8}px, ${(Math.random() - 0.5) * 8}px)`
          : 'none',
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(0 85% 55% / 0.15), transparent)',
        }}
      />

      {shieldActive && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-10 animate-pulse"
            style={{
              boxShadow: 'inset 0 0 60px 10px hsl(200 90% 55% / 0.55), inset 0 0 120px 0 hsl(200 90% 55% / 0.25)',
              border: '2px solid hsl(200 90% 60% / 0.8)',
            }}
          />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 font-display text-[10px] px-3 py-1 rounded-full bg-[hsl(200_90%_55%/0.25)] text-[hsl(200_90%_75%)] tracking-widest border border-[hsl(200_90%_60%/0.6)]">
            🛡️ SHIELD ACTIVE
          </div>
        </>
      )}

      {slowMoActive && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, hsl(280 80% 55% / 0.18) 100%)',
          }}
        />
      )}

      {gameMode === 'daily' && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30">
          <span className="font-display text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent tracking-widest">
            📅 DAILY
          </span>
        </div>
      )}

      <GameHUD
        score={score}
        lives={lives}
        level={level}
        combo={combo}
        isMuted={isMuted}
        onPause={onPause}
        onToggleMute={onToggleMute}
      />

      <GameProgressPanel score={score} missionProgress={missionProgress} bossWave={bossWave} />

      {fingers.map(finger => (
        <FingerSprite key={finger.id} finger={finger} onTap={onTap} largerTargets={largerTargets} />
      ))}

      {floatingPowerUps.map(pu => (
        <PowerUpItem
          key={pu.id}
          type={pu.type}
          x={pu.x}
          y={pu.y}
          onCollect={() => onCollectPowerUp(pu.id)}
        />
      ))}

      {comboPopups.map(popup => (
        <ComboPopup key={popup.id} x={popup.x} y={popup.y} text={popup.text} color={popup.color} />
      ))}

      {particles.map(p => (
        <ParticleExplosion
          key={p.id}
          x={p.x}
          y={p.y}
          color={p.color}
          onDone={() => onRemoveParticle(p.id)}
        />
      ))}

      <PowerUpIndicator powerUps={powerUps} />

      {isPaused && <PauseOverlay onResume={onResume} isSystemPaused={isSystemPaused} />}
    </div>
  );
};

export default GameScreen;
