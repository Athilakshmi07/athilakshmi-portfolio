import { memo } from 'react';
import { motion } from 'framer-motion';
import MotionSection from '../ui/MotionSection';
import { experience } from '../../data/portfolio';

const AppleExperience = memo(() => (
  <section id="experience" className="bg-white px-5 py-16 text-[#1d1d1f] dark:bg-[#050505] dark:text-[#f5f5f7] md:py-24">
    <div className="mx-auto max-w-6xl">
      <MotionSection className="mb-8 md:mb-12">
        <p className="text-sm font-semibold text-[#0071e3]">Experience</p>
        <h2 className="mt-2 max-w-4xl text-[clamp(2.5rem,6vw,5.8rem)] font-semibold leading-[0.95]">
          Senior delivery, designed for real-world constraints.
        </h2>
      </MotionSection>

      <div className="grid gap-3">
        {experience.map((job, index) => (
          <MotionSection key={job.company} delay={index * 0.08}>
            <motion.article
              className="rounded-lg bg-[#f5f5f7] p-7 dark:bg-[#161617] md:p-10"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 230, damping: 24 }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0071e3]">{job.period}</p>
                  <h3 className="mt-2 text-3xl font-semibold md:text-5xl">{job.company}</h3>
                  <p className="mt-2 text-lg font-medium text-[#6e6e73] dark:text-[#a1a1a6]">{job.role} · {job.location}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:max-w-sm md:justify-end">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1d1f]/75 dark:bg-white/10 dark:text-white/75">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-9 grid gap-4 md:grid-cols-2">
                {job.highlights.map((highlight) => (
                  <p key={highlight} className="rounded-lg bg-white p-5 text-sm font-medium leading-6 text-[#424245] dark:bg-black/30 dark:text-[#d2d2d7]">
                    {highlight}
                  </p>
                ))}
              </div>
            </motion.article>
          </MotionSection>
        ))}
      </div>
    </div>
  </section>
));

AppleExperience.displayName = 'AppleExperience';

export default AppleExperience;
