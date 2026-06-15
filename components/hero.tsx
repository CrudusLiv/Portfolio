'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { bio } from '@/lib/data'
import { buttonVariants } from '@/components/ui/button'

function TypeWriter({ roles }: { roles: string[] }) {
  const shouldReduce = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (shouldReduce) {
      setDisplayed(roles[0])
      return
    }
    const role = roles[roleIndex]
    if (!deleting && displayed.length < role.length) {
      const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80)
      return () => clearTimeout(t)
    }
    if (!deleting && displayed.length === role.length) {
      const t = setTimeout(() => setDeleting(true), 2000)
      return () => clearTimeout(t)
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
      return () => clearTimeout(t)
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % roles.length)
    }
  }, [displayed, deleting, roleIndex, roles, shouldReduce])

  return (
    <span className="text-accent font-mono">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export function Hero() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-0"
    >
      <motion.div
        className="flex flex-col md:flex-row items-center gap-10 md:gap-16 px-4 md:px-6 max-w-5xl w-full"
        initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Left: Text content */}
        <div className="flex flex-col gap-3 md:flex-1">
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase">
            Hello, I&apos;m
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">
            {bio.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground h-8">
            <TypeWriter roles={bio.roles} />
          </p>
          <p className="text-muted-foreground text-base md:text-lg">
            {bio.tagline}
          </p>

          {/* Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-accent/30 to-transparent" />

          {/* About content */}
          <div className="space-y-3 text-muted-foreground text-base leading-relaxed">
            <p>{bio.aboutText}</p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies, contributing to
              open source, or writing about software development.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="#projects"
              data-glow
              className={buttonVariants({ variant: 'default', size: 'lg' })}
            >
              View Projects
            </a>
            <a
              href="#contact"
              data-glow
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Right: Avatar with offset border */}
        <div className="flex-shrink-0 relative w-56 md:w-64 lg:w-72 h-80">
          <div
            className="absolute inset-0 rounded-lg border-2 border-accent translate-x-3 translate-y-3"
            style={{ boxShadow: 'var(--glow-sm)' }}
          />
          <Image
            src={bio.avatarUrl}
            alt={`${bio.name} avatar`}
            fill
            data-glow
            className="rounded-lg object-cover relative z-10"
            priority
            unoptimized
          />
        </div>
      </motion.div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#skills"
          data-glow
          aria-label="Scroll to skills section"
          className="text-muted-foreground hover:text-accent transition-colors animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>
    </section>
  )
}
