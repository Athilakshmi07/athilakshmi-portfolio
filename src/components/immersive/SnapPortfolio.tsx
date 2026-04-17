import { memo, useCallback } from 'react';
import { ArrowDown, ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeWorld from './ThreeWorld';
import { experience, projects, skillGroups, stats, userData } from '../../data/portfolio';

const sectionMotion = {
  initial: { opacity: 0, y: 44, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { amount: 0.55 },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
} as const;

const SnapPortfolio = memo(() => {
  const scrollToNext = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#050505] text-white">
      <ThreeWorld />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_50%_45%,rgba(20,184,166,0.14),transparent_32%),linear-gradient(180deg,rgba(5,5,5,0.2),rgba(5,5,5,0.92))]" />

      <main className="snap-shell relative z-10 h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
        <section id="about" className="snap-panel flex min-h-screen snap-start snap-always items-center overflow-hidden px-5 py-16 md:py-20">
          <motion.div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8" {...sectionMotion}>
            <div>
              <p className="mb-5 text-sm font-semibold text-[#a3e635]">{userData.name}</p>
              <h1 className="max-w-[21rem] text-[clamp(2.75rem,13vw,7rem)] font-black leading-[0.92] sm:max-w-3xl">
                3D portfolio.
                <br />
                Modern web work.
              </h1>
              <p className="mt-5 max-w-[21rem] text-base font-medium leading-6 text-white/68 sm:max-w-2xl md:mt-6 md:text-2xl md:leading-9">
                {userData.title} building fast interfaces, AI streaming workflows, and accessible product systems.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToNext('skills')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#a3e635] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#bef264]"
                >
                  Start exploring
                  <ArrowDown size={16} />
                </button>
                <a
                  href={userData.resume}
                  download="Athi_Lakshmi.pdf"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/16"
                >
                  <Download size={16} />
                  Resume
                </a>
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/16"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <a
                  href={userData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/16"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a
                  href={`mailto:${userData.email}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/16"
                >
                  <Mail size={16} />
                  Email
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl md:p-6"
                  whileHover={{ y: -6, rotateX: 5, rotateY: -5 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                >
                  <div className="text-3xl font-black text-[#a3e635] md:text-4xl">{stat.value}</div>
                  <div className="mt-2 text-xs font-semibold text-white/62 md:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="skills" className="snap-panel flex min-h-screen snap-start snap-always items-center px-5 py-20">
          <motion.div className="mx-auto w-full max-w-6xl" {...sectionMotion}>
            <p className="mb-4 text-sm font-semibold text-[#14b8a6]">Section 01</p>
            <h2 className="max-w-4xl text-[clamp(2.7rem,7vw,6rem)] font-black leading-[0.95]">
              A stack that moves like a product.
            </h2>
            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {skillGroups.map((group, index) => (
              <motion.article
                  key={group.label}
                  className="min-h-[220px] rounded-lg border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl lg:min-h-[280px]"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                >
                  <div className="text-sm font-bold text-[#a3e635]">0{index + 1}</div>
                  <h3 className="mt-5 text-2xl font-black">{group.label}</h3>
                  <div className="mt-5 flex flex-wrap gap-2 lg:mt-7">
                    {group.skills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-black/25 px-3 py-1.5 text-xs font-bold text-white/74">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="experience" className="snap-panel flex min-h-screen snap-start snap-always items-center px-5 py-20">
          <motion.div className="mx-auto w-full max-w-6xl" {...sectionMotion}>
            <p className="mb-4 text-sm font-semibold text-[#f43f5e]">Section 02</p>
            <h2 className="max-w-4xl text-[clamp(2.7rem,7vw,6rem)] font-black leading-[0.95]">
              Real delivery, full-screen focus.
            </h2>
            <div className="mt-8 grid gap-3 lg:mt-10 lg:grid-cols-2">
              {experience.map((job) => (
                <motion.article
                  key={job.company}
                  className="rounded-lg border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl md:p-8"
                  whileHover={{ y: -8, rotateY: 2 }}
                  transition={{ type: 'spring', stiffness: 230, damping: 22 }}
                >
                  <p className="text-sm font-bold text-[#a3e635]">{job.period}</p>
                  <h3 className="mt-3 text-3xl font-black">{job.company}</h3>
                  <p className="mt-2 font-semibold text-white/62">{job.role}</p>
                  <ul className="mt-5 space-y-2 text-sm font-medium leading-6 text-white/72 md:mt-6 md:space-y-3">
                    {job.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="projects" className="snap-panel flex min-h-screen snap-start snap-always items-center px-5 py-20">
          <motion.div className="mx-auto w-full max-w-6xl" {...sectionMotion}>
            <p className="mb-4 text-sm font-semibold text-[#a3e635]">Section 03</p>
            <h2 className="max-w-4xl text-[clamp(2.7rem,7vw,6rem)] font-black leading-[0.95]">
              Case studies that feel dimensional.
            </h2>
            <div className="mt-8 grid gap-3 lg:mt-10 lg:grid-cols-2">
              {projects.map((project) => (
                <motion.article
                  key={project.title}
                  className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.08] p-7 backdrop-blur-xl lg:min-h-[390px]"
                  whileHover={{ y: -8, scale: 1.015 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                >
                  <p className="text-sm font-bold text-[#14b8a6]">{project.category}</p>
                  <h3 className="mt-4 max-w-xl text-4xl font-black leading-none">{project.title}</h3>
                  <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/68">{project.desc}</p>
                  <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between">
                    <span className="text-sm font-bold text-white/58">{project.client}</span>
                    <ArrowRight className="text-[#a3e635]" />
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="contact" className="snap-panel flex min-h-screen snap-start snap-always items-center px-5 py-20">
          <motion.div className="mx-auto max-w-4xl text-center" {...sectionMotion}>
            <p className="mb-4 text-sm font-semibold text-[#14b8a6]">Final Section</p>
            <h2 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9]">Let’s make it move.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-medium leading-8 text-white/68">
              Open to modern frontend, 3D web, AI workflow, and product engineering opportunities.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${userData.email}`} className="inline-flex items-center gap-2 rounded-lg bg-[#a3e635] px-5 py-3 text-sm font-bold text-black">
                <Mail size={16} />
                Email
              </a>
              <a href={userData.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white">
                <Github size={16} />
                GitHub
              </a>
              <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white">
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
});

SnapPortfolio.displayName = 'SnapPortfolio';

export default SnapPortfolio;
