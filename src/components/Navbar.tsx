import { memo, useCallback, useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollProgress } from '../hooks/useScrollProgress';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

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

const Navbar = memo(({ isDark, onToggleTheme }: NavbarProps) => {
  const { progress, isScrolled } = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = useCallback((id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  }, []);

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[200] h-[2px] bg-[#0071e3]"
        style={{ width: `${progress}%`, transition: 'width 0.12s linear' }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <nav
        className={`fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300 ${
          isScrolled
            ? 'border-black/10 bg-white/80 shadow-sm shadow-black/[0.03] backdrop-blur-2xl dark:border-white/10 dark:bg-[#101010]/80'
            : 'border-transparent bg-white/55 backdrop-blur-xl dark:bg-black/35'
        }`}
      >
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
          <button
            onClick={() => handleNav('about')}
            className="text-[21px] font-semibold text-[#1d1d1f] transition-colors hover:text-[#0071e3] dark:text-[#f5f5f7]"
            aria-label="Scroll to overview"
          >
            AL
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="text-xs font-medium tracking-normal text-[#1d1d1f]/75 transition-colors hover:text-[#0071e3] dark:text-[#f5f5f7]/75 dark:hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle colour scheme"
              className="grid h-8 w-8 place-items-center rounded-lg text-[#1d1d1f]/75 transition-colors hover:bg-black/5 hover:text-[#0071e3] dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid h-8 w-8 place-items-center rounded-lg text-[#1d1d1f] transition-colors hover:bg-black/5 md:hidden dark:text-white dark:hover:bg-white/10"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden border-t border-black/10 bg-white/95 px-5 py-5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#101010]/95"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-4">
                {NAV_LINKS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="text-left text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]"
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
