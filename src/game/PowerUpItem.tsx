import { PowerUpType } from './types';

interface PowerUpItemProps {
  type: PowerUpType;
  x: number;
  y: number;
  onCollect: () => void;
}

const PowerUpItem = ({ type, x, y, onCollect }: PowerUpItemProps) => {
  const icon: Record<PowerUpType, string> = { shield: '🛡️', slowmo: '🐌', magnet: '🧲', freeze: '❄️', comboShield: '🔥' };
  return (
    <button
      onClick={onCollect}
      className="absolute z-10 animate-pulse active:scale-75 transition-transform"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))',
      }}
    >
      <div className="relative">
        <span>{icon[type]}</span>
        <div
          className="absolute inset-0 rounded-full -z-10"
          style={{
            background: type === 'shield' || type === 'comboShield'
              ? 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--secondary) / 0.3), transparent 70%)',
            transform: 'scale(2)',
          }}
        />
      </div>
    </button>
  );
};

export default PowerUpItem;
