const CrewnyxLogo = ({ size = 80, animated = false }: { size?: number; animated?: boolean }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Circle element */}
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="36" fill="none" stroke="hsl(213, 72%, 59%)" strokeWidth="4" />
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill="hsl(213, 72%, 59%)"
          fontSize="24"
          fontWeight="700"
          fontFamily="Poppins, Inter, sans-serif"
        >
          CN
        </text>
      </svg>
      {/* Cursor element */}
      <div
        className={animated ? "absolute" : "absolute"}
        style={{
          bottom: -4,
          right: -4,
          animation: animated ? "cursor-move-up 2s ease-in-out forwards" : undefined,
        }}
      >
        <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="hsl(213, 72%, 59%)">
          <path d="M4 2l16 12H12l-2 8L4 2z" />
        </svg>
      </div>
      {/* Ripple */}
      {animated && (
        <div
          className="absolute rounded-full"
          style={{
            width: 12,
            height: 12,
            top: "50%",
            left: "50%",
            marginTop: -6,
            marginLeft: -6,
            background: "hsl(213, 72%, 59%)",
            opacity: 0,
            animation: "ripple 1s ease-out 1.4s forwards",
          }}
        />
      )}
    </div>
  );
};

export default CrewnyxLogo;
