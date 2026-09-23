import { useState, useEffect } from 'react';
import { requestRewardedAd } from './playables';

interface RewardedReviveModalProps {
  score: number;
  onRevive: () => void;
  onDecline: () => void;
}

export const RewardedReviveModal = ({ score, onRevive, onDecline }: RewardedReviveModalProps) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onDecline]);

  const handleWatchAd = async () => {
    setIsLoadingAd(true);
    const earned = await requestRewardedAd('revive_extra_life');
    setIsLoadingAd(false);
    if (earned) {
      onRevive();
    } else {
      onDecline();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#1d1d1f]/95 border border-white/10 shadow-2xl p-6 text-center text-white backdrop-blur-2xl flex flex-col items-center gap-4">
        {/* Apple Heart Icon with Pulse */}
        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-3xl animate-bounce">
          ❤️‍🩹
        </div>

        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#2997ff]">
            Last Chance
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
            Revive & Keep Going?
          </h2>
          <p className="text-xs text-white/70 mt-1 max-w-[220px]">
            Watch a quick ad to regain +1 Life and continue your run at {score} pts!
          </p>
        </div>

        {/* Circular Countdown Progress */}
        <div className="flex items-center justify-center gap-2 font-mono text-sm text-white/60">
          Auto-skip in <span className="font-bold text-white text-base px-2 py-0.5 rounded-full bg-white/10">{secondsLeft}s</span>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={handleWatchAd}
            disabled={isLoadingAd}
            className="w-full py-3.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 transition text-sm font-bold tracking-wide text-white shadow-lg shadow-[#0066cc]/40 flex items-center justify-center gap-2"
          >
            {isLoadingAd ? (
              <span className="animate-pulse">Loading Ad...</span>
            ) : (
              <>
                <span>▶️ Watch Ad to Revive</span>
              </>
            )}
          </button>

          <button
            onClick={onDecline}
            className="w-full py-2.5 rounded-full bg-transparent hover:bg-white/5 active:scale-95 transition text-xs font-semibold text-white/60"
          >
            No thanks, end game
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardedReviveModal;
