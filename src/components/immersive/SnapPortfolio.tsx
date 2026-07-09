import { memo, useCallback } from 'react';
import { ArrowDown, ArrowRight, Download, Github, Linkedin, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeWorld from './ThreeWorld';
import { experience, projects, skillGroups, stats, userData } from '../../data/portfolio';
import { TiltCard } from './TiltCard';

/* ── Motion Presets ─────────────────────────────────────────── */
const sectionMotion = {
  initial: { opacity: 0, y: 60, rotateX: 6 },
  whileInView: { opacity: 1, y: 0, rotateX: 0 },
  viewport: { amount: 0.4 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Section Label Component ────────────────────────────────── */
function SectionLabel({ number, text, color = '#14f1d9' }: { number: string; text: string; color?: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase"
        style={{
          color,
          background: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        {number}
      </span>
      <span className="text-sm font-medium" style={{ color: `${color}aa` }}>{text}</span>
    </div>
  );
}

/* ── Glowing Button ─────────────────────────────────────────── */
function GlowButton({
  children,
  href,
  onClick,
  variant = 'primary',
  download,
  target,
  rel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  download?: string;
  target?: string;
  rel?: string;
}) {
  const baseClasses =
    'relative inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300';
  const primaryClasses =
    'bg-[#a3e635] text-black hover:bg-[#bef264] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)]';
  const ghostClasses =
    'glass-panel text-white/90 hover:text-white hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]';

  const classes = `${baseClasses} ${variant === 'primary' ? primaryClasses : ghostClasses}`;

  if (href) {
    return (
      <a href={href} className={classes} download={download} target={target} rel={rel}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

/* ── Skill Tag ──────────────────────────────────────────────── */
function SkillTag({ label }: { label: string }) {
  return (
    <span className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.12] hover:text-white/90">
      {label}
    </span>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
const SnapPortfolio = memo(() => {
  const scrollToNext = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#050510] text-white">
      {/* Three.js background */}
      <ThreeWorld />

      {/* Overlay gradients for depth */}
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(20,241,217,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(163,230,53,0.05),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent" />
      </div>

      {/* ── Scrollable Content ──────────────────────────────── */}
      <main className="snap-shell relative z-10 h-screen overflow-y-auto overflow-x-hidden scroll-smooth">

        {/* ═══════════════ HERO ═══════════════ */}
        <section
          id="about"
          className="snap-panel perspective-container flex min-h-screen snap-start snap-always items-center overflow-hidden px-5 py-16 md:py-20"
        >
          <motion.div
            className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12"
            {...sectionMotion}
          >
            {/* Left — Text */}
            <div>
              <motion.div
                className="mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-4 py-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-pulse" />
                <span className="text-xs font-semibold text-white/70">Available for opportunities</span>
              </motion.div>

              <h1 className="text-3d-depth font-outfit max-w-[22rem] text-[clamp(2.8rem,12vw,6.5rem)] font-black leading-[0.9] sm:max-w-3xl">
                <span className="gradient-text-3d">Athi Lakshmi</span>
                <br />
                <span className="text-white/90">builds the future.</span>
              </h1>

              <p className="mt-6 max-w-[22rem] text-base font-medium leading-7 text-white/55 sm:max-w-xl md:text-lg md:leading-8">
                {userData.title} crafting fast interfaces, AI-powered streaming workflows, and accessible product systems.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/40">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} /> {userData.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} /> {userData.phone}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <GlowButton onClick={() => scrollToNext('skills')}>
                  Explore my work <ArrowDown size={15} />
                </GlowButton>
                <GlowButton href={userData.resume} download="Athi_Lakshmi.pdf" variant="ghost">
                  <Download size={15} /> Resume
                </GlowButton>
                <GlowButton href={userData.github} variant="ghost" target="_blank" rel="noopener noreferrer">
                  <Github size={15} /> GitHub
                </GlowButton>
                <GlowButton href={userData.linkedin} variant="ghost" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={15} /> LinkedIn
                </GlowButton>
              </div>
            </div>

            {/* Right — Stat Cards */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.4 }}
            >
              {stats.map((stat, i) => (
                <motion.div key={stat.label} variants={staggerItem}>
                  <TiltCard className="glass-panel-strong p-5 md:p-7" glowColor={i % 2 === 0 ? '#a3e635' : '#14f1d9'}>
                    <div className="card-3d-layer-front">
                      <div
                        className="text-4xl font-black md:text-5xl"
                        style={{ color: i % 2 === 0 ? '#a3e635' : '#14f1d9' }}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <div className="card-3d-layer-mid mt-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-white/50 md:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════ SKILLS ═══════════════ */}
        <section
          id="skills"
          className="snap-panel perspective-container flex min-h-screen snap-start snap-always items-center px-5 py-20"
        >
          <motion.div className="mx-auto w-full max-w-6xl" {...sectionMotion}>
            <SectionLabel number="01" text="Technical Stack" color="#14f1d9" />
            <h2 className="font-outfit text-3d-depth max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.92]">
              A stack that moves
              <br />
              <span className="gradient-text-warm">like a product.</span>
            </h2>

            <motion.div
              className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
            >
              {skillGroups.map((group, index) => {
                const colors = ['#14f1d9', '#a3e635', '#a78bfa', '#fb3f6c'];
                const color = colors[index % colors.length];
                return (
                  <motion.div key={group.label} variants={staggerItem}>
                    <TiltCard
                      className="glass-panel min-h-[240px] p-6 lg:min-h-[300px]"
                      glowColor={color}
                      maxTilt={15}
                    >
                      <div className="card-3d-layer-front">
                        <span
                          className="text-sm font-black"
                          style={{ color }}
                        >
                          0{index + 1}
                        </span>
                      </div>
                      <div className="card-3d-layer-mid">
                        <h3 className="mt-4 text-xl font-black text-white/95">{group.label}</h3>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2 lg:mt-6">
                        {group.skills.map((skill) => (
                          <SkillTag key={skill} label={skill} />
                        ))}
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════ EXPERIENCE ═══════════════ */}
        <section
          id="experience"
          className="snap-panel perspective-container flex min-h-screen snap-start snap-always items-center px-5 py-20"
        >
          <motion.div className="mx-auto w-full max-w-6xl" {...sectionMotion}>
            <SectionLabel number="02" text="Career Timeline" color="#fb3f6c" />
            <h2 className="font-outfit text-3d-depth max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.92]">
              Real delivery,
              <br />
              <span className="gradient-text-3d">full-screen focus.</span>
            </h2>

            <motion.div
              className="mt-10 grid gap-4 lg:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
            >
              {experience.map((job, i) => (
                <motion.div key={job.company} variants={staggerItem}>
                  <TiltCard
                    className="glass-panel-strong p-7 md:p-9"
                    glowColor={i === 0 ? '#a3e635' : '#14f1d9'}
                    maxTilt={10}
                  >
                    <div className="card-3d-layer-front">
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold"
                          style={{
                            color: i === 0 ? '#a3e635' : '#14f1d9',
                            background: i === 0 ? 'rgba(163,230,53,0.1)' : 'rgba(20,241,217,0.1)',
                            border: `1px solid ${i === 0 ? 'rgba(163,230,53,0.2)' : 'rgba(20,241,217,0.2)'}`,
                          }}
                        >
                          {job.period}
                        </span>
                        <span className="text-xs text-white/35">{job.location}</span>
                      </div>
                    </div>

                    <div className="card-3d-layer-mid mt-5">
                      <h3 className="text-2xl font-black text-white/95 md:text-3xl">{job.company}</h3>
                      <p className="mt-1.5 text-base font-semibold text-white/50">{job.role}</p>
                    </div>

                    <ul className="mt-6 space-y-3 text-sm font-medium leading-6 text-white/60">
                      {job.highlights.map((h) => (
                        <li key={h} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a3e635]/50" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/45"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════ PROJECTS ═══════════════ */}
        <section
          id="projects"
          className="snap-panel perspective-container flex min-h-screen snap-start snap-always items-center px-5 py-20"
        >
          <motion.div className="mx-auto w-full max-w-6xl" {...sectionMotion}>
            <SectionLabel number="03" text="Featured Work" color="#a3e635" />
            <h2 className="font-outfit text-3d-depth max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.92]">
              Case studies that feel
              <br />
              <span className="gradient-text-warm">dimensional.</span>
            </h2>

            <motion.div
              className="mt-10 grid gap-4 lg:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
            >
              {projects.map((project, i) => (
                <motion.div key={project.title} variants={staggerItem}>
                  <TiltCard
                    className="glow-border glass-panel relative min-h-[340px] p-8 lg:min-h-[420px]"
                    glowColor={i === 0 ? '#a78bfa' : '#14f1d9'}
                    maxTilt={8}
                  >
                    <div className="card-3d-layer-front">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{
                          color: project.accent === 'indigo' ? '#a78bfa' : '#14f1d9',
                          background:
                            project.accent === 'indigo'
                              ? 'rgba(167,139,250,0.1)'
                              : 'rgba(20,241,217,0.1)',
                          border: `1px solid ${project.accent === 'indigo' ? 'rgba(167,139,250,0.25)' : 'rgba(20,241,217,0.25)'}`,
                        }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <div className="card-3d-layer-mid mt-5">
                      <h3 className="max-w-md text-3xl font-black leading-tight text-white/95 md:text-4xl">
                        {project.title}
                      </h3>
                    </div>

                    <p className="mt-5 max-w-md text-sm font-medium leading-7 text-white/55 md:text-base">
                      {project.desc}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white/45"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-7 left-8 right-8 flex items-center justify-between">
                      <span className="text-sm font-bold text-white/40">{project.client}</span>
                      <ArrowRight className="text-[#a3e635]" size={18} />
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════ CONTACT ═══════════════ */}
        <section
          id="contact"
          className="snap-panel perspective-container flex min-h-screen snap-start snap-always items-center px-5 py-20"
        >
          <motion.div className="mx-auto max-w-4xl text-center" {...sectionMotion}>
            <SectionLabel number="04" text="Get In Touch" color="#a78bfa" />

            <h2 className="font-outfit text-3d-depth text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.88]">
              <span className="gradient-text-3d">Let's make</span>
              <br />
              <span className="text-white/90">it move.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-white/50 md:text-xl">
              Open to modern frontend, 3D web, AI workflow, and product engineering opportunities.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <GlowButton href={`mailto:${userData.email}`}>
                <Mail size={16} /> Let's Talk
              </GlowButton>
              <GlowButton href={userData.github} variant="ghost" target="_blank" rel="noopener noreferrer">
                <Github size={16} /> GitHub
              </GlowButton>
              <GlowButton href={userData.linkedin} variant="ghost" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> LinkedIn
              </GlowButton>
              <GlowButton href={userData.resume} variant="ghost" download="Athi_Lakshmi.pdf">
                <ExternalLink size={16} /> Resume
              </GlowButton>
            </div>

            <p className="mt-14 text-xs text-white/20">
              Designed & built by {userData.name} · {new Date().getFullYear()}
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
});

SnapPortfolio.displayName = 'SnapPortfolio';

export default SnapPortfolio;
