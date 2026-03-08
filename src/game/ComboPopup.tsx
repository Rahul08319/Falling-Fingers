interface ComboPopupProps {
  x: number;
  y: number;
  text: string;
  color: string;
}

const ComboPopup = ({ x, y, text, color }: ComboPopupProps) => {
  return (
    <div
      className="absolute pointer-events-none font-display font-black text-lg z-30 animate-popup"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color,
        textShadow: `0 0 10px ${color}`,
      }}
    >
      {text}
    </div>
  );
};

export default ComboPopup;
