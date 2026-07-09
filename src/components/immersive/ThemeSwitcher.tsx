import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';
import { THEME_LIST, type SceneThemeId } from '../../data/sceneThemes';

interface ThemeSwitcherProps {
  activeTheme: SceneThemeId;
  onChangeTheme: (id: SceneThemeId) => void;
}

const ThemeSwitcher = memo(({ activeTheme, onChangeTheme }: ThemeSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col-reverse items-end gap-3">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full glass-panel-strong shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all hover:scale-110"
        whileTap={{ scale: 0.9 }}
        aria-label="Change scene theme"
        title="Change scene theme"
      >
        <Palette size={20} className="text-white/80 transition-colors group-hover:text-white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-white/10" style={{ animationDuration: '3s' }} />
      </motion.button>

      {/* Theme Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {THEME_LIST.map((theme) => {
              const isActive = theme.id === activeTheme;
              return (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    onChangeTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                    isActive
                      ? 'glass-panel-strong shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                      : 'glass-panel hover:glass-panel-strong'
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: `${theme.accent}40`,
                          boxShadow: `0 0 20px ${theme.accent}20`,
                        }
                      : undefined
                  }
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Theme color dot */}
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                    style={{
                      background: isActive ? `${theme.accent}20` : 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${isActive ? theme.accent : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    {theme.icon}
                  </span>
                  <div className="text-left">
                    <div
                      className="text-xs font-bold"
                      style={{ color: isActive ? theme.accent : 'rgba(255,255,255,0.8)' }}
                    >
                      {theme.label}
                    </div>
                    <div className="text-[10px] text-white/40">{theme.description}</div>
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="theme-active-dot"
                      className="ml-1 h-2 w-2 rounded-full"
                      style={{ background: theme.accent }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
export default ThemeSwitcher;
