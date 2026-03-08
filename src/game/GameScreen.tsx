import { Finger } from './types';
import FingerSprite from './FingerSprite';
import GameHUD from './GameHUD';

interface GameScreenProps {
  fingers: Finger[];
  score: number;
  lives: number;
  level: number;
  onTap: (id: string) => void;
}

const GameScreen = ({ fingers, score, lives, level, onTap }: GameScreenProps) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Subtle grid background */}
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

      {/* Danger zone at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(0 85% 55% / 0.15), transparent)',
        }}
      />

      <GameHUD score={score} lives={lives} level={level} />

      {fingers.map(finger => (
        <FingerSprite key={finger.id} finger={finger} onTap={onTap} />
      ))}
    </div>
  );
};

export default GameScreen;
