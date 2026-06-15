export interface Bio {
  name: string
  tagline: string
  roles: string[]
  aboutText: string
  avatarUrl: string
  username: string
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

export const bio: Bio = {
  name: 'Livnes Ganesan',
  tagline: 'Frontend Developer & IT Student',
  roles: ['Frontend Developer', 'IT Student', 'Problem Solver'],
  aboutText:
    'Dedicated Information Technology student with a strong foundation in databases, analytical techniques, web development, and scripting. Skilled in enhancing user experiences, solving technical challenges, and delivering efficient solutions.',
  avatarUrl: '/avatar.png',
  username: 'CrudusLiv',
}

export const skills: SkillGroup = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'C#', 'Kotlin', 'Java', 'PHP'],
  frameworks: ['React', 'Angular', 'Next.js', 'Node.js', 'Vite', 'Responsive Design'],
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
  linkedin: 'https://linkedin.com/in/your-linkedin',
  email: 'mailto:livnes.saranyaa@gmail.com',
}
