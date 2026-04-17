import { memo } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealSection = memo(({ children, className = '', delay = 0 }: Props) => {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`${visible ? 'reveal-visible' : 'reveal-hidden'} ${className}`}
      style={delay > 0 && !visible ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
});

RevealSection.displayName = 'RevealSection';
export default RevealSection;
