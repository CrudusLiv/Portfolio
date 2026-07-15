'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import {
  createStarLayers, clampDpr, hexToRgb, mulberry32, STARFIELD_SEED,
  type StarLayer,
} from '@/lib/space'

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

/** Soft round glow sprite, rendered once and stamped for bright stars. */
function makeGlowSprite(rgb: string): HTMLCanvasElement {
  const sprite = document.createElement('canvas')
  sprite.width = 32
  sprite.height = 32
  const ctx = sprite.getContext('2d')!
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, `rgba(${rgb}, 1)`)
  g.addColorStop(0.35, `rgba(${rgb}, 0.35)`)
  g.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 32, 32)
  return sprite
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallMq = window.matchMedia('(max-width: 768px)')

    let layers: StarLayer[] = []
    let width = 0
    let height = 0
    let rafId = 0
    let running = false
    let start = performance.now()
    let shootingStar: ShootingStar | null = null
    let nextShootAt = 8000 + Math.random() * 6000

    const starColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#E6EAF7'
    const starRgb = hexToRgb(starColor)
    const sprite = makeGlowSprite(starRgb)

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = clampDpr(window.devicePixelRatio || 1, smallMq.matches)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      layers = createStarLayers(width, height, mulberry32(STARFIELD_SEED))
    }

    function drawFrame(t: number) {
      const c = ctx!
      c.clearRect(0, 0, width, height)
      const scrollY = window.scrollY

      for (const layer of layers) {
        const offsetY = scrollY * layer.parallax
        const offsetX = (t * layer.drift) % width
        for (const star of layer.stars) {
          const x = (star.x * width + offsetX + width) % width
          const y = (star.y * height - (offsetY % height) + height) % height
          const alpha = star.baseAlpha + star.twinkleAmp * Math.sin(t * star.twinkleSpeed + star.twinklePhase)
          if (alpha <= 0.02) continue
          c.globalAlpha = Math.min(1, alpha)
          if (star.bright) {
            const s = star.size * 7
            c.drawImage(sprite, x - s / 2, y - s / 2, s, s)
          } else {
            c.fillStyle = starColor
            c.beginPath()
            c.arc(x, y, star.size, 0, Math.PI * 2)
            c.fill()
          }
        }
      }
      c.globalAlpha = 1

      // Shooting star — a rare, brief streak.
      if (shootingStar) {
        const s = shootingStar
        s.x += s.vx
        s.y += s.vy
        s.life += 1
        const fade = 1 - s.life / s.maxLife
        if (fade <= 0 || s.x > width + 100 || s.y > height + 100) {
          shootingStar = null
        } else {
          const grad = c.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9)
          grad.addColorStop(0, `rgba(${starRgb}, ${0.85 * fade})`)
          grad.addColorStop(1, 'transparent')
          c.strokeStyle = grad
          c.lineWidth = 1.4
          c.beginPath()
          c.moveTo(s.x, s.y)
          c.lineTo(s.x - s.vx * 9, s.y - s.vy * 9)
          c.stroke()
        }
      } else if (t * 1000 > nextShootAt) {
        nextShootAt = t * 1000 + 7000 + Math.random() * 8000
        const fromTop = Math.random() < 0.6
        shootingStar = {
          x: fromTop ? Math.random() * width * 0.8 : -40,
          y: fromTop ? -20 : Math.random() * height * 0.4,
          vx: 7 + Math.random() * 5,
          vy: 4 + Math.random() * 3,
          life: 0,
          maxLife: 55,
        }
      }
    }

    function loop(now: number) {
      drawFrame((now - start) / 1000)
      rafId = requestAnimationFrame(loop)
    }

    function play() {
      if (running || reducedMq.matches) return
      running = true
      start = performance.now() - start // resume from stashed elapsed time
      rafId = requestAnimationFrame(loop)
    }

    function pause() {
      if (!running) return
      running = false
      cancelAnimationFrame(rafId)
      start = performance.now() - start // stash elapsed time
    }

    function applyMotionPreference() {
      if (reducedMq.matches) {
        pause()
        drawFrame(0) // static sky — space stays visible, nothing moves
      } else {
        play()
      }
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (reducedMq.matches) drawFrame(0)
      }, 150)
    }

    function onVisibility() {
      if (document.hidden) pause()
      else if (!reducedMq.matches) play()
    }

    resize()
    start = 0
    applyMotionPreference()

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    reducedMq.addEventListener('change', applyMotionPreference)

    return () => {
      cancelAnimationFrame(rafId)
      running = false
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMq.removeEventListener('change', applyMotionPreference)
    }
    // Re-init on theme change so the canvas re-reads the CSS color tokens.
  }, [resolvedTheme])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Nebula washes — static CSS, rasterized once, cheaper than canvas gradients */}
      <div
        className="absolute rounded-full"
        style={{
          width: '70rem',
          height: '70rem',
          top: '-25rem',
          left: '-20rem',
          background: 'radial-gradient(circle, var(--accent), transparent 60%)',
          opacity: 0.07,
          filter: 'blur(120px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '55rem',
          height: '55rem',
          bottom: '-20rem',
          right: '-15rem',
          background: 'radial-gradient(circle, var(--glow), transparent 60%)',
          opacity: 0.05,
          filter: 'blur(120px)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
