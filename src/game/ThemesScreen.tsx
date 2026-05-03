import { useState } from 'react';
import { THEMES, getActiveThemeId, setActiveThemeId, isThemeUnlocked } from './themes';

interface ThemesScreenProps {
  onClose: () => void;
  highScore: number;
}

const ThemesScreen = ({ onClose, highScore }: ThemesScreenProps) => {
  const [active, setActive] = useState(getActiveThemeId());

  const select = (id: string) => {
    setActiveThemeId(id);
    setActive(id);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 overflow-y-auto">
      <h1 className="font-display text-3xl font-black text-primary text-glow mb-2 tracking-tight">
        🎨 THEMES
      </h1>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Unlock new looks by beating high scores
      </p>

      <div className="w-full max-w-md flex flex-col gap-3 mb-6">
        {THEMES.map(theme => {
          const unlocked = isThemeUnlocked(theme);
          const isActive = active === theme.id;
          return (
            <button
              key={theme.id}
              disabled={!unlocked}
              onClick={() => unlocked && select(theme.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary glow-primary'
                  : unlocked
                  ? 'bg-card text-foreground border-border active:scale-95'
                  : 'bg-card/50 text-muted-foreground border-border opacity-60'
              }`}
            >
              <div className="text-3xl">{unlocked ? theme.emoji : '🔒'}</div>
              <div className="flex-1">
                <div className="font-display font-bold tracking-wider">{theme.name}</div>
                <div className="text-xs opacity-80 font-body">
                  {unlocked ? theme.description : `Unlock at ${theme.unlockScore} pts (best: ${highScore})`}
                </div>
              </div>
              {isActive && <div className="font-display text-xs">ACTIVE</div>}
            </button>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="font-display text-sm font-bold px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground active:scale-95 tracking-wider"
      >
        ← BACK
      </button>
    </div>
  );
};

export default ThemesScreen;
