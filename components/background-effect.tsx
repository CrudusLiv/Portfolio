'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useReducedMotion } from 'framer-motion'

export function BackgroundEffect() {
  const { resolvedTheme } = useTheme()
  const shouldReduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Particle field for dark theme
  useEffect(() => {
    if (shouldReduce || resolvedTheme !== 'dark' || !mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      r: number
      opacity: number
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    let animationId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74,222,128,${p.opacity})`
        ctx.fill()

        particles.forEach((q) => {
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)

          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(74,222,128,${0.12 * (1 - dist / 80)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [resolvedTheme, shouldReduce, mounted])

  if (shouldReduce) return null

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />
  }

  if (resolvedTheme === 'dark') {
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      />
    )
  }

  // Aurora blobs for light theme
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.1); }
          66% { transform: translate(-10px, 20px) scale(0.95); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-15px, 15px) scale(1.08); }
          70% { transform: translate(10px, -20px) scale(0.96); }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          35% { transform: translate(25px, 10px) scale(0.95); }
          65% { transform: translate(-12px, -18px) scale(1.12); }
        }
      `}</style>
      <div
        className="absolute w-80 h-64 blur-3xl opacity-60 rounded-full"
        style={{
          background: 'rgba(186, 230, 253, 0.8)',
          top: '-100px',
          left: '-50px',
          animation: 'aurora-drift 9s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-72 h-56 blur-3xl opacity-50 rounded-full"
        style={{
          background: 'rgba(147, 197, 253, 0.6)',
          bottom: '-80px',
          right: '-100px',
          animation: 'aurora-drift-2 11s ease-in-out infinite',
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute w-64 h-44 blur-3xl opacity-40 rounded-full"
        style={{
          background: 'rgba(196, 181, 253, 0.4)',
          top: '100px',
          right: '50px',
          animation: 'aurora-drift-3 13s ease-in-out infinite',
          animationDelay: '-5s',
        }}
      />
    </div>
  )
}
