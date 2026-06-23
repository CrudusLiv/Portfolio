'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion'
import { ExternalLink, Star } from 'lucide-react'
import { bio, social } from '@/lib/data'
import { fetchRepos, type GitHubRepo } from '@/lib/github'
import { buttonVariants } from '@/components/ui/button'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Java: '#B07219',
  Kotlin: '#7F52FF',
  'C#': '#178600',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  Rust: '#DEA584',
}

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-muted rounded w-2/5" />
        <div className="h-5 bg-muted rounded-full w-16" />
      </div>
      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-3/4" />
    </div>
  )
}

function ProjectCard({
  repo,
  index,
  reduce,
}: {
  repo: GitHubRepo
  index: number
  reduce: boolean
}) {
  const rotateXRaw = useMotionValue(0)
  const rotateYRaw = useMotionValue(0)
  const rotateX = useSpring(rotateXRaw, { stiffness: 150, damping: 18 })
  const rotateY = useSpring(rotateYRaw, { stiffness: 150, damping: 18 })
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%)`

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateYRaw.set((px - 0.5) * 8)
    rotateXRaw.set(-(py - 0.5) * 8)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }

  const handleLeave = () => {
    rotateXRaw.set(0)
    rotateYRaw.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-colors group flex flex-col gap-3"
      style={
        reduce
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }
      }
      initial={reduce ? {} : { opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={reduce ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.07 }}
    >
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: spotlight }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm text-foreground hover:text-accent transition-colors leading-snug"
        >
          {repo.name}
        </a>
        {repo.language && (
          <span className="inline-flex items-center gap-1.5 shrink-0 bg-secondary rounded-full px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: LANG_COLORS[repo.language] ?? '#78716C' }}
            />
            {repo.language}
          </span>
        )}
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {repo.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        {repo.stargazers_count > 0 ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3" />
            {repo.stargazers_count}
          </span>
        ) : (
          <span />
        )}
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${repo.name}`}
          className="text-muted-foreground/40 hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  )
}

export function Projects() {
  const shouldReduce = useReducedMotion()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchRepos(bio.username)
      .then(setRepos)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SectionWrapper id="projects">
      <div className="flex items-center justify-between mb-10">
        <TypewriterHeading text="Projects" className="text-2xl font-bold text-foreground" />
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5"
        >
          GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="mb-4 text-sm">Couldn&apos;t load projects from GitHub.</p>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            View on GitHub
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : repos.map((repo, i) => (
                <ProjectCard key={repo.id} repo={repo} index={i} reduce={!!shouldReduce} />
              ))}
        </div>
      )}
    </SectionWrapper>
  )
}
