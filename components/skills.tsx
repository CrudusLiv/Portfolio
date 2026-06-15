'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { skills } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { SectionWrapper } from '@/components/section-wrapper'

const SKILL_GROUPS: Array<{ label: string; items: string[] }> = [
  { label: 'Languages', items: skills.languages },
  { label: 'Frameworks', items: skills.frameworks },
  { label: 'Tools', items: skills.tools },
]

export function Skills() {
  const shouldReduce = useReducedMotion()

  return (
    <SectionWrapper id="skills">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
        <span className="font-mono text-accent text-xl">02.</span> Skills
      </h2>
      <div className="space-y-10">
        {SKILL_GROUPS.map(({ label, items }) => (
          <div key={label}>
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">
              {label}
            </h3>
            <div className="flex flex-wrap gap-3">
              {items.map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
                  whileInView={shouldReduce ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    data-glow
                    className="px-3 py-1.5 text-sm font-mono hover:border-accent/60 hover:text-accent hover:shadow-[var(--glow-sm)] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
