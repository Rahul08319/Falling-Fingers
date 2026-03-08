import { useState, useRef, useEffect } from 'react';

interface InitialsInputProps {
  onSubmit: (initials: string) => void;
}

const InitialsInput = ({ onSubmit }: InitialsInputProps) => {
  const [chars, setChars] = useState(['_', '_', '_']);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 0 && activeIdx < 3) {
      const newChars = [...chars];
      newChars[activeIdx] = val[val.length - 1];
      setChars(newChars);
      if (activeIdx < 2) {
        setActiveIdx(activeIdx + 1);
      } else {
        onSubmit(newChars.join(''));
      }
    }
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && activeIdx > 0) {
      const newChars = [...chars];
      const idx = chars[activeIdx] !== '_' ? activeIdx : activeIdx - 1;
      newChars[idx] = '_';
      setChars(newChars);
      setActiveIdx(idx);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="font-display text-xs text-muted-foreground tracking-widest">
        ENTER YOUR INITIALS
      </span>
      <div className="flex gap-3">
        {chars.map((c, i) => (
          <div
            key={i}
            className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-display text-3xl font-black transition-all duration-150 ${
              i === activeIdx
                ? 'border-primary text-primary text-glow scale-110'
                : c !== '_'
                ? 'border-secondary text-secondary'
                : 'border-border text-muted-foreground'
            }`}
          >
            {c}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        className="opacity-0 absolute w-0 h-0"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        maxLength={1}
        autoFocus
      />
      <span className="font-body text-xs text-muted-foreground">
        Tap to type • 3 characters
      </span>
    </div>
  );
};

export default InitialsInput;
