'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from 'framer-motion'

// Distances loosely follow the real solar system — the journey's waypoints.
const SECTIONS = [
  { id: 'hero', label: 'Launch', au: 0 },
  { id: 'about', label: 'The Pilot', au: 0.7 },
  { id: 'skills', label: 'Systems', au: 1.0 },
  { id: 'trajectory', label: 'Trajectory', au: 1.5 },
  { id: 'projects', label: 'Missions', au: 5.2 },
  { id: 'credentials', label: 'Credentials', au: 9.5 },
  { id: 'contact', label: 'Transmission', au: 30.1 },
]

export function JourneyHud() {
  const [active, setActive] = useState('hero')
  const shouldReduce = useReducedMotion()

  const activeIndex = Math.max(0, SECTIONS.findIndex((s) => s.id === active))
  const auSpring = useSpring(0, { stiffness: 60, damping: 20 })
  const auText = useTransform(auSpring, (v) => v.toFixed(1))

  useEffect(() => {
    auSpring.set(SECTIONS[activeIndex].au)
  }, [activeIndex, auSpring])

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
    <>
      {/* Flight-path rail */}
      <nav
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center"
        aria-label="Section navigation"
      >
        {SECTIONS.map(({ id, label }, i) => (
          <div key={id} className="flex flex-col items-center">
            {i > 0 && (
              <span
                className={`w-px h-7 transition-colors duration-500 ${
                  i <= activeIndex ? 'bg-accent/50' : 'bg-border'
                }`}
              />
            )}
            <a
              href={`#${id}`}
              aria-label={label}
              className="group relative flex items-center justify-end gap-2"
            >
              <span className="absolute right-6 opacity-0 group-hover:opacity-100 text-xs font-mono text-muted-foreground transition-opacity duration-150 select-none whitespace-nowrap">
                {label}
              </span>
              <span className="relative flex items-center justify-center w-4 h-4">
                <motion.span
                  className="absolute inset-0 rounded-full border border-accent/60"
                  animate={{
                    scale: active === id ? 1 : 0.4,
                    opacity: active === id ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className={`block w-2 h-2 rounded-full border transition-colors duration-200 ${
                    active === id
                      ? 'border-accent bg-accent shadow-[0_0_8px_2px_color-mix(in_srgb,var(--accent)_50%,transparent)]'
                      : i < activeIndex
                        ? 'border-accent/50 bg-accent/30'
                        : 'border-border bg-transparent'
                  }`}
                  animate={{ scale: active === id ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              </span>
            </a>
          </div>
        ))}
      </nav>

      {/* Telemetry readout */}
      <div
        className="fixed bottom-5 right-5 z-40 hidden md:flex items-baseline gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground select-none"
        aria-hidden="true"
      >
        <span className="text-accent">▸</span>
        <motion.span className="text-foreground tabular-nums">{auText}</motion.span>
        <span>AU</span>
        <span className="text-border">·</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-accent"
          >
            {SECTIONS[activeIndex].label}
          </motion.span>
        </AnimatePresence>
        <span className="text-border">·</span>
        <span className="tabular-nums">
          {String(activeIndex + 1).padStart(2, '0')}/{String(SECTIONS.length).padStart(2, '0')}
        </span>
      </div>
    </>
  )
}
