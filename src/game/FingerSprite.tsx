import { Finger } from './types';

interface FingerSpriteProps {
  finger: Finger;
  onTap: (id: string) => void;
}

const fingerEmojis = ['👆', '👇', '🖐️', '✋', '🤚'];
const brokenEmojis = ['🩹', '🤕', '💢', '❌', '⚡'];

const FingerSprite = ({ finger, onTap }: FingerSpriteProps) => {
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTap(finger.id);
  };

  const emoji = finger.isBroken ? brokenEmojis[finger.fingerType % brokenEmojis.length] : fingerEmojis[finger.fingerType % fingerEmojis.length];

  return (
    <div
      className={`absolute cursor-pointer select-none transition-transform duration-75 active:scale-90 ${
        finger.fixed ? 'scale-125' : ''
      }`}
      style={{
        left: `${finger.x}%`,
        top: `${finger.y}%`,
        transform: `translate(-50%, -50%) rotate(${finger.rotation}deg)`,
        opacity: finger.opacity,
        fontSize: finger.isBroken ? '3rem' : '2.5rem',
        filter: finger.isBroken
          ? 'drop-shadow(0 0 12px hsl(0 85% 55% / 0.8))'
          : 'drop-shadow(0 0 6px hsl(30 60% 65% / 0.4))',
        zIndex: 10,
      }}
      onMouseDown={handleTap}
      onTouchStart={handleTap}
    >
      {finger.fixed ? '✅' : emoji}
    </div>
  );
};

export default FingerSprite;
