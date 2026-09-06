import { PowerUp } from './types';

const icons: Record<PowerUp['type'], string> = { shield: '🛡️', slowmo: '🐌', magnet: '🧲', freeze: '❄️', comboShield: '🔥' };

interface PowerUpIndicatorProps {
  powerUps: PowerUp[];
}

const PowerUpIndicator = ({ powerUps }: PowerUpIndicatorProps) => {
  const activePowerUps = powerUps.filter(p => p.active);
  if (activePowerUps.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
      {activePowerUps.map((pu, i) => {
        const elapsed = Date.now() - pu.startTime;
        const progress = Math.max(0, 1 - elapsed / pu.duration);
        return (
          <div
            key={`${pu.type}-${i}`}
            className="flex flex-col items-center gap-1 animate-in fade-in"
          >
            <div
              className="font-display text-2xl"
              style={{ filter: `brightness(${0.6 + progress * 0.4})` }}
            >
              {icons[pu.type]}
            </div>
            <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress * 100}%`,
                  background: pu.type === 'shield' || pu.type === 'comboShield'
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--secondary))',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PowerUpIndicator;
