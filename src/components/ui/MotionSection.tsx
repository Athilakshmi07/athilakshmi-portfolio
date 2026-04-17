import { ReactNode, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const MotionSection = memo(({ children, className = '', delay = 0 }: MotionSectionProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
});

MotionSection.displayName = 'MotionSection';

export default MotionSection;
