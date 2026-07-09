import { memo } from 'react';
import { use3DTilt } from '../../hooks/use3DTilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
}

export const TiltCard = memo(({ children, className = '', glowColor = '#a3e635', maxTilt = 12 }: TiltCardProps) => {
  const { ref, style, tilt, onMouseMove, onMouseLeave } = use3DTilt({ maxTilt });

  return (
    <div
      ref={ref}
      className={`card-3d relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Mouse-tracking glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, ${glowColor}18, transparent 55%)`,
          opacity: tilt.scale > 1 ? 1 : 0,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

TiltCard.displayName = 'TiltCard';
