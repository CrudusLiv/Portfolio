'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={`py-16 md:py-24 px-6 md:px-8 max-w-4xl mx-auto ${className}`}
      initial={shouldReduce ? {} : { opacity: 0, y: 40 }}
      whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}
