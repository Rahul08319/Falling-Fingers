import { useState } from 'react';
import { AccessibilitySettings, getAccessibility, saveAccessibility } from './progression';

interface AccessibilityScreenProps { onClose: () => void; }

const AccessibilityScreen = ({ onClose }: AccessibilityScreenProps) => {
  const [settings, setSettings] = useState(getAccessibility());
  const toggle = (key: keyof AccessibilitySettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveAccessibility(next);
  };
  const items: { key: keyof AccessibilitySettings; emoji: string; title: string; body: string }[] = [
    { key: 'largerTargets', emoji: '🎯', title: 'Larger targets', body: 'Makes falling fingers easier to tap.' },
    { key: 'highContrast', emoji: '◐', title: 'High contrast', body: 'Strengthens UI contrast and outlines.' },
    { key: 'reducedMotion', emoji: '🌙', title: 'Reduced motion', body: 'Limits visual animation.' },
    { key: 'haptics', emoji: '📳', title: 'Haptics', body: 'Enables vibration feedback where supported.' },
  ];
  return <div className="flex min-h-screen flex-col items-center px-5 py-8">
    <h1 className="font-display text-2xl font-black text-primary text-glow">♿ ACCESSIBILITY</h1>
    <div className="mt-6 w-full max-w-md space-y-3">
      {items.map(item => <button key={item.key} onClick={() => toggle(item.key)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left active:scale-[0.98]">
        <span className="text-2xl">{item.emoji}</span><span className="flex-1"><b className="font-display text-sm">{item.title}</b><small className="mt-1 block text-muted-foreground">{item.body}</small></span>
        <span className="font-display text-xs text-primary">{settings[item.key] ? 'ON' : 'OFF'}</span>
      </button>)}
    </div>
    <button onClick={onClose} className="mt-6 rounded-2xl bg-secondary px-8 py-3 font-display text-sm font-bold text-secondary-foreground">← BACK</button>
  </div>;
};
export default AccessibilityScreen;
