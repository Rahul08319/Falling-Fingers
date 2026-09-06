import { Finger } from './types';

interface FingerSpriteProps {
  finger: Finger;
  onTap: (id: string) => void;
  largerTargets?: boolean;
}

const fingerEmojis = ['👆', '👇', '🖐️', '✋', '🤚'];
const brokenEmojis = ['🩹', '🤕', '💢', '❌', '⚡'];

const specialGlow: Record<string, string> = {
  normal: 'drop-shadow(0 0 12px hsl(0 85% 55% / 0.8))',
  golden: 'drop-shadow(0 0 16px hsl(45 100% 55% / 0.9)) drop-shadow(0 0 30px hsl(45 100% 55% / 0.4))',
  speed: 'drop-shadow(0 0 14px hsl(200 100% 55% / 0.8)) drop-shadow(0 0 24px hsl(200 100% 55% / 0.3))',
  heal: 'drop-shadow(0 0 14px hsl(340 90% 55% / 0.8)) drop-shadow(0 0 24px hsl(340 90% 55% / 0.3))',
};

const FingerSprite = ({ finger, onTap, largerTargets = false }: FingerSpriteProps) => {
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTap(finger.id);
  };

  let emoji: string;
  if (finger.fixed) {
    emoji = '✅';
  } else if (!finger.isBroken) {
    emoji = fingerEmojis[finger.fingerType % fingerEmojis.length];
  } else if (finger.specialType === 'golden') {
    emoji = '🌟';
  } else if (finger.specialType === 'speed') {
    emoji = '⚡';
  } else if (finger.specialType === 'heal') {
    emoji = '❤️‍🩹';
  } else {
    emoji = brokenEmojis[finger.fingerType % brokenEmojis.length];
  }

  const glowFilter = finger.isBroken
    ? specialGlow[finger.specialType] || specialGlow.normal
    : 'drop-shadow(0 0 6px hsl(30 60% 65% / 0.4))';

  return (
    <div
      className={`absolute cursor-pointer select-none transition-transform duration-75 active:scale-90 ${
        finger.fixed ? 'scale-125' : ''
      } ${finger.specialType === 'speed' && !finger.fixed ? 'animate-pulse' : ''}`}
      style={{
        left: `${finger.x}%`,
        top: `${finger.y}%`,
        transform: `translate(-50%, -50%) rotate(${finger.rotation}deg)`,
        opacity: finger.opacity,
        fontSize: `${(finger.specialType === 'golden' ? 3.5 : finger.isBroken ? 3 : 2.5) * (largerTargets ? 1.3 : 1)}rem`,
        filter: glowFilter,
        zIndex: 10,
      }}
      onMouseDown={handleTap}
      onTouchStart={handleTap}
    >
      {emoji}
    </div>
  );
};

export default FingerSprite;
