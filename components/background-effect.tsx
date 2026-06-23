'use client'

import { useEffect } from 'react'
import {
  useScroll, useTransform, motion, useReducedMotion,
  useMotionValue, useSpring,
} from 'framer-motion'

export function BackgroundEffect() {
  const shouldReduce = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Mouse-reactive spotlight
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mouseX = useSpring(rawX, { stiffness: 55, damping: 28 })
  const mouseY = useSpring(rawY, { stiffness: 55, damping: 28 })

  useEffect(() => {
    if (shouldReduce) return
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX - window.innerWidth / 2) * 0.22)
      rawY.set((e.clientY - window.innerHeight / 2) * 0.22)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY, shouldReduce])

  // Scroll parallax
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.12, 0.18, 0.10, 0.05])
  const opacity2 = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.08, 0.14, 0.08, 0.04])
  const opacity3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.06, 0.14, 0.07])

  if (shouldReduce) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">

      {/* Layer 1 — large atmospheric base, covers full viewport */}
      <div style={{
        position: 'absolute',
        width: '110rem',
        height: '110rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle at center, var(--accent), transparent 52%)',
        opacity: 0.04,
        filter: 'blur(140px)',
        borderRadius: '50%',
      }} />

      {/* Layer 2 — mouse-reactive spotlight, sharpest layer */}
      <motion.div style={{
        position: 'absolute',
        width: '26rem',
        height: '26rem',
        top: '50%',
        left: '50%',
        marginTop: '-13rem',
        marginLeft: '-13rem',
        background: 'radial-gradient(circle, var(--accent), transparent 52%)',
        opacity: 0.24,
        filter: 'blur(32px)',
        borderRadius: '50%',
        x: mouseX,
        y: mouseY,
      }} />

      {/* Layer 3 — autonomous drift, top-left, amber */}
      <motion.div
        style={{
          position: 'absolute',
          width: '55rem',
          height: '55rem',
          top: '-10rem',
          left: '-10rem',
          background: 'radial-gradient(circle, var(--accent), transparent 58%)',
          opacity: 0.18,
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
        animate={{ x: [0, 120, -80, 40, 0], y: [0, -80, 60, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer 4 — autonomous drift, bottom-right, warm orange */}
      <motion.div
        style={{
          position: 'absolute',
          width: '45rem',
          height: '45rem',
          bottom: '-5rem',
          right: '-5rem',
          background: 'radial-gradient(circle, oklch(72% 0.2 48), transparent 58%)',
          opacity: 0.14,
          filter: 'blur(55px)',
          borderRadius: '50%',
        }}
        animate={{ x: [0, -100, 60, -30, 0], y: [0, 60, -80, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer 5 — scroll parallax, top-right */}
      <motion.div style={{
        position: 'absolute',
        width: '42rem',
        height: '42rem',
        top: '-12rem',
        right: '-8rem',
        background: 'radial-gradient(circle, var(--accent), transparent 68%)',
        opacity: opacity1,
        filter: 'blur(40px)',
        borderRadius: '50%',
        y: y1,
        x: x1,
      }} />

      {/* Layer 6 — scroll parallax, bottom-left */}
      <motion.div style={{
        position: 'absolute',
        width: '32rem',
        height: '32rem',
        bottom: '5%',
        left: '-6rem',
        background: 'radial-gradient(circle, var(--accent), transparent 68%)',
        opacity: opacity2,
        filter: 'blur(40px)',
        borderRadius: '50%',
        y: y2,
        x: x2,
      }} />

      {/* Layer 7 — scroll parallax, mid-page accent */}
      <motion.div style={{
        position: 'absolute',
        width: '20rem',
        height: '20rem',
        top: '50%',
        right: '20%',
        background: 'radial-gradient(circle, var(--accent), transparent 65%)',
        opacity: opacity3,
        filter: 'blur(30px)',
        borderRadius: '50%',
        y: y3,
      }} />

    </div>
  )
}
