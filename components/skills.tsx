'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'
import { skills } from '@/lib/data'

interface SkillGroupDef {
  label: string
  blurb: string
  items: string[]
  /** CSS custom property that colors this group's star + chip accents. */
  colorVar: string
}

const GROUPS: SkillGroupDef[] = [
  {
    label: 'Languages',
    blurb: 'What I write in',
    items: skills.languages,
    colorVar: 'var(--accent)',
  },
  {
    label: 'Frameworks & Libraries',
    blurb: 'What I build with',
    items: skills.frameworks,
    colorVar: 'var(--glow)',
  },
  {
    label: 'Tools & Platforms',
    blurb: 'What I ship with',
    items: skills.tools,
    colorVar: 'var(--solar)',
  },
]

function SkillPanel({ group, index }: { group: SkillGroupDef; index: number }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm flex flex-col gap-5"
      style={{ borderTopColor: `color-mix(in srgb, ${group.colorVar} 55%, transparent)`, borderTopWidth: 2 }}
      initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            background: group.colorVar,
            boxShadow: `0 0 10px 2px color-mix(in srgb, ${group.colorVar} 55%, transparent)`,
          }}
        />
        <div>
          <h3 className="text-base font-semibold text-foreground leading-tight">{group.label}</h3>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">{group.blurb}</p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2.5">
        {group.items.map((name) => (
          <li
            key={name}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-border bg-secondary/60 text-sm font-medium text-foreground/90 transition-colors hover:border-accent/50"
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full shrink-0 opacity-80"
              style={{ background: group.colorVar }}
            />
            {name}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function Skills() {
  return (
    <SectionWrapper id="skills">
      <TypewriterHeading
        text="What I bring"
        eyebrow="systems"
        className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
      />
      <p className="text-muted-foreground text-base leading-relaxed max-w-lg mb-10">
        The stack I work across, grouped by what each part does. Color marks the category.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GROUPS.map((group, i) => (
          <SkillPanel key={group.label} group={group} index={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
