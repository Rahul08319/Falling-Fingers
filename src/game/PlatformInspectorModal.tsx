import { useState, useEffect } from 'react';
import { PlatformManager, PLATFORM_REGISTRY, PlatformId } from '../platforms';
import { requestInterstitialAd, requestRewardedAd, savePlayablesData, readLocalSave } from './playables';

interface PlatformInspectorModalProps {
  onClose: () => void;
  onRevive?: () => void;
}

export const PlatformInspectorModal = ({ onClose, onRevive }: PlatformInspectorModalProps) => {
  const [currentId, setCurrentId] = useState<PlatformId>(() => PlatformManager.getBridge().id);
  const [adStatus, setAdStatus] = useState<string | null>(null);
  const [saveInspection, setSaveInspection] = useState<string>('');

  useEffect(() => {
    const unsub = PlatformManager.onPlatformChange((bridge) => {
      setCurrentId(bridge.id);
    });
    return unsub;
  }, []);

  const handleSelectPlatform = async (id: PlatformId) => {
    await PlatformManager.setPlatform(id);
    setCurrentId(id);
    setAdStatus(`Switched to ${id.toUpperCase()}`);
    setTimeout(() => setAdStatus(null), 2500);
  };

  const handleTestInterstitial = async () => {
    setAdStatus('Requesting Interstitial Ad...');
    const result = await requestInterstitialAd();
    setAdStatus(result ? '✅ Interstitial Ad Completed' : '❌ Interstitial Ad Dismissed/Unavailable');
    setTimeout(() => setAdStatus(null), 3000);
  };

  const handleTestRewarded = async () => {
    setAdStatus('Requesting Rewarded Ad (revive-test)...');
    const earned = await requestRewardedAd('revive_test_reward');
    if (earned) {
      setAdStatus('🎉 Reward Earned! (Life Restored)');
      onRevive?.();
    } else {
      setAdStatus('❌ Rewarded Ad Skipped/Failed');
    }
    setTimeout(() => setAdStatus(null), 3000);
  };

  const handleInspectSave = () => {
    const payload = readLocalSave();
    const json = JSON.stringify(payload, null, 2);
    const bytes = new Blob([json]).size;
    const isWellFormed = (json as string & { isWellFormed?: () => boolean }).isWellFormed?.() ?? true;
    setSaveInspection(`Size: ${bytes} bytes (Limit: 3 MiB)\nUTF-16 Valid: ${isWellFormed}\n\n${json}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1d1d1f]/90 border border-white/10 shadow-2xl p-6 text-white backdrop-blur-2xl flex flex-col gap-5">
        {/* Apple modal header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#2997ff]">Cross-Platform Suite</span>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Platform Inspector
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center justify-center text-sm font-bold text-white/80"
          >
            ✕
          </button>
        </div>

        {/* Current Active Platform Banner */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50 font-medium">ACTIVE PLATFORM RUNTIME</div>
            <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              {PlatformManager.getBridge().name}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0066cc] text-white font-medium">
                Active
              </span>
            </div>
            <div className="text-xs text-white/70 mt-1">
              {PLATFORM_REGISTRY.find((p) => p.id === currentId)?.description}
            </div>
          </div>
        </div>

        {/* Platform Switcher Matrix */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2 block">
            Select Platform Target (13 Native SDKs · No Playgama)
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {PLATFORM_REGISTRY.map((p) => {
              const isSelected = p.id === currentId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlatform(p.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-medium transition active:scale-95 ${
                    isSelected
                      ? 'bg-[#0066cc] border-[#2997ff] text-white shadow-lg shadow-[#0066cc]/30'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="truncate">{p.badge} {p.name}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ad & Lifecycle Test Controls */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
            SDK Ad & Lifecycle Verification
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleTestInterstitial}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold tracking-wide text-white transition flex items-center gap-1.5"
            >
              🎬 Test Interstitial
            </button>
            <button
              onClick={handleTestRewarded}
              className="px-4 py-2 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 text-xs font-semibold tracking-wide text-white transition shadow-md flex items-center gap-1.5"
            >
              🎁 Test Rewarded Ad
            </button>
            <button
              onClick={handleInspectSave}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold tracking-wide text-white transition flex items-center gap-1.5"
            >
              💾 Inspect Save Data
            </button>
          </div>

          {adStatus && (
            <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-center text-[#2997ff] animate-in fade-in">
              {adStatus}
            </div>
          )}
        </div>

        {/* Save Data Inspector Output */}
        {saveInspection && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-3 max-h-36 overflow-y-auto font-mono text-[11px] text-white/80 whitespace-pre-wrap">
            {saveInspection}
          </div>
        )}

        {/* Close CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#0066cc] hover:bg-[#0071e3] active:scale-95 transition text-sm font-semibold text-white tracking-wide shadow-lg shadow-[#0066cc]/40"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default PlatformInspectorModal;
