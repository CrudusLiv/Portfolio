'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Moon, Sun, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'The Pilot', href: '#about' },
  { label: 'Systems', href: '#skills' },
  { label: 'Trajectory', href: '#trajectory' },
  { label: 'Missions', href: '#projects' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Contact', href: '#contact' },
]

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reserve the slot before mount so the navbar doesn't shift on hydration.
  if (!mounted) return <span className="block w-9 h-9" aria-hidden="true" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to star atlas (light) theme' : 'Switch to deep space (dark) theme'}
      title={isDark ? 'Star atlas' : 'Deep space'}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

export function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#hero"
            className="font-mono text-sm font-medium text-foreground tracking-tight"
          >
            Livnes
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.slice(1)
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`text-sm transition-colors duration-150 ${
                      activeSection === sectionId
                        ? 'text-accent font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
            <li>
              <ThemeToggle />
            </li>
          </ul>

          {/* Mobile hamburger + theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
            >
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden bg-background flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <span className="font-mono text-sm font-medium text-foreground">Livnes</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-bold text-foreground hover:text-accent transition-colors"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
