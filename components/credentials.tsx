'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Award, GraduationCap } from 'lucide-react'
import { certificates, education } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'

export function Credentials() {
  const shouldReduce = useReducedMotion()

  return (
    <SectionWrapper id="credentials">
      <TypewriterHeading
        text="Proof of orbit"
        eyebrow="credentials"
        className="text-3xl md:text-4xl font-bold mb-10 text-foreground"
      />

      <div className="grid md:grid-cols-2 gap-5">
        {/* Education */}
        <motion.div
          className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm"
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center rounded-md border border-accent/40 bg-secondary/60 text-accent shrink-0">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">Education</h3>
          </div>

          <div className="space-y-6">
            {education.map((entry) => (
              <div key={entry.institution} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-base font-semibold text-foreground">{entry.degree}</h4>
                  <span className="font-mono text-xs text-muted-foreground shrink-0">
                    {entry.dateRange}
                  </span>
                </div>
                <p className="text-base text-accent">{entry.institution}</p>
                <p className="text-sm text-muted-foreground">{entry.location}</p>
                <span className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full border border-glow/30 bg-secondary/60 text-sm font-mono text-foreground/90">
                  GPA {entry.gpa}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm"
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center rounded-md border border-glow/40 bg-secondary/60 text-glow shrink-0">
              <Award className="w-5 h-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
          </div>

          <ul className="space-y-4">
            {certificates.map((cert) => (
              <li
                key={cert.title}
                className="flex items-start gap-3 rounded-md border border-border bg-secondary/40 px-4 py-3"
              >
                <span className="text-glow mt-0.5 select-none" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <p className="text-base font-medium text-foreground">{cert.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{cert.issuer}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
