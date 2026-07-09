import { memo, useCallback, useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
  { id: 'about', label: 'Overview' },
  { id: 'skills', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const Navbar = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const raf = useRef(0);

  // Listen to the snap-shell scroll container
  useEffect(() => {
    const el = document.querySelector('.snap-shell') as HTMLElement | null;
    if (!el) return;

    const handler = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        const scrolled = el.scrollTop;
        const height = el.scrollHeight - el.clientHeight;
        setProgress(height > 0 ? (scrolled / height) * 100 : 0);
        setIsScrolled(scrolled > 30);

        // Detect active section
        const sections = NAV_LINKS.map(link => ({
          id: link.id,
          el: document.getElementById(link.id),
        }));
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.el) {
            const rect = section.el.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2) {
              setActiveSection(section.id);
              break;
            }
          }
        }

        raf.current = 0;
      });
    };

    el.addEventListener('scroll', handler, { passive: true });
    return () => {
      el.removeEventListener('scroll', handler);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const handleNav = useCallback((id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  }, []);

  return (
    <>
      {/* Progress Bar — gradient glow */}
      <div
        className="fixed left-0 top-0 z-[200] h-[2px]"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #14f1d9, #a3e635, #a78bfa)',
          boxShadow: '0 0 12px rgba(163, 230, 53, 0.5), 0 0 24px rgba(20, 241, 217, 0.3)',
          transition: 'width 0.12s linear',
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <nav
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'border-b border-white/[0.06] bg-[#050510]/70 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl'
            : 'border-b border-transparent bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          {/* Logo */}
          <button
            onClick={() => handleNav('about')}
            className="group relative text-xl font-black tracking-tight text-white transition-colors"
            aria-label="Scroll to overview"
          >
            <span className="gradient-text-3d">AL</span>
            <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-[#a3e635] transition-all duration-300 group-hover:w-full" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-[#a3e635]'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/10 md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden border-t border-white/[0.06] bg-[#050510]/95 px-5 py-6 backdrop-blur-2xl"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-5">
                {NAV_LINKS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`text-left text-2xl font-bold transition-colors ${
                      activeSection === item.id
                        ? 'text-[#a3e635]'
                        : 'text-white/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
