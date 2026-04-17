import { memo } from 'react';
import { Mail, Phone } from 'lucide-react';
import MotionSection from '../ui/MotionSection';
import { userData } from '../../data/portfolio';

const AppleFooter = memo(() => (
  <footer className="bg-white px-5 py-16 text-[#1d1d1f] dark:bg-[#050505] dark:text-[#f5f5f7] md:py-24">
    <MotionSection className="mx-auto max-w-6xl">
      <div className="rounded-lg bg-[#f5f5f7] p-8 text-center dark:bg-[#161617] md:p-16">
        <p className="text-sm font-semibold text-[#0071e3]">Get in touch</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-[clamp(2.8rem,6vw,6rem)] font-semibold leading-[0.95]">
          Let's build the next polished experience.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-7 text-[#6e6e73] dark:text-[#a1a1a6]">
          Open to senior frontend roles, healthcare products, AI workflows, and design-system work.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${userData.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0077ed]"
          >
            <Mail size={16} />
            {userData.email}
          </a>
          <a
            href={`tel:${userData.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black/5 px-6 py-3 text-sm font-semibold text-[#1d1d1f] transition hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Phone size={16} />
            {userData.phone}
          </a>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-black/10 pt-6 text-xs text-[#6e6e73] dark:border-white/10 dark:text-[#a1a1a6] sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright © 2026 {userData.name}. Bangalore, India.</p>
        <div className="flex gap-5">
          <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0071e3]">
            LinkedIn
          </a>
          <a href={userData.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#0071e3]">
            GitHub
          </a>
        </div>
      </div>
    </MotionSection>
  </footer>
));

AppleFooter.displayName = 'AppleFooter';

export default AppleFooter;
