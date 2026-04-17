import { useState, useEffect, useRef } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const rafId = useRef(0);

  useEffect(() => {
    const handler = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrolled = window.scrollY;
        const height = el.scrollHeight - el.clientHeight;
        setProgress(height > 0 ? (scrolled / height) * 100 : 0);
        setIsScrolled(scrolled > 24);
        rafId.current = 0;
      });
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { progress, isScrolled };
}
