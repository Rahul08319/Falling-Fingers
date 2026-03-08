import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  initials: string;
  score: number;
  combo: number;
  date: string;
}

const STORAGE_KEY = 'falling-fingers-leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function addToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const top10 = board.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  return top10;
}

export function isLeaderboardWorthy(score: number): boolean {
  const board = getLeaderboard();
  if (board.length < 10) return score > 0;
  return score > board[board.length - 1].score;
}

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard = ({ onClose }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-in fade-in duration-300">
      <h2 className="font-display text-2xl font-black text-primary text-glow mb-6 tracking-wider">
        🏆 LEADERBOARD
      </h2>

      <div className="bg-card rounded-2xl border border-border w-full max-w-[320px] overflow-hidden mb-6">
        <div className="grid grid-cols-[40px_60px_1fr_60px] gap-1 px-3 py-2 border-b border-border">
          <span className="font-display text-[10px] text-muted-foreground">#</span>
          <span className="font-display text-[10px] text-muted-foreground">NAME</span>
          <span className="font-display text-[10px] text-muted-foreground text-right">SCORE</span>
          <span className="font-display text-[10px] text-muted-foreground text-right">COMBO</span>
        </div>

        {entries.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground font-body text-sm">
            No scores yet. Play to set records!
          </div>
        ) : (
          entries.map((entry, i) => (
            <div
              key={i}
              className={`grid grid-cols-[40px_60px_1fr_60px] gap-1 px-3 py-2 items-center ${
                i % 2 === 0 ? 'bg-muted/30' : ''
              } ${i < 3 ? 'bg-primary/5' : ''}`}
            >
              <span className="font-display text-sm">
                {i < 3 ? medals[i] : <span className="text-muted-foreground">{i + 1}</span>}
              </span>
              <span className="font-display text-sm font-bold text-foreground tracking-wider">
                {entry.initials}
              </span>
              <span className="font-display text-sm font-bold text-primary text-right">
                {entry.score}
              </span>
              <span className="font-display text-xs text-secondary text-right">
                {entry.combo}x
              </span>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onClose}
        className="font-display text-sm font-bold px-8 py-3 rounded-2xl bg-muted text-muted-foreground active:scale-95 transition-all duration-150 tracking-wider"
      >
        BACK
      </button>
    </div>
  );
};

export default Leaderboard;
