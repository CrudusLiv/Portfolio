export interface Bio {
  name: string
  tagline: string
  roles: string[]
  aboutText: string
  avatarUrl: string
  username: string
  resumeUrl: string
}

export interface SkillGroup {
  languages: string[]
  frameworks: string[]
  tools: string[]
}

export interface ExperienceEntry {
  company: string
  role: string
  dateRange: string
  location: string
  bullets: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  dateRange: string
  location: string
  gpa: string
}

export interface Certificate {
  issuer: string
  title: string
}

export interface Social {
  github: string
  linkedin: string
  email: string
}

export interface About {
  /** Story paragraphs for The Pilot section. */
  story: string[]
  /** Topics currently being learned/explored. */
  learning: string[]
  /** Short availability line shown in the hero + about. */
  availability: string
}

export interface CaseStudy {
  /** Repo name on GitHub — also used as the anchor slug. */
  name: string
  title: string
  tagline: string
  problem: string
  role: string
  stack: string[]
  highlights: string[]
  outcome: string
  repoUrl: string
  demoUrl?: string
}

export const bio: Bio = {
  name: 'Livnes Ganesan',
  tagline: 'Software Developer & IT Student',
  roles: ['Software Developer', 'Full-Stack Developer', 'IT Student', 'Problem Solver'],
  aboutText:
    'Information Technology student building across the entire stack: databases, APIs, web apps, and scripting. Skilled in solving technical challenges and delivering efficient, readable solutions.',
  avatarUrl: '/avatar.png',
  username: 'CrudusLiv',
  resumeUrl: '/resume.pdf',
}

export const skills: SkillGroup = {
  languages: ['TypeScript', 'JavaScript', 'SQL', 'C#', 'Java', 'Kotlin', 'PHP'],
  frameworks: ['React', 'Angular', 'Next.js', 'Node.js', 'Vite', 'Tailwind CSS'],
  tools: ['Docker', 'Git', 'MongoDB', 'GitHub Actions'],
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Biztory Cloud',
    role: 'FrontEnd Developer Intern',
    dateRange: 'May 2025 – Jul 2025',
    location: 'Puchong, Malaysia',
    bullets: [
      'Performed enhancement tasks to add more value to the website for a smoother user experience.',
      'Utilized version control (Git) for collaborative development and deployment.',
    ],
  },
]

export const education: EducationEntry[] = [
  {
    institution: 'HELP University',
    degree: 'Diploma in Information & Technology',
    dateRange: '2023 – Present',
    location: 'Subang 2, Malaysia',
    gpa: '3.56',
  },
]

export const certificates: Certificate[] = [
  { issuer: 'Oracle Academy', title: 'Database Programming' },
  { issuer: 'Oracle Academy', title: 'Database Design' },
]

export const social: Social = {
  github: 'https://github.com/CrudusLiv',
  linkedin: 'https://www.linkedin.com/in/livnes/',
  email: 'mailto:livnes.ganes@gmail.com',
}

export const about: About = {
  story: [
    'I’m an Information Technology student at HELP University and a software developer who learns by shipping. Most of what I know about building software came from making tools I actually use every day: a voice assistant that runs on my desktop, a kanban board tuned for how my brain works, and a study planner that fixes my schedule when life breaks it.',
    'I spent mid-2025 as a frontend intern at Biztory Cloud, working on real production code with Git-based team workflows. Since then I’ve been going deeper across the stack: modern Angular with signals and zoneless change detection, full-stack TypeScript, API and data modeling, and wiring LLMs into apps in ways that are useful rather than decorative.',
    'What I care about: software that feels fast, code that the next person can read, and solving the actual problem instead of the impressive-sounding one.',
  ],
  learning: ['AI-assisted apps', 'Angular signals & zoneless', 'Local-first tooling', 'Speech interfaces'],
  availability: 'Open to internships & junior software developer roles',
}

export const caseStudies: CaseStudy[] = [
  {
    name: 'Vesper',
    title: 'Vesper',
    tagline: 'A local-first voice assistant living on my desktop',
    problem:
      'Voice assistants are cloud-bound and generic. I wanted one that runs locally, knows my calendar, email and GitHub, and can turn dropped lecture files into organized notes, all without sending my life to a server.',
    role: 'Solo developer: architecture, speech pipeline, UI, Windows packaging',
    stack: ['Python', 'FastAPI', 'faster-whisper', 'Three.js', 'edge-tts', 'PyInstaller'],
    highlights: [
      'Wake-word and push-to-talk speech pipeline: local Whisper transcription, LLM routing, spoken replies',
      'LLM backend auto-detection: local Ollama or LM Studio, Anthropic API, or the claude CLI, with zero required API keys',
      'Three.js orb UI with a galaxy HUD: parallax starfield, orbiting status indicators, dockable panels',
      'Packaged as a single windowed Windows executable with models downloaded on first run',
    ],
    outcome:
      'A daily-driver assistant that works fully offline for speech, and my deepest systems project to date: async audio I/O, process packaging, and multi-backend LLM plumbing.',
    repoUrl: 'https://github.com/CrudusLiv/Vesper',
  },
  {
    name: 'TaskZen',
    title: 'TaskZen',
    tagline: 'An ADHD-friendly productivity workspace',
    problem:
      'Generic to-do apps assume steady focus and constant energy. ADHD brains need capture-first inboxes, energy tracking, guided routines and gentle nudges, not another list that induces guilt.',
    role: 'Solo developer: product design, state architecture, PWA',
    stack: ['Angular 20', 'NgRx', 'Firebase', 'TypeScript', 'PWA', 'Playwright'],
    highlights: [
      'Zoneless Angular 20 with standalone components and signals, the current edge of the framework',
      'NgRx feature slices for every domain: inbox, focus timer, energy log, routines, insights',
      'Works fully offline by default; Firestore sync and auth are opt-in',
      'Pomodoro SVG ring timer, energy trend charts, and a rule-based AI coach',
    ],
    outcome:
      'A production-grade PWA that demonstrates modern Angular architecture end to end: installable, offline-capable, and tested with Playwright.',
    repoUrl: 'https://github.com/CrudusLiv/TaskZen',
  },
  {
    name: 'StudyFlow',
    title: 'StudyFlow',
    tagline: 'An AI study planner that repairs its own schedule',
    problem:
      'Static study plans die on first contact with reality: one missed session and the whole week is obsolete. Students need a planner that redistributes remaining time automatically.',
    role: 'Solo developer: full stack, from schema design to UI',
    stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'MongoDB'],
    highlights: [
      'Dynamic Time Redistribution: missed or shifted tasks trigger a priority-weighted rebalance of the remaining schedule',
      'AI-assisted schedule generation via an external AI API',
      'Progress tracking with visual feedback across subjects and deadlines',
      'Full-stack TypeScript: React/Vite frontend against a Node/Express/MongoDB API',
    ],
    outcome:
      'My first complete full-stack product, and the project that taught me data modeling, API design, and why scheduling algorithms are harder than they look.',
    repoUrl: 'https://github.com/CrudusLiv/StudyFlow',
  },
]
