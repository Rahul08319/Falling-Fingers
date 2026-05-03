import { useState } from 'react';

const TUTORIAL_KEY = 'falling-fingers-tutorial-seen';

export function hasSeenTutorial(): boolean {
  return localStorage.getItem(TUTORIAL_KEY) === '1';
}

export function markTutorialSeen() {
  localStorage.setItem(TUTORIAL_KEY, '1');
}

interface TutorialOverlayProps {
  onClose: () => void;
}

const STEPS = [
  {
    emoji: '👆',
    title: 'TAP TO FIX',
    body: 'Fingers fall from the top of the screen. Tap the BROKEN ones to fix them and earn points.',
  },
  {
    emoji: '🚫',
    title: "DON'T TAP HEALTHY",
    body: 'If you tap a healthy finger you LOSE A LIFE. Only tap the cracked, broken ones!',
  },
  {
    emoji: '❤️',
    title: 'WATCH YOUR LIVES',
    body: 'Letting a broken finger reach the bottom also costs a life. Three misses and the game ends.',
  },
  {
    emoji: '🌟',
    title: 'SPECIAL FINGERS',
    body: 'Golden = 5x points. Speed ⚡ falls fast. Heal ❤️‍🩹 grants +1 life.',
  },
  {
    emoji: '🔥',
    title: 'BUILD COMBOS',
    body: 'Consecutive correct taps boost your multiplier (x2, x3, x4!). One wrong tap resets it.',
  },
  {
    emoji: '🛡️',
    title: 'POWER-UPS & THEMES',
    body: 'Grab Shield 🛡️ and Slow-Mo 🐌 pickups. Score milestones unlock new visual themes!',
  },
];

const TutorialOverlay = ({ onClose }: TutorialOverlayProps) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      markTutorialSeen();
      onClose();
    } else {
      setStep(s => s + 1);
    }
  };

  const skip = () => {
    markTutorialSeen();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full bg-card border border-border rounded-3xl p-8 text-center glow-primary">
        <div className="text-6xl mb-4">{current.emoji}</div>
        <h2 className="font-display text-2xl font-black text-primary text-glow mb-3 tracking-wider">
          {current.title}
        </h2>
        <p className="font-body text-base text-foreground/90 mb-6 leading-relaxed">
          {current.body}
        </p>

        <div className="flex justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full font-display text-base font-bold py-3 rounded-2xl bg-primary text-primary-foreground glow-primary active:scale-95 tracking-wider mb-2"
        >
          {isLast ? "LET'S PLAY!" : 'NEXT →'}
        </button>
        {!isLast && (
          <button
            onClick={skip}
            className="font-display text-xs text-muted-foreground tracking-wider"
          >
            SKIP TUTORIAL
          </button>
        )}
      </div>
    </div>
  );
};

export default TutorialOverlay;
