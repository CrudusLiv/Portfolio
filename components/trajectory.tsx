'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { experience } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'

interface Stop {
  title: string
  place: string
  dateRange: string
  location?: string
  details: string[]
}

// One flight line of work experience; education and certs live in Credentials.
const STOPS: Stop[] = experience.map((entry): Stop => ({
  title: entry.role,
  place: entry.company,
  dateRange: entry.dateRange,
  location: entry.location,
  details: entry.bullets,
}))

export function Trajectory() {
  const shouldReduce = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.75', 'end 0.45'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const lineScale = useTransform(progress, [0, 1], [0, 1])
  const cometTop = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <SectionWrapper id="trajectory">
      <TypewriterHeading text="Trajectory" eyebrow="flight log" className="text-3xl md:text-4xl font-bold mb-10 text-foreground" />

      <div ref={listRef} className="relative pl-8 md:pl-12">
        {/* Flight line */}
        <div className="absolute left-[7px] md:left-[11px] top-1 bottom-1 w-px bg-border" aria-hidden="true">
          {!shouldReduce && (
            <>
              <motion.div
                className="absolute inset-x-0 top-0 origin-top"
                style={{
                  height: '100%',
                  scaleY: lineScale,
                  background: 'linear-gradient(180deg, var(--accent), var(--glow))',
                }}
              />
              {/* Comet riding the line */}
              <motion.span
                className="absolute -left-[3.5px] w-2 h-2 rounded-full bg-glow shadow-[0_0_10px_3px_color-mix(in_srgb,var(--glow)_60%,transparent)]"
                style={{ top: cometTop }}
              />
            </>
          )}
        </div>

        <div className="space-y-10">
          {STOPS.map((stop, i) => (
            <motion.article
              key={`${stop.place}-${i}`}
              className="relative"
              initial={shouldReduce ? {} : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
            >
              {/* Waypoint marker */}
              <span
                className="absolute -left-8 md:-left-12 top-1.5 flex items-center justify-center w-4 h-4 -translate-x-[1px] md:translate-x-[3px]"
                aria-hidden="true"
              >
                <span className="w-2.5 h-2.5 rounded-full border border-accent bg-background shadow-[0_0_8px_1px_color-mix(in_srgb,var(--accent)_40%,transparent)]" />
              </span>

              <div className="bg-card/80 border border-border rounded-lg p-5 space-y-3 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-glow select-none">
                    mission
                  </span>
                  <span className="font-mono text-sm text-muted-foreground shrink-0">{stop.dateRange}</span>
                </div>

                <h3 className="text-lg font-semibold text-foreground">{stop.title}</h3>

                <p className="text-base text-accent font-medium">
                  {stop.place}
                  {stop.location && (
                    <span className="text-muted-foreground font-normal"> · {stop.location}</span>
                  )}
                </p>

                <ul className="space-y-1.5">
                  {stop.details.map((detail, j) => (
                    <li key={j} className="text-muted-foreground text-base flex gap-3 leading-relaxed">
                      <span className="text-accent/60 text-sm mt-1 shrink-0">▸</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
