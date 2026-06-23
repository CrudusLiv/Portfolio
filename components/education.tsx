'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { education, certificates } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'

export function Education() {
  const shouldReduce = useReducedMotion()

  return (
    <SectionWrapper id="education">
      <TypewriterHeading text="Education" className="text-2xl font-bold mb-10 text-foreground" />
      <div className="space-y-4">
        {/* Education entries */}
        {education.map((entry, i) => (
          <motion.div
            key={i}
            className="bg-card border border-border rounded-lg p-5 space-y-1.5"
            initial={shouldReduce ? {} : { opacity: 0, y: 24, filter: 'blur(4px)' }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h3 className="font-semibold text-foreground">{entry.institution}</h3>
              <span className="font-mono text-xs text-muted-foreground shrink-0">{entry.dateRange}</span>
            </div>
            <p className="text-sm text-accent font-medium">{entry.degree}</p>
            <p className="text-sm text-muted-foreground">
              {entry.location}
              <span className="ml-4 font-mono">GPA {entry.gpa}</span>
            </p>
          </motion.div>
        ))}

        {/* Certificates card */}
        {certificates.length > 0 && (
          <motion.div
            className="bg-card border border-border rounded-lg p-5 space-y-3"
            initial={shouldReduce ? {} : { opacity: 0, y: 24, filter: 'blur(4px)' }}
            whileInView={shouldReduce ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: education.length * 0.1 }}
          >
            <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Certificates
            </h3>
            <ul className="space-y-2">
              {certificates.map((cert, i) => (
                <motion.li
                  key={i}
                  className="flex items-baseline gap-3 text-sm"
                  initial={shouldReduce ? {} : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                >
                  <span className="text-accent/50 text-xs shrink-0">—</span>
                  <span className="text-foreground font-medium">{cert.title}</span>
                  <span className="text-muted-foreground">{cert.issuer}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  )
}
