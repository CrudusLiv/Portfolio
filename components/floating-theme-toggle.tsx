'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function FloatingThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="fixed bottom-5 left-5 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors shadow-[0_0_16px_-4px_color-mix(in_srgb,var(--accent)_40%,transparent)]"
      aria-label={isDark ? 'Switch to star atlas (light) theme' : 'Switch to deep space (dark) theme'}
      title={isDark ? 'Star atlas' : 'Deep space'}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
