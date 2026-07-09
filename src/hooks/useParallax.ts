import { useState, useEffect, useRef } from 'react';

export function useParallax(factor: number = 0.3) {
  const [offset, setOffset] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = document.querySelector('.snap-shell') as HTMLElement | null;
    const target = el || window;

    const handler = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        const scrollY = el ? el.scrollTop : window.scrollY;
        setOffset(scrollY * factor);
        raf.current = 0;
      });
    };

    target.addEventListener('scroll', handler, { passive: true });
    return () => {
      target.removeEventListener('scroll', handler);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [factor]);

  return offset;
}
