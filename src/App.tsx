import { useEffect, useRef, useState, useCallback } from 'react';
import SnapPortfolio from './components/immersive/SnapPortfolio';
import ThemeSwitcher from './components/immersive/ThemeSwitcher';
import { SCENE_THEMES, DEFAULT_THEME, type SceneThemeId } from './data/sceneThemes';

export default function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [themeId, setThemeId] = useState<SceneThemeId>(DEFAULT_THEME);
  const theme = SCENE_THEMES[themeId];

  useEffect(() => {
    // Always dark
    document.documentElement.classList.add('dark');
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = theme.bg;
  }, [theme.bg]);

  const handleChangeTheme = useCallback((id: SceneThemeId) => {
    setThemeId(id);
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cx = 0, cy = 0;
    let tx = 0, ty = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.left = `${tx}px`;
      dot.style.top = `${ty}px`;
    };

    const animate = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      frame = requestAnimationFrame(animate);
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        cursor.classList.add('hovering');
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        cursor.classList.remove('hovering');
      }
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />

      <SnapPortfolio theme={theme} />
      <ThemeSwitcher activeTheme={themeId} onChangeTheme={handleChangeTheme} />
    </div>
  );
}
