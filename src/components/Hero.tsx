import { memo, useCallback } from 'react';
import { Github, Linkedin, ArrowRight, MapPin, Download } from 'lucide-react';
import RevealSection from './ui/RevealSection';
import { userData, stats } from '../data/portfolio';

const Hero = memo(() => {
  const scrollToProjects = useCallback(() => {
    const el = document.getElementById('projects');
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  }, []);

  return (
    <section id="about" className="relative min-h-screen flex items-center px-6 overflow-hidden">
      {/* Ambient gradient orbs — CSS-only, no JS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[8%] left-[4%] w-[560px] h-[560px] rounded-full dark:bg-indigo-700/10 bg-indigo-400/8 blur-[130px]" />
        <div className="absolute bottom-[8%] right-[4%] w-[480px] h-[480px] rounded-full dark:bg-cyan-700/8 bg-cyan-400/6 blur-[110px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full dark:bg-purple-700/5 bg-purple-400/4 blur-[160px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none dark:opacity-[0.025] opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full pt-24 pb-20">
        <RevealSection>
          {/* Status + location badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 bg-emerald-50 border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] font-outfit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for opportunities
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold dark:text-slate-500 text-slate-400">
              <MapPin size={12} />
              {userData.location}
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-outfit font-black leading-[1.03] tracking-tighter mb-8 text-[clamp(3rem,9vw,6.5rem)]">
            <span className="dark:text-white text-slate-900">Engineering</span>
            <br />
            <span className="gradient-text">Scalable Impact.</span>
          </h1>

          {/* Name + title */}
          <p className="text-lg md:text-xl font-semibold mb-4 dark:text-slate-300 text-slate-700">
            {userData.name}
            <span className="mx-2 dark:text-slate-700 text-slate-300">·</span>
            <span className="dark:text-slate-400 text-slate-500 font-normal">{userData.title}</span>
          </p>

          {/* Summary */}
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mb-12 dark:text-slate-400 text-slate-600">
            {userData.summary}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-20">
            <button
              onClick={scrollToProjects}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold font-outfit text-sm bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
            >
              <span>Explore Work</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={userData.resume}
              download="Athi_Lakshmi.pdf"
              aria-label="Download resume PDF"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold font-outfit text-sm border dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95"
            >
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Resume</span>
            </a>
            <div className="flex items-center gap-3">
              <a
                href={userData.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="p-3.5 rounded-xl border dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Github size={20} />
              </a>
              <a
                href={userData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="p-3.5 rounded-xl border dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t dark:border-white/[0.07] border-slate-200">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-black font-outfit text-indigo-500 mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-black font-outfit dark:text-slate-500 text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
