import { Finger, PowerUp } from './types';
import FingerSprite from './FingerSprite';
import GameHUD from './GameHUD';
import ComboPopup from './ComboPopup';
import PauseOverlay from './PauseOverlay';
import ParticleExplosion from './ParticleExplosion';
import PowerUpItem from './PowerUpItem';
import PowerUpIndicator from './PowerUpIndicator';
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
  screenShake: boolean;
  isMuted: boolean;
  powerUps: PowerUp[];
  floatingPowerUps: FloatingPowerUp[];
  gameMode: string;
  onTap: (id: string) => void;
  onPause: () => void;
  onResume: () => void;
  onMenu: () => void;
  onRemoveParticle: (id: number) => void;
  onToggleMute: () => void;
  onCollectPowerUp: (id: string) => void;
}

const GameScreen = ({
  fingers, score, lives, level, combo, comboPopups, particles,
  isPaused, screenShake, isMuted, powerUps, floatingPowerUps, gameMode,
  onTap, onPause, onResume, onMenu, onRemoveParticle, onToggleMute, onCollectPowerUp,
}: GameScreenProps) => {
  return (
    <div
      className="relative w-full h-screen overflow-hidden transition-transform"
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

      {fingers.map(finger => (
        <FingerSprite key={finger.id} finger={finger} onTap={onTap} />
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

      {isPaused && <PauseOverlay onResume={onResume} onMenu={onMenu} />}
    </div>
  );
};

export default GameScreen;
