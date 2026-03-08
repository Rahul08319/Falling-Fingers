import { Finger } from './types';
import FingerSprite from './FingerSprite';
import GameHUD from './GameHUD';
import ComboPopup from './ComboPopup';
import PauseOverlay from './PauseOverlay';
import ParticleExplosion from './ParticleExplosion';
import { ParticleEvent } from './useGameLoop';

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
  onTap: (id: string) => void;
  onPause: () => void;
  onResume: () => void;
  onMenu: () => void;
  onRemoveParticle: (id: number) => void;
  onToggleMute: () => void;
}

const GameScreen = ({
  fingers, score, lives, level, combo, comboPopups, particles,
  isPaused, screenShake, isMuted,
  onTap, onPause, onResume, onMenu, onRemoveParticle, onToggleMute,
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

      {isPaused && <PauseOverlay onResume={onResume} onMenu={onMenu} />}
    </div>
  );
};

export default GameScreen;
