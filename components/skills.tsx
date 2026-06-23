'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  SiJavascript, SiTypescript, SiPython, SiDotnet, SiKotlin, SiPhp,
  SiReact, SiAngular, SiNextdotjs, SiNodedotjs, SiVite, SiTailwindcss,
  SiDocker, SiGit, SiMongodb, SiGithubactions,
} from 'react-icons/si'
import { FaJava, FaDatabase } from 'react-icons/fa'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'
import { skills } from '@/lib/data'

type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>

const ICON_MAP: Record<string, { Icon: IconComponent; color: string }> = {
  JavaScript:      { Icon: SiJavascript,    color: '#F7DF1E' },
  TypeScript:      { Icon: SiTypescript,    color: '#3178C6' },
  Python:          { Icon: SiPython,        color: '#3776AB' },
  SQL:             { Icon: FaDatabase,      color: '#A8A29E' },
  'C#':            { Icon: SiDotnet,        color: '#512BD4' },
  Kotlin:          { Icon: SiKotlin,        color: '#7F52FF' },
  Java:            { Icon: FaJava,          color: '#ED8B00' },
  PHP:             { Icon: SiPhp,           color: '#8892BF' },
  React:           { Icon: SiReact,         color: '#61DAFB' },
  Angular:         { Icon: SiAngular,       color: '#DD0031' },
  'Next.js':       { Icon: SiNextdotjs,     color: 'currentColor' },
  'Node.js':       { Icon: SiNodedotjs,     color: '#339933' },
  Vite:            { Icon: SiVite,          color: '#646CFF' },
  'Tailwind CSS':  { Icon: SiTailwindcss,   color: '#06B6D4' },
  Docker:          { Icon: SiDocker,        color: '#2496ED' },
  Git:             { Icon: SiGit,           color: '#F05032' },
  MongoDB:         { Icon: SiMongodb,       color: '#47A248' },
  'GitHub Actions':{ Icon: SiGithubactions, color: '#2088FF' },
}

const CATEGORIES = [
  { label: 'Languages',          items: skills.languages },
  { label: 'Frameworks & Libs',  items: skills.frameworks },
  { label: 'Tools',              items: skills.tools },
]

const ALL_SKILLS = [...skills.languages, ...skills.frameworks, ...skills.tools]

function MarqueeRow({ items, trackClass, delay = 0 }: { items: string[]; trackClass: string; delay?: number }) {
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden marquee-wrap"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className={`flex gap-8 ${trackClass}`} style={{ animationDelay: `${delay}s` }}>
        {doubled.map((item, i) => {
          const entry = ICON_MAP[item]
          return (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground shrink-0">
              {entry && (
                <entry.Icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: entry.color === 'currentColor' ? undefined : entry.color }}
                />
              )}
              {!entry && <span className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />}
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function SkillCard({ name, index }: { name: string; index: number }) {
  const shouldReduce = useReducedMotion()
  const entry = ICON_MAP[name]

  return (
    <motion.div
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors duration-200 group cursor-default"
      initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={shouldReduce ? {} : { y: -2 }}
    >
      {entry ? (
        <entry.Icon
          className="w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ color: entry.color === 'currentColor' ? undefined : entry.color }}
        />
      ) : (
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
        </span>
      )}
      <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
        {name}
      </span>
    </motion.div>
  )
}

function CategorySection({ label, items, sectionIndex }: { label: string; items: string[]; sectionIndex: number }) {
  const shouldReduce = useReducedMotion()

  return (
    <div>
      <motion.h3
        className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4"
        initial={shouldReduce ? {} : { opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: sectionIndex * 0.1 }}
      >
        {label}
      </motion.h3>
      <div className="flex flex-wrap gap-2.5">
        {items.map((name, i) => (
          <SkillCard key={name} name={name} index={i + sectionIndex * 3} />
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const shouldReduce = useReducedMotion()

  return (
    <SectionWrapper id="skills">
      <TypewriterHeading text="Skills" className="text-2xl font-bold mb-10 text-foreground" />

      {/* Marquee overview */}
      <div className="space-y-4 -mx-6 md:-mx-8 mb-14">
        <MarqueeRow items={ALL_SKILLS} trackClass="marquee-track" />
        <MarqueeRow items={[...ALL_SKILLS].reverse()} trackClass="marquee-track-fast" delay={-8} />
      </div>

      {/* Categorized sections */}
      <div className="space-y-10">
        {CATEGORIES.map(({ label, items }, i) => (
          <CategorySection key={label} label={label} items={items} sectionIndex={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
