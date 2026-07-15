'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface TypewriterHeadingProps {
  text: string
  className?: string
  as?: 'h2' | 'h3'
  /** Mono uppercase label rendered above the heading, e.g. "trajectory". */
  eyebrow?: string
}

function Eyebrow({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="block font-mono text-xs tracking-[0.32em] uppercase text-accent mb-2 select-none"
    >
      ✦ {label}
    </span>
  )
}

export function TypewriterHeading({ text, className = '', as: Tag = 'h2', eyebrow }: TypewriterHeadingProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return (
      <div>
        {eyebrow && <Eyebrow label={eyebrow} />}
        <Tag className={className}>{text}</Tag>
      </div>
    )
  }

  return (
    <div>
      {eyebrow && <Eyebrow label={eyebrow} />}
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
    </div>
  )
}
