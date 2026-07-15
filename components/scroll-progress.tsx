'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[70]"
      style={{ scaleX, background: 'linear-gradient(90deg, var(--accent), var(--glow))' }}
    />
  )
}
