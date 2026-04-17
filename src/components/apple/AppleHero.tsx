import { memo, useCallback } from 'react';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import PortfolioScene3D from '../PortfolioScene3D';
import { stats, userData } from '../../data/portfolio';

const AppleHero = memo(() => {
  const scrollToProjects = useCallback(() => {
    const el = document.getElementById('projects');
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 48, behavior: 'smooth' });
  }, []);

  return (
    <section id="about" className="w-full max-w-full overflow-hidden bg-[#f5f5f7] px-5 pt-28 text-[#1d1d1f] dark:bg-black dark:text-[#f5f5f7]">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col items-center justify-center gap-5 overflow-hidden pb-10 text-center">
        <motion.div
          className="max-w-5xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-sm font-semibold text-[#0071e3]">{userData.name}</p>
          <h1 className="mx-auto max-w-5xl text-[clamp(3rem,7vw,5.7rem)] font-semibold leading-[0.96]">
            Portfolio.
            <br />
            Built to feel instant.
          </h1>
          <p className="mx-auto mt-5 w-full max-w-[20rem] break-words px-2 text-[1.04rem] font-medium leading-tight text-[#6e6e73] dark:text-[#a1a1a6] sm:max-w-3xl sm:text-[clamp(1.15rem,2vw,1.55rem)]">
            {userData.title} creating responsive, accessible web products with React, TypeScript, AI streaming, and clean system design.
          </p>
        </motion.div>

        <motion.div
          className="h-[300px] w-full max-w-[22rem] overflow-hidden sm:h-[350px] sm:max-w-4xl lg:h-[390px]"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <PortfolioScene3D />
        </motion.div>

        <motion.div
          className="flex w-full max-w-[22rem] flex-wrap items-center justify-center gap-3 sm:max-w-none"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={scrollToProjects}
            className="group inline-flex items-center gap-2 rounded-lg bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0077ed] active:scale-95"
          >
            See the work
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href={userData.resume}
            download="Athi_Lakshmi.pdf"
            className="inline-flex items-center gap-2 rounded-lg bg-black/5 px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-black/10 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Download size={16} />
            Resume
          </a>
          <a
            href={userData.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="grid h-11 w-11 place-items-center rounded-lg bg-black/5 text-[#1d1d1f] transition hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Github size={18} />
          </a>
          <a
            href={userData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="grid h-11 w-11 place-items-center rounded-lg bg-black/5 text-[#1d1d1f] transition hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Linkedin size={18} />
          </a>
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 pb-3 md:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="rounded-lg bg-white px-5 py-7 text-center shadow-sm shadow-black/[0.03] dark:bg-[#161617]"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{stat.value}</div>
            <div className="mt-1 text-xs font-medium text-[#6e6e73] dark:text-[#a1a1a6]">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

AppleHero.displayName = 'AppleHero';

export default AppleHero;
