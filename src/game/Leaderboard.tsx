import { useState, useEffect } from 'react';
import { getDailyDateString } from './dailySeed';

export interface LeaderboardEntry {
  initials: string;
  score: number;
  combo: number;
  date: string;
}

const STORAGE_KEY = 'falling-fingers-leaderboard';
const DAILY_KEY = 'falling-fingers-leaderboard-daily';
const DAILY_DATE_KEY = 'falling-fingers-leaderboard-daily-date';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export function getDailyLeaderboard(): LeaderboardEntry[] {
  const storedDate = localStorage.getItem(DAILY_DATE_KEY);
  if (storedDate !== todayKey()) {
    localStorage.setItem(DAILY_DATE_KEY, todayKey());
    localStorage.setItem(DAILY_KEY, '[]');
    return [];
  }
  try { return JSON.parse(localStorage.getItem(DAILY_KEY) || '[]'); } catch { return []; }
}

function writeBoard(key: string, board: LeaderboardEntry[]) {
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(board.slice(0, 10)));
}

export function addToLeaderboard(entry: LeaderboardEntry): void {
  const all = getLeaderboard();
  all.push(entry);
  writeBoard(STORAGE_KEY, all);

  const daily = getDailyLeaderboard();
  daily.push(entry);
  writeBoard(DAILY_KEY, daily);
}

export function isLeaderboardWorthy(score: number): boolean {
  if (score <= 0) return false;
  const all = getLeaderboard();
  if (all.length < 10 || score > all[all.length - 1].score) return true;
  const daily = getDailyLeaderboard();
  if (daily.length < 10 || score > daily[daily.length - 1].score) return true;
  return false;
}

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard = ({ onClose }: LeaderboardProps) => {
  const [tab, setTab] = useState<'all' | 'daily'>('all');
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [dailyEntries, setDailyEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setAllEntries(getLeaderboard());
    setDailyEntries(getDailyLeaderboard());
  }, []);

  const entries = tab === 'all' ? allEntries : dailyEntries;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-in fade-in duration-300">
      <h2 className="font-display text-2xl font-black text-primary text-glow mb-4 tracking-wider">
        🏆 LEADERBOARD
      </h2>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab('all')}
          className={`font-display text-xs font-bold px-4 py-2 rounded-xl tracking-wider transition-all active:scale-95 border ${
            tab === 'all' ? 'bg-primary text-primary-foreground border-primary glow-primary' : 'bg-card text-muted-foreground border-border'
          }`}
        >
          ALL-TIME
        </button>
        <button
          onClick={() => setTab('daily')}
          className={`font-display text-xs font-bold px-4 py-2 rounded-xl tracking-wider transition-all active:scale-95 border ${
            tab === 'daily' ? 'bg-accent text-accent-foreground border-accent' : 'bg-card text-muted-foreground border-border'
          }`}
        >
          📅 DAILY
        </button>
      </div>

      {tab === 'daily' && (
        <div className="text-[10px] text-muted-foreground font-display mb-2 tracking-widest">
          {getDailyDateString()} • RESETS AT MIDNIGHT
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border w-full max-w-[320px] overflow-hidden mb-6">
        <div className="grid grid-cols-[40px_60px_1fr_60px] gap-1 px-3 py-2 border-b border-border">
          <span className="font-display text-[10px] text-muted-foreground">#</span>
          <span className="font-display text-[10px] text-muted-foreground">NAME</span>
          <span className="font-display text-[10px] text-muted-foreground text-right">SCORE</span>
          <span className="font-display text-[10px] text-muted-foreground text-right">COMBO</span>
        </div>

        {entries.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground font-body text-sm">
            {tab === 'daily' ? 'No scores today. Be the first!' : 'No scores yet. Play to set records!'}
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
