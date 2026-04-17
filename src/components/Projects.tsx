import { memo } from 'react';
import { ExternalLink, Cpu, LayoutDashboard } from 'lucide-react';
import RevealSection from './ui/RevealSection';
import { projects } from '../data/portfolio';

const PROJECT_ICONS = [
  <Cpu className="w-6 h-6 text-indigo-500" />,
  <LayoutDashboard className="w-6 h-6 text-cyan-500" />,
];

const accentMap = {
  indigo: {
    badge: 'dark:bg-indigo-500/10 dark:text-indigo-400 bg-indigo-50 text-indigo-600',
    client: 'text-indigo-500',
    icon: 'dark:bg-white/[0.05] bg-slate-100',
    hover: 'dark:hover:border-indigo-500/35 hover:border-indigo-300/50',
    reveal: 'dark:bg-indigo-500/5 bg-indigo-50/50',
  },
  cyan: {
    badge: 'dark:bg-cyan-500/10 dark:text-cyan-400 bg-cyan-50 text-cyan-700',
    client: 'text-cyan-500',
    icon: 'dark:bg-white/[0.05] bg-slate-100',
    hover: 'dark:hover:border-cyan-500/35 hover:border-cyan-300/50',
    reveal: 'dark:bg-cyan-500/5 bg-cyan-50/50',
  },
};

const Projects = memo(() => (
  <section
    id="projects"
    className="py-32 px-6 border-y dark:border-white/[0.06] border-slate-200 dark:bg-[#050816] bg-slate-50/60"
  >
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <RevealSection className="mb-16">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black font-outfit text-indigo-500 mb-3">
          Case Studies
        </p>
        <h2 className="text-4xl md:text-5xl font-black font-outfit tracking-tight dark:text-white text-slate-900">
          Featured Projects
        </h2>
      </RevealSection>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => {
          const t = accentMap[project.accent];
          return (
            <RevealSection key={idx} delay={idx * 100}>
              <div className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-500 hover:-translate-y-2
                dark:bg-[#07091f] dark:border-white/[0.07] bg-white border-slate-200 shadow-2xl shadow-slate-100/60
                ${t.hover}`}
              >
                {/* Main content */}
                <div className="p-8 md:p-10">
                  {/* Category pill */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider font-outfit mb-8 ${t.badge}`}>
                    {project.category}
                  </span>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${t.icon}`}>
                    {PROJECT_ICONS[idx]}
                  </div>

                  <h3 className="text-2xl md:text-[1.75rem] font-black font-outfit tracking-tight mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className={`font-bold text-[11px] uppercase tracking-[0.22em] font-outfit mb-6 ${t.client}`}>
                    {project.client}
                  </p>

                  <p className="text-base leading-relaxed mb-8 dark:text-slate-400 text-slate-600">
                    {project.desc}
                  </p>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3.5 py-1.5 rounded-xl text-[10.5px] font-bold border
                          dark:bg-black/20 dark:border-white/[0.06] dark:text-slate-500 dark:group-hover:text-slate-300
                          bg-slate-50 border-slate-200 text-slate-600 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className={`px-8 md:px-10 py-4 border-t dark:border-white/[0.05] border-slate-100 flex justify-between items-center transition-colors ${t.reveal} group-hover:opacity-100`}>
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] font-outfit dark:text-slate-600 text-slate-400">
                    {project.client}
                  </span>
                  <div className={`p-2 rounded-xl text-indigo-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0
                    dark:bg-indigo-500/10 bg-indigo-50`}
                  >
                    <ExternalLink size={15} />
                  </div>
                </div>
              </div>
            </RevealSection>
          );
        })}
      </div>
    </div>
  </section>
));

Projects.displayName = 'Projects';
export default Projects;
