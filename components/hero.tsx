'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { about, bio } from '@/lib/data'
import { buttonVariants } from '@/components/ui/button'
import { SolarSystem } from '@/components/space/solar-system'

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

function useRoleTypewriter(roles: string[], enabled: boolean) {
  const [displayText, setDisplayText] = useState(roles[0])
  const [roleIndex, setRoleIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('pausing')

  useEffect(() => {
    if (!enabled) return
    const role = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (displayText.length < role.length) {
        timeout = setTimeout(() => setDisplayText(role.slice(0, displayText.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 2000)
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('erasing'), 100)
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 30)
      } else {
        const next = (roleIndex + 1) % roles.length
        setRoleIndex(next)
        setDisplayText('')
        setPhase('typing')
      }
    }
    return () => clearTimeout(timeout)
  }, [displayText, phase, roleIndex, roles, enabled])

  return displayText
}

const longestRole = bio.roles.reduce((a, b) => (b.length > a.length ? b : a), '')

export function Hero() {
  const shouldReduce = useReducedMotion()
  const displayRole = useRoleTypewriter(bio.roles, !shouldReduce)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <SolarSystem />
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
          {/* Staggered text block */}
          <motion.div
            className="flex flex-col gap-5 flex-1"
            variants={shouldReduce ? {} : container}
            initial="hidden"
            animate="show"
          >
            <motion.span
              variants={shouldReduce ? {} : item}
              className="inline-flex self-start items-center px-3 py-1 rounded-full border border-border text-xs font-mono text-muted-foreground tracking-widest uppercase"
            >
              <span className="relative inline-flex whitespace-nowrap">
                {/* Invisible sizer reserves the width of the longest role so the badge never reflows */}
                <span aria-hidden="true" className="invisible">
                  {longestRole}
                </span>
                <span className="absolute inset-y-0 left-0 flex items-center">
                  {shouldReduce ? bio.roles[0] : displayRole}
                  {!shouldReduce && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-px h-3 bg-current ml-1"
                    />
                  )}
                </span>
              </span>
            </motion.span>

            <motion.div variants={shouldReduce ? {} : item} className="space-y-1">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-foreground leading-none">
                Livnes
              </h1>
              <p className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-muted-foreground leading-none">
                Ganesan
              </p>
            </motion.div>

            <motion.p
              variants={shouldReduce ? {} : item}
              className="text-base md:text-lg text-muted-foreground max-w-sm leading-relaxed mt-1"
            >
              {bio.aboutText}
            </motion.p>

            <motion.div
              variants={shouldReduce ? {} : item}
              className="flex flex-wrap gap-3 mt-2"
            >
              <a href="#projects" className={buttonVariants({ variant: 'default', size: 'lg' })}>
                View Projects
              </a>
              <a href="#contact" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Get in touch
              </a>
              <a
                href={bio.resumeUrl}
                download
                className={buttonVariants({ variant: 'ghost', size: 'lg' })}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Resume
              </a>
            </motion.div>

            <motion.span
              variants={shouldReduce ? {} : item}
              className="inline-flex self-start items-center gap-2 mt-1 text-xs font-mono text-muted-foreground"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-glow opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-glow" />
              </span>
              {about.availability}
            </motion.span>
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={shouldReduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <a
          href="#skills"
          aria-label="Scroll to skills"
          className="text-muted-foreground/40 hover:text-accent transition-colors block animate-bounce"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
