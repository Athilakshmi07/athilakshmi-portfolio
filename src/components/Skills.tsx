import { memo } from 'react';
import { Layout, Activity, Terminal, ShieldCheck } from 'lucide-react';
import RevealSection from './ui/RevealSection';
import { skillGroups } from '../data/portfolio';

/* ─── colour tokens per skill category ─── */
const tokens = {
  indigo: {
    icon: 'dark:bg-indigo-500/10 bg-indigo-50 dark:text-indigo-400 text-indigo-600',
    chip: 'dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-slate-400 dark:group-hover:bg-white/[0.08] dark:group-hover:text-slate-200 bg-slate-50 border-slate-200 text-slate-600',
    border: 'dark:hover:border-indigo-500/35 hover:border-indigo-300/50',
  },
  cyan: {
    icon: 'dark:bg-cyan-500/10 bg-cyan-50 dark:text-cyan-400 text-cyan-600',
    chip: 'dark:bg-cyan-500/[0.06] dark:border-cyan-500/[0.12] dark:text-cyan-400 bg-cyan-50 border-cyan-200 text-cyan-700',
    border: 'dark:hover:border-cyan-500/35 hover:border-cyan-300/50',
  },
  purple: {
    icon: 'dark:bg-purple-500/10 bg-purple-50 dark:text-purple-400 text-purple-600',
    chip: 'dark:bg-purple-500/[0.06] dark:border-purple-500/[0.12] dark:text-purple-400 bg-purple-50 border-purple-200 text-purple-700',
    border: 'dark:hover:border-purple-500/35 hover:border-purple-300/50',
  },
  emerald: {
    icon: 'dark:bg-emerald-500/10 bg-emerald-50 dark:text-emerald-400 text-emerald-600',
    chip: 'dark:bg-emerald-500/[0.06] dark:border-emerald-500/[0.12] dark:text-emerald-400 bg-emerald-50 border-emerald-200 text-emerald-700',
    border: 'dark:hover:border-emerald-500/35 hover:border-emerald-300/50',
  },
} as const;

const icons: Record<string, React.ReactNode> = {
  indigo: <Layout size={22} />,
  cyan: <Activity size={22} />,
  purple: <Terminal size={20} />,
  emerald: <ShieldCheck size={20} />,
};

const Skills = memo(() => (
  <section
    id="skills"
    className="py-32 px-6 border-y dark:border-white/[0.06] border-slate-200 dark:bg-[#050816] bg-slate-50/60"
  >
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <RevealSection className="mb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black font-outfit text-indigo-500 mb-3">
          The Stack
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-outfit tracking-tight dark:text-white text-slate-900">
          Technical Mastery
        </h2>
      </RevealSection>

      {/*
        Bento layout:
        lg (4-col grid):  [Frontend 2×2]  [AI 2×1]
                          [Frontend 2×2]  [Backend 1×1] [Standards 1×1]
        md (2-col):       full-width stacking
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* ── Frontend: wide + tall ── */}
        <RevealSection className="md:col-span-2 lg:col-span-2 lg:row-span-2">
          <div className={`group h-full p-8 md:p-10 rounded-[2rem] border transition-all duration-500 flex flex-col gap-6 min-h-[280px]
            dark:bg-white/[0.025] dark:border-white/[0.07] bg-white border-slate-200 shadow-lg shadow-slate-100/80
            ${tokens.indigo.border}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${tokens.indigo.icon}`}>
                {icons.indigo}
              </div>
              <div>
                <h3 className="font-black text-xl font-outfit">{skillGroups[0].label}</h3>
                <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-0.5">
                  Modular, accessible, high-performance
                </p>
              </div>
            </div>
            <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
              Building WCAG-compliant, modular interfaces with complex state management, micro-frontend patterns, and design-system-ready component libraries.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {skillGroups[0].skills.map((s, i) => (
                <span
                  key={i}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${tokens.indigo.chip}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── AI & Streaming ── */}
        <RevealSection className="md:col-span-2 lg:col-span-2" delay={80}>
          <div className={`group p-8 rounded-[2rem] border transition-all duration-500 flex flex-col gap-5
            dark:bg-white/[0.025] dark:border-white/[0.07] bg-white border-slate-200 shadow-lg shadow-slate-100/80
            ${tokens.cyan.border}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${tokens.cyan.icon}`}>
                {icons.cyan}
              </div>
              <h3 className="font-black text-xl font-outfit">{skillGroups[1].label}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillGroups[1].skills.map((s, i) => (
                <span key={i} className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold border ${tokens.cyan.chip}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── Back-End ── */}
        <RevealSection className="md:col-span-1 lg:col-span-1" delay={160}>
          <div className={`group p-8 rounded-[2rem] border transition-all duration-500 flex flex-col gap-5
            dark:bg-white/[0.025] dark:border-white/[0.07] bg-white border-slate-200 shadow-lg shadow-slate-100/80
            ${tokens.purple.border}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${tokens.purple.icon}`}>
                {icons.purple}
              </div>
              <h3 className="font-black text-base font-outfit">{skillGroups[2].label}</h3>
            </div>
            <div className="space-y-2.5">
              {skillGroups[2].skills.map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-[12px] font-semibold ${tokens.purple.chip.includes('text-purple') ? 'dark:text-purple-400 text-purple-700' : ''}`}>
                  <div className="w-1 h-1 rounded-full bg-purple-500 shrink-0" />
                  <span className="dark:text-slate-400 text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── Standards & Tools ── */}
        <RevealSection className="md:col-span-1 lg:col-span-1" delay={240}>
          <div className={`group p-8 rounded-[2rem] border transition-all duration-500 flex flex-col gap-5
            dark:bg-white/[0.025] dark:border-white/[0.07] bg-white border-slate-200 shadow-lg shadow-slate-100/80
            ${tokens.emerald.border}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${tokens.emerald.icon}`}>
                {icons.emerald}
              </div>
              <h3 className="font-black text-base font-outfit">{skillGroups[3].label}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillGroups[3].skills.map((s, i) => (
                <span key={i} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${tokens.emerald.chip}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </RevealSection>

      </div>
    </div>
  </section>
));

Skills.displayName = 'Skills';
export default Skills;
