'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface TypewriterHeadingProps {
  text: string
  className?: string
  as?: 'h2' | 'h3'
}

export function TypewriterHeading({ text, className = '', as: Tag = 'h2' }: TypewriterHeadingProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.01, delay: i * 0.035 }}
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  )
}
