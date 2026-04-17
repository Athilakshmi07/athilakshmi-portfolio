import { memo } from 'react';
import { CheckCircle2, Building2 } from 'lucide-react';
import RevealSection from './ui/RevealSection';
import { experience } from '../data/portfolio';

const Experience = memo(() => (
  <section id="experience" className="py-32 px-6">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <RevealSection className="mb-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black font-outfit text-indigo-500 mb-3">
          Journey
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-outfit tracking-tight dark:text-white text-slate-900">
          Work Experience
        </h2>
      </RevealSection>

      {/* Timeline */}
      <div className="relative space-y-8">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px dark:bg-white/[0.06] bg-slate-200 hidden md:block ml-[1.6rem]" aria-hidden />

        {experience.map((job, idx) => (
          <RevealSection key={idx} delay={idx * 100}>
            <div className="md:pl-16 relative">
              {/* Timeline dot */}
              <div className="absolute left-0 top-10 w-[1.3rem] h-[1.3rem] rounded-full border-2 dark:border-indigo-500/60 border-indigo-500 dark:bg-[#050816] bg-white shadow-lg shadow-indigo-500/30 hidden md:flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>

              {/* Card */}
              <div className={`group p-8 md:p-12 rounded-[2rem] border transition-all duration-500
                dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:bg-white/[0.04]
                bg-white border-slate-200 shadow-xl shadow-slate-100/50`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-black font-outfit dark:text-indigo-400 text-indigo-600 mb-2">
                      <Building2 size={11} />
                      {job.role}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black font-outfit tracking-tight">
                      {job.company}
                    </h3>
                    <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-1">{job.location}</p>
                  </div>
                  <span className="shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider font-outfit dark:bg-indigo-500/10 dark:text-indigo-400 bg-indigo-50 text-indigo-600">
                    {job.period}
                  </span>
                </div>

                {/* Highlights grid */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {job.highlights.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-3 text-sm leading-relaxed dark:text-slate-400 dark:group-hover:text-slate-300 text-slate-600 transition-colors"
                    >
                      <CheckCircle2 size={15} className="text-indigo-500 mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className={`flex flex-wrap gap-2 pt-5 border-t dark:border-white/[0.05] border-slate-100`}>
                  {job.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg dark:bg-white/[0.04] dark:text-slate-500 bg-slate-50 text-slate-400 border dark:border-white/[0.04] border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
));

Experience.displayName = 'Experience';
export default Experience;
