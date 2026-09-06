import { ACHIEVEMENTS, getAchievements } from './progression';

interface AchievementsScreenProps { onClose: () => void; }
const AchievementsScreen = ({ onClose }: AchievementsScreenProps) => {
  const unlocked = getAchievements();
  return <div className="flex min-h-screen flex-col items-center px-5 py-8">
    <h1 className="font-display text-2xl font-black text-primary text-glow">🏅 ACHIEVEMENTS</h1>
    <p className="mt-2 text-sm text-muted-foreground">{unlocked.length}/{ACHIEVEMENTS.length} unlocked</p>
    <div className="mt-6 w-full max-w-md space-y-3">
      {ACHIEVEMENTS.map(item => { const earned = unlocked.includes(item.id); return <div key={item.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${earned ? 'border-primary bg-primary/10' : 'border-border bg-card/50 opacity-60'}`}>
        <span className="text-3xl">{earned ? item.emoji : '🔒'}</span><span><b className="font-display text-sm">{item.name}</b><small className="mt-1 block text-muted-foreground">{item.description}</small></span>
      </div>; })}
    </div>
    <button onClick={onClose} className="mt-6 rounded-2xl bg-secondary px-8 py-3 font-display text-sm font-bold text-secondary-foreground">← BACK</button>
  </div>;
};
export default AchievementsScreen;
