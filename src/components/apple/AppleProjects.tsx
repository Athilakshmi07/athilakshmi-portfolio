import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MotionSection from '../ui/MotionSection';
import { projects } from '../../data/portfolio';

const gradients = [
  'from-[#f5f5f7] via-[#e8f2ff] to-[#dbeafe] dark:from-[#161617] dark:via-[#0b1726] dark:to-[#06111f]',
  'from-[#f5f5f7] via-[#effaf4] to-[#dff7e8] dark:from-[#161617] dark:via-[#071b14] dark:to-[#062116]',
];

const AppleProjects = memo(() => (
  <section id="projects" className="bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f] dark:bg-black dark:text-[#f5f5f7] md:py-24">
    <div className="mx-auto max-w-6xl">
      <MotionSection className="mb-8 text-center md:mb-12">
        <p className="text-sm font-semibold text-[#0071e3]">Featured Work</p>
        <h2 className="mx-auto mt-2 max-w-4xl text-[clamp(2.7rem,6.4vw,6.2rem)] font-semibold leading-[0.95]">
          Case studies with product-grade polish.
        </h2>
      </MotionSection>

      <div className="grid gap-3 lg:grid-cols-2">
        {projects.map((project, index) => (
          <MotionSection key={project.title} delay={index * 0.08}>
            <motion.article
              className={`relative min-h-[520px] overflow-hidden rounded-lg bg-gradient-to-br ${gradients[index]} p-7 shadow-sm shadow-black/[0.03] md:p-10`}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <div className="relative z-10">
                <p className="text-sm font-semibold text-[#0071e3]">{project.category}</p>
                <h3 className="mt-3 max-w-xl text-4xl font-semibold leading-none md:text-6xl">{project.title}</h3>
                <p className="mt-5 max-w-xl text-lg font-medium leading-7 text-[#6e6e73] dark:text-[#a1a1a6]">{project.desc}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1d1d1f]/75 backdrop-blur dark:bg-white/10 dark:text-white/75">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between md:bottom-10 md:left-10 md:right-10">
                <span className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">{project.client}</span>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#0071e3] text-white">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="absolute -bottom-20 right-[-72px] h-64 w-64 rounded-lg bg-white/55 blur-sm dark:bg-white/10" />
              <div className="absolute bottom-20 right-8 h-36 w-36 rounded-lg bg-[#0071e3]/15 backdrop-blur" />
            </motion.article>
          </MotionSection>
        ))}
      </div>
    </div>
  </section>
));

AppleProjects.displayName = 'AppleProjects';

export default AppleProjects;
