import { memo, useCallback } from 'react';
import { Mail, Phone } from 'lucide-react';
import RevealSection from './ui/RevealSection';
import { userData } from '../data/portfolio';

const Footer = memo(() => {
  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  return (
    <footer className="px-6 pt-32 pb-12">
      {/* Contact CTA card */}
      <RevealSection>
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-12 md:p-24 text-center">
            {/* Subtle top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/20" aria-hidden />

            <div className="relative z-10">
              <p className="text-white/60 text-[10px] uppercase tracking-[0.4em] font-black font-outfit mb-4">
                Get in touch
              </p>
              <h2 className="text-5xl md:text-7xl font-black font-outfit tracking-tighter text-white mb-6">
                Let's connect.
              </h2>
              <p className="text-white/80 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                Open to discussing HIPAA-compliant systems, micro-frontend patterns, or senior engineering roles.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`mailto:${userData.email}`}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black font-outfit text-sm hover:bg-white/90 active:scale-95 transition-all shadow-2xl shadow-black/20"
                >
                  <Mail size={17} />
                  {userData.email}
                </a>
                <a
                  href={`tel:${userData.phone}`}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black font-outfit text-sm hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
                >
                  <Phone size={17} />
                  {userData.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Footer bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-5 pt-8 border-t dark:border-white/[0.06] border-slate-200">
        <button
          onClick={scrollToTop}
          className="text-[10px] font-black uppercase tracking-[0.3em] font-outfit dark:text-slate-600 text-slate-400 hover:text-indigo-500 transition-colors"
        >
          © 2024 {userData.name} · Bangalore, India
        </button>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] font-outfit dark:text-slate-600 text-slate-400">
          <a
            href={userData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={userData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
