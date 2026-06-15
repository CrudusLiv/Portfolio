'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { bio } from '@/lib/data'

const NAV_LINKS = [
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="max-w-3xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a
          href="#hero"
          className="font-mono text-sm text-accent font-medium tracking-tight"
        >
          {bio.name}
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
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={activeSection === sectionId ? { textShadow: 'var(--glow-sm)' } : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
          {mounted && (
            <li className="hidden lg:block">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-accent transition-colors duration-150 p-1.5"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            className={`block h-0.5 w-5 bg-foreground transition-transform duration-200 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-foreground transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-foreground transition-transform duration-200 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scroll progress bar */}
      <div
        className="h-0.5 bg-accent transition-all duration-75"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 ? 'var(--glow-sm)' : 'none',
        }}
        aria-hidden="true"
      />
    </header>
  )
}
