'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { experience } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'

export function Experience() {
  const shouldReduce = useReducedMotion()

  return (
    <SectionWrapper id="experience">
      <TypewriterHeading text="Experience" className="text-2xl font-bold mb-10 text-foreground" />
      <div className="space-y-4">
        {experience.map((entry, i) => (
          <motion.div
            key={i}
            className="bg-card border border-border rounded-lg p-5 space-y-3"
            initial={shouldReduce ? {} : { opacity: 0, y: 24, filter: 'blur(4px)' }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
          >
            {/* Role + Date */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h3 className="font-semibold text-foreground">{entry.role}</h3>
              <span className="font-mono text-xs text-muted-foreground shrink-0">{entry.dateRange}</span>
            </div>

            {/* Company + Location */}
            <p className="text-sm text-accent font-medium">
              {entry.company}
              {entry.location && (
                <span className="text-muted-foreground font-normal"> · {entry.location}</span>
              )}
            </p>

            {/* Bullets */}
            <ul className="space-y-1.5">
              {entry.bullets.map((bullet, j) => (
                <li key={j} className="text-muted-foreground text-sm flex gap-3 leading-relaxed">
                  <span className="text-accent/50 text-xs mt-0.5 shrink-0">—</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
