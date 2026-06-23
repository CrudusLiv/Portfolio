'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export function SectionDots() {
  const [active, setActive] = useState('hero')
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Arrow-key navigation between sections
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return

      const idx = SECTIONS.reduce((best, s, i) => {
        const el = document.getElementById(s.id)
        if (!el) return best
        const top = Math.abs(el.getBoundingClientRect().top)
        return best.top === undefined || top < best.top ? { i, top } : best
      }, {} as { i?: number; top?: number }).i
      if (idx === undefined) return

      const nextIdx =
        e.key === 'ArrowDown'
          ? Math.min(idx + 1, SECTIONS.length - 1)
          : Math.max(idx - 1, 0)
      if (nextIdx === idx) return

      e.preventDefault()
      document.getElementById(SECTIONS[nextIdx].id)?.scrollIntoView({
        behavior: shouldReduce ? 'auto' : 'smooth',
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shouldReduce])

  if (shouldReduce) return null

  return (
    <nav
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          className="group relative flex items-center justify-end gap-2"
        >
          <span className="opacity-0 group-hover:opacity-100 text-xs font-mono text-muted-foreground transition-opacity duration-150 select-none pr-1 whitespace-nowrap">
            {label}
          </span>
          <motion.span
            className={`block w-2 h-2 rounded-full border flex-shrink-0 relative overflow-hidden transition-colors duration-200 ${
              active === id ? 'border-accent' : 'border-border'
            }`}
            animate={{ scale: active === id ? 1.4 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-accent"
              animate={{ opacity: active === id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.span>
        </a>
      ))}
    </nav>
  )
}
