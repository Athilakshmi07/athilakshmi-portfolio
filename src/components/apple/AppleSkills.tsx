import { memo } from 'react';
import { Activity, Layout, ShieldCheck, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import MotionSection from '../ui/MotionSection';
import { skillGroups } from '../../data/portfolio';

const icons = [Layout, Activity, Terminal, ShieldCheck];
const accents = ['#0071e3', '#34c759', '#ff375f', '#af52de'];

const AppleSkills = memo(() => (
  <section id="skills" className="bg-[#f5f5f7] px-5 py-16 text-[#1d1d1f] dark:bg-black dark:text-[#f5f5f7] md:py-24">
    <div className="mx-auto max-w-6xl">
      <MotionSection className="mb-8 md:mb-12">
        <p className="text-sm font-semibold text-[#0071e3]">The Stack</p>
        <h2 className="mt-2 max-w-4xl text-[clamp(2.5rem,6vw,5.8rem)] font-semibold leading-[0.95]">
          Everything needed to ship polished product interfaces.
        </h2>
      </MotionSection>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => {
          const Icon = icons[index];
          return (
            <MotionSection key={group.label} delay={index * 0.06}>
              <motion.article
                className={`min-h-[310px] rounded-lg bg-white p-7 shadow-sm shadow-black/[0.03] dark:bg-[#161617] ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 230, damping: 24 }}
              >
                <div className="mb-7 grid h-12 w-12 place-items-center rounded-lg" style={{ backgroundColor: `${accents[index]}18`, color: accents[index] }}>
                  <Icon size={23} />
                </div>
                <h3 className="text-2xl font-semibold">{group.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6e6e73] dark:text-[#a1a1a6]">
                  Built for fast interaction, clear states, resilient APIs, and long-term maintainability.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-[#f5f5f7] px-3 py-1.5 text-xs font-semibold text-[#1d1d1f]/75 dark:bg-white/10 dark:text-white/75"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.article>
            </MotionSection>
          );
        })}
      </div>
    </div>
  </section>
));

AppleSkills.displayName = 'AppleSkills';

export default AppleSkills;
