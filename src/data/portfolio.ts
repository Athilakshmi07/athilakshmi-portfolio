export interface Stat { label: string; value: string }

export interface SkillGroup {
  label: string;
  color: 'indigo' | 'cyan' | 'purple' | 'emerald';
  skills: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  tags: string[];
}

export interface ProjectItem {
  title: string;
  client: string;
  tech: string[];
  desc: string;
  category: string;
  accent: 'indigo' | 'cyan';
}

export const userData = {
  name: 'Athi Lakshmi',
  title: 'Senior Software Engineer',
  location: 'Bengaluru, India',
  email: 'athilak1999@gmail.com',
  phone: '+91 8248377083',
  github: 'https://github.com/Athilakshmi07',
  linkedin: 'https://linkedin.com/in/athilakshmi-s',
  resume: `${import.meta.env.BASE_URL}AthiLakshmi.pdf`,
  summary:
    'Results-driven Senior Software Engineer with over 5 years of professional experience specializing in modern frontend development, React ecosystems, and micro-frontend architectures. Proven track record of building production-grade React.js and cross-platform applications, utilizing Module Federation for autonomous UI deployment, and optimizing Web Performance.',
} as const;

export const stats: Stat[] = [
  { label: 'Experience', value: '5+ Yrs' },
  { label: 'AI Accuracy', value: '95%' },
  { label: 'Load Time ↓', value: '40%' },
  { label: 'Dev Efficiency ↑', value: '20%' },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend Ecosystem',
    color: 'indigo',
    skills: ['React.js', 'Next.js', 'Remix', 'Angular', 'Single-SPA', 'JavaScript (ES6+)', 'TypeScript', 'HTML5/CSS3'],
  },
  {
    label: 'Architecture & APIs',
    color: 'cyan',
    skills: ['Micro Frontends', 'Module Federation', 'RESTful APIs', 'GraphQL', 'SignalR', 'WebRTC (Streaming)'],
  },
  {
    label: 'Tooling & DevOps',
    color: 'purple',
    skills: ['Vite', 'Webpack 5', 'Node.js', 'AWS (S3/CloudFront/Amplify)', 'Docker', 'GitHub Actions', 'CI/CD'],
  },
  {
    label: 'Testing & UI/UX',
    color: 'emerald',
    skills: ['Jest', 'React Testing Library', 'MUI', 'Tailwind CSS', 'Storybook', 'Figma', 'React Hook Form'],
  },
];

export const experience: ExperienceItem[] = [
  {
    company: 'ScribeEMR Systems Pvt Ltd',
    role: 'Senior Frontend Developer',
    period: 'Feb 2024 – Present',
    location: 'Bangalore, India',
    highlights: [
      'Architected and scaling a scalable Micro Frontend architecture utilizing Module Federation (Webpack 5) to enable multiple independent teams to build, test, and autonomously deploy UI modules.',
      'Developed and optimized production-ready UI components using TypeScript, MUI, and React Hook Form, improving development efficiency by 20%.',
      'Integrated AI-powered transcription services with Deepgram and Azure Speech APIs, achieving 95% accuracy while managing real-time data streaming.',
      'Demonstrated strong debugging skills to optimize audio streaming protocols, reducing initial application load times by 40%.',
    ],
    tags: ['React', 'TypeScript', 'Micro Frontends', 'Module Federation', 'HIPAA', 'AI/ML'],
  },
  {
    company: 'Tymtix Technologies',
    role: 'Software Developer',
    period: 'Aug 2021 – Nov 2023',
    location: 'Bangalore, India',
    highlights: [
      'Built scalable, high-performance single-page applications with React.js and Angular, reducing development cycles by 25%.',
      'Led the development of a secure task management system featuring multimedia upload handling utilizing Node.js and optimized REST APIs.',
      'Collaborated directly with product designers in Figma to translate requirements into polished, pixel-perfect, cross-browser compatible UIs, improving design delivery accuracy by 20%.',
      'Deployed Next.js and Tailwind CSS websites while establishing automated CI/CD workflows and SEO metrics.',
    ],
    tags: ['Next.js', 'Angular', 'Node.js', 'Tailwind CSS', 'CI/CD', 'Figma'],
  },
];

export const projects: ProjectItem[] = [
  {
    title: 'AI-Powered Transcription System',
    client: 'ScribeEMR Systems',
    tech: ['React', 'TypeScript', 'Deepgram', 'Azure API', 'WebRTC'],
    desc: 'Real-time speech-to-text conversion for medical documentation with 95% accuracy and sub-200ms latency. Built with HIPAA-compliant data pipelines and role-based access controls.',
    category: 'Healthcare AI',
    accent: 'indigo',
  },
  {
    title: 'Task Management Suite',
    client: 'Tymtix Technologies',
    tech: ['Node.js', 'React', 'REST APIs', 'Media Recorder'],
    desc: 'Workplace efficiency platform featuring multimedia uploads, collaborative workflows, real-time notifications, and a reusable component library that cut development cycles by 25%.',
    category: 'Productivity',
    accent: 'cyan',
  },
];
