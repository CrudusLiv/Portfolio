'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { PLANETS, ORBIT_TILT, orbitPoint, clampDpr, hexToRgb, type Point } from '@/lib/space'

interface PlanetState {
  angle: number
  trail: Point[]
  rgb: string
}

/**
 * The hero's particle solar system: a glowing sun, hairline elliptical
 * orbits, and planet particles dragging fading trails. Decorative only.
 */
export function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallMq = window.matchMedia('(max-width: 768px)')

    const styles = getComputedStyle(document.documentElement)
    const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
    const rgbFor = {
      accent: hexToRgb(token('--accent', '#A78BFA')),
      glow: hexToRgb(token('--glow', '#67E8F9')),
      foreground: hexToRgb(token('--foreground', '#E6EAF7')),
    }
    const solarRgb = hexToRgb(token('--solar', '#FBBF24'))
    const borderRgb = hexToRgb(token('--border', '#1D2438'))

    const planets: PlanetState[] = PLANETS.map((spec) => ({
      angle: spec.phase,
      trail: [],
      rgb: rgbFor[spec.color],
    }))

    let width = 0
    let height = 0
    let cx = 0
    let cy = 0
    let scale = 0
    let rafId = 0
    let running = false
    let visible = true
    let last = 0
    let t = 0
    // Mouse parallax offset, eased toward the pointer
    let px = 0
    let py = 0
    let targetPx = 0
    let targetPy = 0

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = clampDpr(window.devicePixelRatio || 1, smallMq.matches)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Sun sits off-center so the text column stays clean;
      // on phones it rides high above the text instead.
      cx = width * (smallMq.matches ? 0.5 : 0.66)
      cy = height * (smallMq.matches ? 0.13 : 0.42)
      scale = Math.min(width, height)
    }

    function drawSun(c: CanvasRenderingContext2D, pulse: number) {
      const r = scale * 0.055 * (1 + pulse * 0.06)
      const corona = c.createRadialGradient(cx, cy, 0, cx, cy, r * 5)
      corona.addColorStop(0, `rgba(${solarRgb}, ${0.32 + pulse * 0.05})`)
      corona.addColorStop(0.4, `rgba(${solarRgb}, 0.08)`)
      corona.addColorStop(1, `rgba(${solarRgb}, 0)`)
      c.fillStyle = corona
      c.beginPath()
      c.arc(cx, cy, r * 5, 0, Math.PI * 2)
      c.fill()

      const core = c.createRadialGradient(cx, cy, 0, cx, cy, r)
      core.addColorStop(0, 'rgba(255, 244, 214, 0.95)')
      core.addColorStop(0.55, `rgba(${solarRgb}, 0.9)`)
      core.addColorStop(1, `rgba(${solarRgb}, 0.25)`)
      c.fillStyle = core
      c.beginPath()
      c.arc(cx, cy, r, 0, Math.PI * 2)
      c.fill()
    }

    function drawOrbits(c: CanvasRenderingContext2D) {
      c.strokeStyle = `rgba(${borderRgb}, 0.55)`
      c.lineWidth = 1
      for (const spec of PLANETS) {
        const a = spec.radius * scale
        c.beginPath()
        c.ellipse(cx, cy, a, a * spec.squash, ORBIT_TILT, 0, Math.PI * 2)
        c.stroke()
      }
    }

    function drawFrame(dt: number) {
      const c = ctx!
      c.clearRect(0, 0, width, height)
      c.save()
      c.translate(px, py)
      // Dim the whole scene on phones so text stays readable over it
      const sceneAlpha = smallMq.matches ? 0.65 : 1
      c.globalAlpha = sceneAlpha

      drawOrbits(c)
      drawSun(c, Math.sin(t * 1.1))

      PLANETS.forEach((spec, i) => {
        const p = planets[i]
        p.angle += spec.speed * dt
        const pos = orbitPoint(spec, p.angle, cx, cy, scale)

        p.trail.push(pos)
        if (p.trail.length > spec.trail) p.trail.shift()

        for (let k = 0; k < p.trail.length; k++) {
          const fade = (k + 1) / p.trail.length
          c.globalAlpha = fade * 0.22 * sceneAlpha
          c.fillStyle = `rgba(${p.rgb}, 1)`
          c.beginPath()
          c.arc(p.trail[k].x, p.trail[k].y, spec.size * fade * 0.7, 0, Math.PI * 2)
          c.fill()
        }
        c.globalAlpha = sceneAlpha

        const glow = c.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, spec.size * 3.2)
        glow.addColorStop(0, `rgba(${p.rgb}, 0.5)`)
        glow.addColorStop(1, `rgba(${p.rgb}, 0)`)
        c.fillStyle = glow
        c.beginPath()
        c.arc(pos.x, pos.y, spec.size * 3.2, 0, Math.PI * 2)
        c.fill()

        c.fillStyle = `rgba(${p.rgb}, 1)`
        c.beginPath()
        c.arc(pos.x, pos.y, spec.size, 0, Math.PI * 2)
        c.fill()
      })

      c.restore()
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt
      px += (targetPx - px) * 0.04
      py += (targetPy - py) * 0.04
      drawFrame(dt)
      rafId = requestAnimationFrame(loop)
    }

    function play() {
      if (running || reducedMq.matches || !visible || document.hidden) return
      running = true
      last = performance.now()
      rafId = requestAnimationFrame(loop)
    }

    function pause() {
      if (!running) return
      running = false
      cancelAnimationFrame(rafId)
    }

    function renderStatic() {
      // Frozen scene: orbits, sun, planets at seeded angles — no motion
      px = 0
      py = 0
      drawFrame(0)
    }

    function applyMotionPreference() {
      if (reducedMq.matches) {
        pause()
        renderStatic()
      } else {
        play()
      }
    }

    function onMouseMove(e: MouseEvent) {
      targetPx = (e.clientX / window.innerWidth - 0.5) * 18
      targetPy = (e.clientY / window.innerHeight - 0.5) * 12
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (reducedMq.matches) renderStatic()
      }, 150)
    }

    function onVisibility() {
      if (document.hidden) pause()
      else applyMotionPreference()
    }

    // Pause the loop while the hero is scrolled out of view
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) applyMotionPreference()
      else pause()
    })
    io.observe(canvas)

    resize()
    applyMotionPreference()

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    reducedMq.addEventListener('change', applyMotionPreference)

    return () => {
      cancelAnimationFrame(rafId)
      running = false
      clearTimeout(resizeTimer)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMq.removeEventListener('change', applyMotionPreference)
    }
    // Re-init on theme change so the canvas re-reads the CSS color tokens.
  }, [resolvedTheme])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
