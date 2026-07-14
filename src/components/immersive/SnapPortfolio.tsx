import { memo, useCallback, useState } from 'react';
import {
  Home as HomeIcon,
  User,
  Briefcase,
  Layers,
  Mail,
  MapPin,
  Phone,
  Download,
  Github,
  Linkedin,
  ArrowRight,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ThreeWorld from './ThreeWorld';
import { experience, projects, skillGroups, userData } from '../../data/portfolio';
import { TiltCard } from './TiltCard';
import { type SceneTheme } from '../../data/sceneThemes';

/* ── Motion Presets ─────────────────────────────────────────── */
const pageMotion = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Glow Button ────────────────────────────────────────────── */
interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  download?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

function GlowButton({
  children,
  href,
  onClick,
  variant = 'primary',
  download,
  target,
  rel,
  style,
}: GlowButtonProps) {
  const baseClasses =
    'relative inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300';
  const primaryClasses =
    'bg-[#a3e635] text-black hover:bg-[#bef264] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)]';
  const ghostClasses =
    'glass-panel text-white/90 hover:text-white hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]';

  const classes = `${baseClasses} ${variant === 'primary' ? primaryClasses : ghostClasses}`;

  if (href) {
    return (
      <a href={href} className={classes} download={download} target={target} rel={rel} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes} style={style}>
      {children}
    </button>
  );
}

/* ── Skill Tag ──────────────────────────────────────────────── */
function SkillTag({ label }: { label: string }) {
  return (
    <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white/90">
      {label}
    </span>
  );
}

/* ── Tab Icons definitions ──────────────────────────────────── */
const NAV_LINKS = [
  { id: 'about', label: 'Home', icon: HomeIcon },
  { id: 'skills', label: 'Stack', icon: Layers },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Work', icon: User }, // User icon maps well to "projects" or general details
  { id: 'contact', label: 'Contact', icon: Mail },
] as const;

/* ── Main Component ─────────────────────────────────────────── */
interface SnapPortfolioProps {
  theme: SceneTheme;
}

const SnapPortfolio = memo(({ theme }: SnapPortfolioProps) => {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [displayTab, setDisplayTab] = useState<string>('about');
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const handleTabChange = useCallback((newTab: string) => {
    if (newTab === activeTab || transitioning) return;
    setTransitioning(true);
    setActiveTab(newTab);
    // midpoint of slide animation changes visible content
    setTimeout(() => {
      setDisplayTab(newTab);
    }, 450);
    setTimeout(() => {
      setTransitioning(false);
    }, 900);
  }, [activeTab, transitioning]);

  // Form submission handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for connecting! Athi Lakshmi will get back to you soon.');
  };

  return (
    <div className="relative h-screen overflow-hidden text-white bg-site transition-colors duration-1000" style={{ backgroundColor: theme.bg }}>
      {/* Three.js particles background */}
      <ThreeWorld theme={theme} />

      {/* Explosion Overlay (Mix Blend Dodge) */}
      <div
        className="absolute right-0 bottom-0 w-[1000px] h-full pointer-events-none select-none opacity-40 mix-blend-color-dodge z-[1] transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-explosion.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Top Left Glow Overlay */}
      <div className="absolute left-0 top-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] pointer-events-none select-none opacity-40 mix-blend-color-dodge z-[1]">
        <img src={`${import.meta.env.BASE_URL}top-left-img.png`} alt="glow decoration" className="w-full h-full object-contain" />
      </div>

      {/* ── Top Header Logo Bar ─────────────────────────────── */}
      <header className="absolute z-30 w-full px-6 xl:px-16 py-6 flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => handleTabChange('about')}
          className="text-2xl font-black tracking-tighter text-white hover:text-[#a3e635] transition-colors"
          style={{ color: '#fff' }}
        >
          AL<span style={{ color: theme.accent }}>.</span>
        </button>
        <div className="flex items-center gap-x-5 text-lg">
          <a href={userData.github} target="_blank" rel="noreferrer noopener" className="text-white/70 hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <a href={userData.linkedin} target="_blank" rel="noreferrer noopener" className="text-white/70 hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </header>

      {/* ── Side Bubble Navigation (Desktop) ─────────────────── */}
      <nav className="hidden xl:flex flex-col items-center justify-center gap-y-4 fixed h-max right-[2%] z-50 top-0 bottom-0 mt-auto mb-auto">
        <div className="flex flex-col items-center justify-center gap-y-6 py-6 px-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-full">
          {NAV_LINKS.map((link) => {
            const LinkIcon = link.icon;
            const isActive = link.id === activeTab;
            return (
              <button
                key={link.id}
                onClick={() => handleTabChange(link.id)}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.4)]' : 'text-white/60 hover:text-[#a3e635]'
                }`}
                style={isActive ? { backgroundColor: theme.accent, color: '#000', boxShadow: `0 0 20px ${theme.accent}60` } : undefined}
              >
                <LinkIcon size={18} />
                {/* Tooltip */}
                <div className="absolute right-14 pr-2 hidden group-hover:flex items-center">
                  <div className="relative flex bg-white text-black text-xs font-semibold py-1.5 px-3 rounded-md shadow-lg capitalize tracking-wide whitespace-nowrap">
                    {link.label}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-solid border-l-white border-l-6 border-y-transparent border-y-4 border-r-0" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom Navigation (Mobile) ────────────────────────── */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 h-[72px] z-50 bg-[#050510]/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-4">
        {NAV_LINKS.map((link) => {
          const LinkIcon = link.icon;
          const isActive = link.id === activeTab;
          return (
            <button
              key={link.id}
              onClick={() => handleTabChange(link.id)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                isActive ? 'bg-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'text-white/50'
              }`}
              style={isActive ? { backgroundColor: theme.accent, color: '#000' } : undefined}
              aria-label={link.label}
            >
              <LinkIcon size={20} />
            </button>
          );
        })}
      </nav>

      {/* ── Tab Content Container ────────────────────────────── */}
      <main className="relative z-10 w-full h-full overflow-y-auto pb-[80px] xl:pb-0 scrollbar-none">
        <AnimatePresence mode="wait">
          {displayTab === 'about' && (
            <motion.div key="about" {...pageMotion} className="container mx-auto flex flex-col xl:flex-row items-center justify-between min-h-full px-5 py-24 xl:py-0">
              {/* Text Area */}
              <div className="w-full xl:max-w-[55%] z-10 text-center xl:text-left">
                <motion.div
                  className="mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-4 py-2"
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="h-2 w-2 rounded-full bg-[#a3e635] animate-pulse" style={{ backgroundColor: theme.accent }} />
                  <span className="text-xs font-semibold text-white/70">Available for Opportunities</span>
                </motion.div>

                <h1 className="font-outfit text-3d-depth text-[clamp(2.5rem,6.5vw,5.2rem)] font-black leading-[1.0] text-white/95">
                  Transforming Ideas <br />
                  Into <span className="gradient-text-3d" style={{ backgroundImage: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent2} 50%, #a78bfa 100%)` }}>Digital Reality</span>
                </h1>

                <p className="mt-6 text-sm md:text-base font-medium leading-7 text-white/60 max-w-xl mx-auto xl:mx-0">
                  Hi, I'm <strong className="text-white font-bold">{userData.name}</strong>, a {userData.title}. I specialize in building fast interfaces, AI-powered streaming audio pipelines, and scalable micro-frontend architectures.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center xl:justify-start gap-4 text-xs text-white/40">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {userData.location}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone size={12} /> {userData.phone}</span>
                </div>

                <div className="mt-8 flex flex-wrap justify-center xl:justify-start gap-4 items-center">
                  <GlowButton onClick={() => handleTabChange('projects')} variant="primary" style={{ backgroundColor: theme.accent }}>
                    Explore Work <ArrowRight size={15} />
                  </GlowButton>
                  <GlowButton href={userData.resume} download="Athi_Lakshmi.pdf" variant="ghost" target="_blank" rel="noopener noreferrer">
                    <Download size={15} /> Resume
                  </GlowButton>
                  
                  {/* Circular Rotating Badge (Desktop Only) */}
                  <button 
                    onClick={() => handleTabChange('projects')}
                    className="hidden lg:flex relative ml-8 w-24 h-24 items-center justify-center rounded-full hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-[#a3e635]/5 rounded-full border border-white/10" />
                    <svg viewBox="0 0 100 100" className="animate-spin-slow w-full h-full pointer-events-none select-none">
                      <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                      <text className="fill-white/70 font-semibold uppercase tracking-[0.2em] text-[7.5px]">
                        <textPath href="#circlePath" startOffset="0%">
                          Projects • Portfolio • Work • Code •
                        </textPath>
                      </text>
                    </svg>
                    <ArrowRight className="absolute text-white/80" size={18} />
                  </button>
                </div>
              </div>

              {/* Avatar Cutout (Desktop Only) */}
              <div className="hidden xl:flex relative w-[420px] h-[420px] rounded-full overflow-hidden border border-white/10 items-center justify-center pointer-events-none select-none z-10 mr-8">
                {/* Glow Backdrop */}
                <div className="absolute inset-0 bg-[#14f1d9]/5 rounded-full blur-[40px] animate-pulse" style={{ backgroundColor: `${theme.accent}10` }} />
                
                {/* Female Developer Avatar cut-out */}
                <motion.img
                  src={`${import.meta.env.BASE_URL}avatar.png`}
                  alt="Athi Lakshmi - Female Developer Avatar"
                  className="w-full h-full object-cover z-10 drop-shadow-[0_10px_35px_rgba(20,241,217,0.25)]"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}

          {displayTab === 'skills' && (
            <motion.div key="skills" {...pageMotion} className="container mx-auto flex flex-col justify-center min-h-full px-5 py-24">
              <div className="text-center xl:text-left mb-10">
                <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: theme.accent }}>01 · Expertise</span>
                <h2 className="font-outfit text-3d-depth text-[clamp(2.3rem,5vw,4rem)] font-black text-white/95 mt-2">
                  Technical Ecosystem
                </h2>
              </div>

              <motion.div
                className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {skillGroups.map((group, index) => {
                  const colors = [theme.accent, theme.accent2, '#a78bfa', '#fb3f6c'];
                  const color = colors[index % colors.length];
                  return (
                    <motion.div key={group.label} variants={staggerItem}>
                      <TiltCard className="glass-panel min-h-[220px] p-6 lg:min-h-[260px]" glowColor={color}>
                        <div className="card-3d-layer-front">
                          <span className="text-xs font-black uppercase tracking-wider" style={{ color }}>0{index + 1}</span>
                        </div>
                        <div className="card-3d-layer-mid">
                          <h3 className="mt-3 text-lg font-black text-white/90">{group.label}</h3>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
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
          )}

          {displayTab === 'experience' && (
            <motion.div key="experience" {...pageMotion} className="container mx-auto flex flex-col justify-center min-h-full px-5 py-24">
              <div className="text-center xl:text-left mb-10">
                <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: theme.accent }}>02 · Timeline</span>
                <h2 className="font-outfit text-3d-depth text-[clamp(2.3rem,5vw,4rem)] font-black text-white/95 mt-2">
                  Professional Delivery
                </h2>
              </div>

              <motion.div
                className="grid gap-6 lg:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {experience.map((job, i) => (
                  <motion.div key={job.company} variants={staggerItem}>
                    <TiltCard className="glass-panel-strong p-6 md:p-8" glowColor={i === 0 ? theme.accent : theme.accent2}>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <span
                          className="rounded-full px-3 py-0.5 text-xs font-bold"
                          style={{
                            color: i === 0 ? theme.accent : theme.accent2,
                            background: `${i === 0 ? theme.accent : theme.accent2}10`,
                            border: `1px solid ${i === 0 ? theme.accent : theme.accent2}20`,
                          }}
                        >
                          {job.period}
                        </span>
                        <span className="text-xs text-white/40">{job.location}</span>
                      </div>

                      <h3 className="text-xl font-black text-white/90 mt-4">{job.company}</h3>
                      <p className="text-sm font-semibold text-white/50 mt-1">{job.role}</p>

                      <ul className="mt-5 space-y-2.5 text-xs md:text-sm font-medium leading-relaxed text-white/60">
                        {job.highlights.map((h, index) => (
                          <li key={index} className="flex gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span key={tag} className="rounded-lg bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {displayTab === 'projects' && (
            <motion.div key="projects" {...pageMotion} className="container mx-auto flex flex-col justify-center min-h-full px-5 py-24">
              <div className="text-center xl:text-left mb-10">
                <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: theme.accent }}>03 · Case Studies</span>
                <h2 className="font-outfit text-3d-depth text-[clamp(2.3rem,5vw,4rem)] font-black text-white/95 mt-2">
                  Featured Projects
                </h2>
              </div>

              <motion.div
                className="grid gap-6 lg:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {projects.map((project, i) => (
                  <motion.div key={project.title} variants={staggerItem}>
                    <TiltCard className="glow-border glass-panel relative min-h-[300px] p-8" glowColor={i === 0 ? '#a78bfa' : theme.accent}>
                      <div className="card-3d-layer-front">
                        <span
                          className="rounded-full px-3 py-0.5 text-xs font-bold"
                          style={{
                            color: project.accent === 'indigo' ? '#a78bfa' : theme.accent,
                            background: `${project.accent === 'indigo' ? '#a78bfa' : theme.accent}10`,
                            border: `1px solid ${project.accent === 'indigo' ? '#a78bfa' : theme.accent}20`,
                          }}
                        >
                          {project.category}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white/90 mt-4 leading-snug">{project.title}</h3>
                      <p className="mt-4 text-xs md:text-sm font-medium leading-relaxed text-white/50">{project.desc}</p>

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <span key={t} className="rounded-lg bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-4">
                        <span className="text-xs font-bold text-white/40">{project.client}</span>
                        <ArrowRight className="text-[#a3e635]" size={16} style={{ color: theme.accent }} />
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {displayTab === 'contact' && (
            <motion.div key="contact" {...pageMotion} className="container mx-auto flex flex-col justify-center min-h-full px-5 py-24">
              <div className="grid gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto w-full">
                {/* Connect Headers */}
                <div className="text-center lg:text-left">
                  <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: theme.accent }}>04 · Connect</span>
                  <h2 className="font-outfit text-3d-depth text-[clamp(2.5rem,6vw,4.5rem)] font-black text-white/95 mt-2">
                    Let's connect.
                  </h2>
                  <p className="mt-5 text-sm md:text-base font-medium leading-relaxed text-white/50 max-w-md mx-auto lg:mx-0">
                    Feel free to reach out for software engineering opportunities, tech alignments, or collaborations. Let's build something epic!
                  </p>

                  <div className="mt-8 flex flex-col gap-4 text-sm text-white/60 items-center lg:items-start">
                    <span className="inline-flex items-center gap-3"><MapPin size={16} className="text-[#a3e635]" style={{ color: theme.accent }} /> {userData.location}</span>
                    <span className="inline-flex items-center gap-3"><Mail size={16} className="text-[#a3e635]" style={{ color: theme.accent }} /> {userData.email}</span>
                  </div>

                  <div className="mt-8 flex gap-3 justify-center lg:justify-start">
                    <GlowButton href={userData.github} variant="ghost" target="_blank" rel="noopener noreferrer">
                      <Github size={16} /> Github
                    </GlowButton>
                    <GlowButton href={userData.linkedin} variant="ghost" target="_blank" rel="noopener noreferrer">
                      <Linkedin size={16} /> LinkedIn
                    </GlowButton>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleContactSubmit} className="glass-panel p-6 md:p-8 flex flex-col gap-4 w-full">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Name" className="input" required />
                    <input type="email" name="email" placeholder="E-mail" className="input" required />
                  </div>
                  <input type="text" name="subject" placeholder="Subject" className="input" required />
                  <textarea name="message" placeholder="Message..." className="textarea" required></textarea>

                  <button
                    type="submit"
                    className="relative flex h-12 w-full max-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#a3e635] text-black font-bold text-sm transition-all duration-300 hover:bg-[#bef264] hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] self-center lg:self-start"
                    style={{ backgroundColor: theme.accent }}
                  >
                    Send Message <Send size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Slide Transition Screen Overlay ────────────────────── */}
      <AnimatePresence>
        {transitioning && (
          <>
            <motion.div
              className="fixed top-0 bottom-0 right-0 w-screen h-screen z-[200] bg-[#2e2257]"
              initial={{ x: '100%' }}
              animate={{ x: ['100%', '0%', '-100%'] }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="fixed top-0 bottom-0 right-0 w-screen h-screen z-[190] bg-[#3b2d71]"
              initial={{ x: '100%' }}
              animate={{ x: ['100%', '0%', '-100%'] }}
              transition={{ delay: 0.08, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="fixed top-0 bottom-0 right-0 w-screen h-screen z-[180] bg-[#4b3792]"
              initial={{ x: '100%' }}
              animate={{ x: ['100%', '0%', '-100%'] }}
              transition={{ delay: 0.16, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

SnapPortfolio.displayName = 'SnapPortfolio';

export default SnapPortfolio;
