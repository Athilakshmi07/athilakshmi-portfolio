import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SnapPortfolio from './components/immersive/SnapPortfolio';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Sync Tailwind dark mode via html class
    document.documentElement.classList.toggle('dark', isDark);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? '#050816' : '#f8fafc';
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return (
    <div className="h-screen overflow-hidden">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      <SnapPortfolio />
    </div>
  );
}
