'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const spotlight = spotlightRef.current
    if (!dot || !ring || !spotlight) return

    document.body.style.cursor = 'none'

    let mx = -200, my = -200
    let rx = -200, ry = -200
    let rafId: number

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX
      my = e.clientY
      dot!.style.left = mx + 'px'
      dot!.style.top = my + 'px'
      spotlight!.style.left = mx + 'px'
      spotlight!.style.top = my + 'px'
    }

    function animate() {
      if (!shouldReduce) {
        rx += (mx - rx) * 0.12
        ry += (my - ry) * 0.12
        ring!.style.left = rx + 'px'
        ring!.style.top = ry + 'px'
      } else {
        ring!.style.left = mx + 'px'
        ring!.style.top = my + 'px'
      }
      rafId = requestAnimationFrame(animate)
    }

    function onEnter() {
      dot!.classList.add('cursor-hovered')
      ring!.classList.add('cursor-hovered')
    }
    function onLeave() {
      dot!.classList.remove('cursor-hovered')
      ring!.classList.remove('cursor-hovered')
    }

    function attachGlowListeners() {
      document.querySelectorAll('[data-glow]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    attachGlowListeners()
    rafId = requestAnimationFrame(animate)

    // Re-attach when DOM changes (dynamic content like project cards)
    const observer = new MutationObserver(attachGlowListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.body.style.cursor = ''
    }
  }, [shouldReduce])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9999,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 14px 4px color-mix(in srgb, var(--accent) 53%, transparent)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s, box-shadow 0.15s',
        }}
        className="cursor-dot"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9998,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid color-mix(in srgb, var(--accent) 40%, transparent)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
        className="cursor-ring"
      />
      {!shouldReduce && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 1,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 3%, transparent) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <style>{`
        .cursor-dot.cursor-hovered {
          width: 16px !important;
          height: 16px !important;
          box-shadow: 0 0 24px 8px color-mix(in srgb, var(--accent) 60%, transparent) !important;
        }
        .cursor-ring.cursor-hovered {
          width: 52px !important;
          height: 52px !important;
          border-color: var(--accent) !important;
        }
        @media (hover: none) {
          .cursor-dot, .cursor-ring { display: none; }
        }
      `}</style>
    </>
  )
}
