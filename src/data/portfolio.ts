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
  name: 'Athi Lakshmi S',
  title: 'Senior Software Developer',
  location: 'Bangalore, India',
  email: 'athilak1999@gmail.com',
  phone: '+91 8248377083',
  github: 'https://github.com/Athilakshmi07',
  linkedin: 'https://linkedin.com/in/athilakshmi-s',
  resume: `${import.meta.env.BASE_URL}AthiLakshmi.pdf`,
  summary:
    'Results-driven Software Engineer with 4+ years of experience designing scalable, high-performance web applications. Expert in React.js, TypeScript, and micro-frontend architecture with a strong focus on HIPAA-compliant workflows, event-driven systems, and clean code principles.',
} as const;

export const stats: Stat[] = [
  { label: 'Experience', value: '4+ Yrs' },
  { label: 'AI Accuracy', value: '95%' },
  { label: 'Load Time ↓', value: '40%' },
  { label: 'Dev Speed ↑', value: '25%' },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend Ecosystem',
    color: 'indigo',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Angular', 'MUI', 'Tailwind CSS', 'Redux', 'React Hook Form', 'Storybook'],
  },
  {
    label: 'AI & Streaming',
    color: 'cyan',
    skills: ['Deepgram', 'Azure Speech', 'WebRTC', 'SignalR', 'Media Recorder', 'Real-time AI'],
  },
  {
    label: 'Back-End',
    color: 'purple',
    skills: ['Node.js', 'REST APIs', 'Kafka', 'RBAC', 'Event-Driven'],
  },
  {
    label: 'Standards & Tools',
    color: 'emerald',
    skills: ['HIPAA', 'WCAG 2.1', 'CI/CD', 'Docker', 'Figma', 'Git'],
  },
];

export const experience: ExperienceItem[] = [
  {
    company: 'ScribeEMR Systems Pvt Ltd',
    role: 'Senior Frontend Developer',
    period: 'Feb 2024 – Present',
    location: 'Bangalore, IN',
    highlights: [
      'Architected HIPAA-compliant secure workflows and RBAC systems for medical documentation.',
      'Integrated AI transcription with Deepgram and Azure APIs, achieving 95% accuracy.',
      'Optimized audio streaming and modular architecture, reducing load times by 40%.',
      'Developed production-ready UI components using TypeScript, MUI, and React Hook Form.',
    ],
    tags: ['React', 'TypeScript', 'HIPAA', 'AI/ML'],
  },
  {
    company: 'Tymtix Technologies',
    role: 'Software Developer',
    period: 'Aug 2021 – Nov 2023',
    location: 'Bangalore, IN',
    highlights: [
      'Built responsive SPAs reducing development time by 25% through reusable component libraries.',
      'Led full-stack debugging across web servers to resolve complex production issues.',
      'Collaborated with designers in Figma to deliver pixel-perfect UIs with 20% better accuracy.',
      'Deployed Next.js and Tailwind CSS sites while managing CI/CD pipelines and SEO.',
    ],
    tags: ['Next.js', 'Node.js', 'CI/CD', 'SEO'],
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
    desc: 'Workplace efficiency platform featuring multimedia uploads, collaborative workflows, real-time notifications, and a reusable component library that cut development time by 25%.',
    category: 'Productivity',
    accent: 'cyan',
  },
];
