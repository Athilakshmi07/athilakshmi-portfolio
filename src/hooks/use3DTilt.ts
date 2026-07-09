import { useCallback, useRef, useState } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glowX: number;
  glowY: number;
}

const INITIAL: TiltState = { rotateX: 0, rotateY: 0, scale: 1, glowX: 50, glowY: 50 };

interface Use3DTiltOptions {
  maxTilt?: number;
  scale?: number;
  speed?: number;
}

export function use3DTilt(options: Use3DTiltOptions = {}) {
  const { maxTilt = 12, scale = 1.03, speed = 400 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>(INITIAL);
  const animating = useRef(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * maxTilt;
      const rotateY = (x - 0.5) * maxTilt;

      setTilt({
        rotateX,
        rotateY,
        scale,
        glowX: x * 100,
        glowY: y * 100,
      });
    },
    [maxTilt, scale],
  );

  const onMouseLeave = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    setTilt(INITIAL);
    setTimeout(() => {
      animating.current = false;
    }, speed);
  }, [speed]);

  const style: React.CSSProperties = {
    transform: `perspective(${1200}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
    transition: animating.current
      ? `transform ${speed}ms cubic-bezier(0.22, 1, 0.36, 1)`
      : 'transform 0.1s ease-out',
  };

  const glowStyle: React.CSSProperties = {
    background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(163, 230, 53, 0.12), transparent 60%)`,
  };

  return { ref, style, glowStyle, tilt, onMouseMove, onMouseLeave };
}
