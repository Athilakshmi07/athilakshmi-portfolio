import { useState, useEffect, useRef } from 'react';

let _observer: IntersectionObserver | null = null;
const _cbs = new Map<Element, () => void>();

function getObserver(): IntersectionObserver {
  if (!_observer) {
    _observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = _cbs.get(entry.target);
            cb?.();
            _observer?.unobserve(entry.target);
            _cbs.delete(entry.target);
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
  }
  return _observer;
}

export function useReveal() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = getObserver();
    _cbs.set(el, () => setVisible(true));
    obs.observe(el);

    return () => {
      obs.unobserve(el);
      _cbs.delete(el);
    };
  }, []); // intentionally empty — only register once on mount

  return [ref, visible] as const;
}
