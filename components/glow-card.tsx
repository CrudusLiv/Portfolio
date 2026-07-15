'use client'

import { useRef } from 'react'

export function GlowCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%')
    el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%')
  }

  return (
    <div ref={ref} className={`glow-card ${className}`} onMouseMove={handleMouseMove}>
      {children}
    </div>
  )
}
