import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const useSmoothAnchors = () => {
  useEffect(() => {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const smoothTo = (targetY, duration = 800) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        window.scrollTo(0, startY + diff * easeOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const handler = (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const header = document.querySelector('header');
      const offset = header ? header.offsetHeight : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - offset - 12;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      reduce ? el.scrollIntoView({ behavior: 'auto', block: 'start' }) : smoothTo(top, 800);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
};

function ParallaxBackdrop() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden" data-cursor="bubble">
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-32 top-0 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-40 bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400"/>
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-20 top-40 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400"/>
    </div>
  );
}

function Section({ id, title, kicker, children }){
  return (
    <section id={id} className="relative min-h-screen snap-start flex items-center py-24" data-cursor="bubble">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {kicker ? (
          <motion.p initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once: true }} className="text-sm tracking-widest text-sky-400 mb-3 uppercase">{kicker}</motion.p>
        ) : null}
        <motion.h2 initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{ once: true }} className="text-3xl md:text-5xl font-semibold text-zinc-100 leading-tight">
          {title}
        </motion.h2>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{ once: true }} className="mt-8 prose prose-invert max-w-none">
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function CustomCursor(){
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [trail, setTrail] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const id = ++idRef.current;
      setTrail(t => [...t.slice(-10), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setTrail(t => t.filter(b => b.id !== id)), 350);
    };
    const enter = (e) => {
      const el = e.target && e.target.closest ? e.target.closest('[data-cursor="bubble"]') : null;
      setHover(!!el);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', enter);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      <motion.div
        className="absolute rounded-full bg-white"
        animate={{ x: pos.x - (hover ? 18 : 8), y: pos.y - (hover ? 18 : 8), width: hover ? 36 : 16, height: hover ? 36 : 16, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
      {trail.map(b => (
        <motion.div key={b.id} className="absolute rounded-full bg-white/70"
          initial={{ x: b.x - 6, y: b.y - 6, width: 12, height: 12, opacity: 0.5 }}
          animate={{ x: b.x - 1, y: b.y - 1, width: 2, height: 2, opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      ))}
    </div>
  );
}

export default function PortfolioAppleStyle() {
  useSmoothAnchors();
  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: rootRef });
  const scaleLogo = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  useEffect(() => {
    try {
      console.assert(document.querySelector('header'), 'Header should render');
      console.assert(document.getElementById('edu-contact'), 'Merged Education & Contact section should exist');
      const resumeLinks = Array.from(document.querySelectorAll('a[download]'));
      console.assert(resumeLinks.length >= 1, 'At least one downloadable resume link should exist');
    } catch (e) {
      console.warn('Smoke tests warning:', e);
    }
  }, []);

  return (
    <div ref={rootRef} className="h-screen w-full overflow-y-scroll overflow-x-hidden bg-[#0b0b10] text-zinc-200 scroll-smooth snap-y snap-mandatory" data-cursor="bubble">
      <ParallaxBackdrop />
      <CustomCursor />

      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div style={{ scale: scaleLogo }} className="font-semibold tracking-tight">Athi Lakshmi</motion.div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-zinc-100 text-zinc-400">About</a>
            <a href="#skills" className="hover:text-zinc-100 text-zinc-400">Skills</a>
            <a href="#experience" className="hover:text-zinc-100 text-zinc-400">Experience</a>
            <a href="#projects" className="hover:text-zinc-100 text-zinc-400">Projects</a>
            <a href="#edu-contact" className="hover:text-zinc-100 text-zinc-400">Education & Contact</a>
            <a href="/mnt/data/athilakshmiS.pdf" download className="ml-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 hover:bg-white/10 transition">Download Résumé</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative min-h-screen snap-start flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-12 gap-8 items-center">
          <motion.div style={{ y: yHero }} className="md:col-span-7">
            <motion.h1 initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{ duration: 0.6 }} className="text-4xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              ATHI LAKSHMI S
            </motion.h1>
            <p className="mt-3 text-lg md:text-2xl text-zinc-300">Senior Frontend Developer</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4"/>Bangalore</span>
              <a href="tel:+918248377083" className="inline-flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4"/>+91 8248377083</a>
              <a href="mailto:athilak1999@gmail.com" className="inline-flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4"/>athilak1999@gmail.com</a>
              <a href="https://linkedin.com/in/athilakshmi-s" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Linkedin className="h-4 w-4"/>LinkedIn</a>
              <a href="https://github.com/AthiLakshmiS" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Github className="h-4 w-4"/>GitHub</a>
            </div>
            <div className="mt-10 flex items-center gap-3" data-cursor="bubble">
              <a href="#about" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm hover:bg-white/5 transition">Explore <ArrowRight className="h-4 w-4"/></a>
              <a href="/mnt/data/athilakshmiS.pdf" download className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-5 py-3 text-sm hover:bg-white/90 transition">Résumé PDF</a>
            </div>
          </motion.div>
          <div className="md:col-span-5">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{ delay: 0.15 }} className="aspect-[4/5] w-full rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6">
              <p className="text-sm text-zinc-400">Professional Summary</p>
              <div className="mt-3 text-zinc-100 text-sm leading-relaxed space-y-3">
                <p>I am a Front-End Developer with 4+ years of experience building scalable, high-performance web applications using React.js, TypeScript, and JavaScript (ES6+). Skilled in developing accessible, cloud-ready interfaces with a focus on performance and user experience.</p>
                <p>Experienced in AI/LLM integrations, semantic retrieval systems, and Copilot-like workflows, leveraging Azure Speech APIs, Deepgram, and SignalR to create intelligent, real-time solutions. Proficient in RESTful API and microservice integration, collaborating with backend systems in C#, Java, and Python.</p>
                <p>Strong understanding of system design, telemetry, and live site operations, with hands-on experience in Azure and AWS. Recognized for problem-solving, collaboration, and delivering complex product features aligned with responsible AI principles and a growth mindset.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section id="about" title="Professional Summary">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8 text-zinc-100 leading-relaxed space-y-4">
            <p>I am a Front-End Developer with 4+ years of experience building scalable, high-performance web applications using React.js, TypeScript, and JavaScript (ES6+). Skilled in developing accessible, cloud-ready interfaces with a focus on performance and user experience.</p>
            <p>Experienced in AI/LLM integrations, semantic retrieval systems, and Copilot-like workflows, leveraging Azure Speech APIs, Deepgram, and SignalR to create intelligent, real-time solutions. Proficient in RESTful API and microservice integration, collaborating with backend systems in C#, Java, and Python.</p>
            <p>Strong understanding of system design, telemetry, and live site operations, with hands-on experience in Azure and AWS. Recognized for problem-solving, collaboration, and delivering complex product features aligned with responsible AI principles and a growth mindset.</p>
          </div>
        </div>
      </Section>

      <Section id="skills" title="Technical Skills">
        <ul className="grid md:grid-cols-2 gap-6 !list-none p-0 m-0">
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">Frontend Technologies</p>
            <p className="leading-relaxed">React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Next.js, Redux, Context API</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">AI & LLM Integrations</p>
            <p>Azure Speech APIs, Deepgram, Function Calling.</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">Backend & APIs</p>
            <p>RESTful APIs, Microservices Architecture, Axios, Integration with C#.</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">Cloud Platforms</p>
            <p>Microsoft Azure, AWS, Azure Cognitive Services, Serverless Deployments</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">System Design & Operations</p>
            <p>Scalable and Distributed Systems, Observability, Live Site Operations, Performance Optimization</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">Frameworks & SDK Development</p>
            <p>Developer-Facing Frameworks, Reusable UI Components and Tooling Development.</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">DevOps & Tools</p>
            <p>Git, GitHub, GitHub Actions, Webpack, Vite.js, CI/CD Pipelines, Jira, Figma</p>
          </li>
          <li className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <p className="text-sm text-zinc-400 mb-2">Collaboration & Delivery</p>
            <p>End-to-End Feature Delivery, Prototyping, Iteration, Cross-Functional Collaboration.</p>
          </li>
        </ul>
      </Section>

      <Section id="experience" title="Professional Experience (4+ YEARS)">
        {/* Role 1 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3 className="text-xl font-semibold">Senior Frontend Developer | Feb 2024 - Present</h3>
            <p className="text-zinc-400">ScribeEMR Systems Pvt Ltd | Bangalore</p>
          </div>
          <ul className="mt-4 space-y-2 marker:text-white/40 list-disc pl-5">
            <li>Developed and optimized production-ready UI components using React.js and Tailwind CSS, improving development efficiency by 20%.</li>
            <li>Integrated AI-powered transcription with Deepgram and Azure Speech APIs, enabling real-time speech-to- text conversion with 95% accuracy.</li>
            <li>Implemented collaborative rich-text editor with Ckeditor, supporting multi-user editing and enhancing productivity by 30%.</li>
            <li>Built real-time collaboration features using Kafka and SignalR, ensuring seamless communication between doctors and scribes.</li>
            <li>Ensured HIPAA compliance by implementing role-based access control and secure workflows, reducing security risks by 50%.</li>
            <li>Enhanced application performance through lazy loading, modular architecture, and optimized audio streaming, reducing load time by 40%.</li>
          </ul>
          <p className="mt-3 text-zinc-400">Technologies Used: React.js, Tailwind CSS, Deepgram, Azure Speech APIs, Kafka, SignalR, Ckeditor</p>
        </div>

        {/* Role 2 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3 className="text-xl font-semibold">Frontend Developer | Aug 2021 - Nov 2023</h3>
            <p className="text-zinc-400">Tymtix Technologies | Bangalore</p>
          </div>
          <ul className="mt-4 space-y-2 marker:text-white/40 list-disc pl-5">
            <li>Built single-page applications with React.js and Angular, ensuring reusable and responsive components, reducing development time by 25%.</li>
            <li>Led development of a task management system with multimedia upload using React and REST APIs, improving user engagement by 15%.</li>
            <li>Created data visualization dashboards with Chart.js and dynamic tables, enabling analytics for 50+ key metrics.</li>
            <li>Collaborated with designers in Figma to deliver pixel-perfect, cross-browser UIs, improving design accuracy by 20%.</li>
            <li>Deployed Next.js and Tailwind CSS websites, optimizing performance and SEO, leading to a 30% increase in traffic.</li>
          </ul>
          <p className="mt-3 text-zinc-400">Technologies Used: React.js, Angular, REST APIs, Chart.js, Next.js, Tailwind CSS, Figma</p>
        </div>
      </Section>

      <Section id="projects" title="Projects">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h4 className="text-lg font-semibold">AI-Powered Transcription System | ScribeEMR Systems Pvt Ltd</h4>
            <p className="mt-2 text-zinc-100">Developed an AI-driven transcription system to convert real-time speech to text for medical documentation.</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-white/40">
              <li>Integrated Deepgram and Azure Speech APIs to achieve 95% transcription accuracy for real-time speech-to- text conversion.</li>
              <li>Optimized audio streaming to reduce latency by 40%, ensuring smooth real-time processing.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h4 className="text-lg font-semibold">Task Management System | Tymtix Technologies</h4>
            <p className="mt-2 text-zinc-100">Designed and implemented a task management system with multimedia upload and data visualization capabilities.</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-white/40">
              <li>Developed multimedia upload functionality using React and REST APIs, increasing user engagement by 15%.</li>
              <li>Created interactive dashboards with Chart.js, enabling analytics for 50+ key metrics.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="edu-contact" title="Education & Contact">
        <div className="grid md:grid-cols-3 gap-6" data-cursor="bubble">
          <div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-lg font-semibold">Bachelor of Engineering in Electronics & Communication Engineering | 2017 - 2021</p>
            <p className="text-zinc-300 mt-1">Government College of Engineering | Tirunelveli</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            <a href="tel:+918248377083" className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition flex items-center gap-3"><Phone className="h-5 w-5"/>+91 8248377083</a>
            <a href="mailto:athilak1999@gmail.com" className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition flex items-center gap-3"><Mail className="h-5 w-5"/>athilak1999@gmail.com</a>
            <a href="https://linkedin.com/in/athilakshmi-s" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition flex items-center gap-3"><Linkedin className="h-5 w-5"/>linkedin.com/in/athilakshmi-s</a>
            <a href="https://github.com/AthiLakshmiS" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition flex items-center gap-3"><Github className="h-5 w-5"/>github.com/AthiLakshmiS</a>
            <a href="/mnt/data/athilakshmiS.pdf" download className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition flex items-center gap-3">Download Résumé PDF</a>
          </div>
        </div>
      </Section>

      <footer className="py-10 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} Athi Lakshmi S — Senior Frontend Developer</p>
      </footer>
    </div>
  );
}
