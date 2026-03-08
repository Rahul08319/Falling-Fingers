interface CountdownScreenProps {
  count: number;
}

const CountdownScreen = ({ count }: CountdownScreenProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        key={count}
        className="font-display text-8xl font-black text-primary text-glow animate-countdown"
      >
        {count === 0 ? 'GO!' : count}
      </div>
    </div>
  );
};

export default CountdownScreen;
