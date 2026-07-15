'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { bio, caseStudies, social, type CaseStudy } from '@/lib/data'
import { computeTelemetry, fetchRepos, type GitHubRepo, type Telemetry } from '@/lib/github'
import { buttonVariants } from '@/components/ui/button'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'
import { ConstellationMap } from '@/components/space/constellation-map'

const FEATURED_NAMES = new Set(caseStudies.map((cs) => cs.name))

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

function TelemetryBand({ telemetry, loading }: { telemetry: Telemetry | null; loading: boolean }) {
  const readouts: { label: string; value: string }[] = telemetry
    ? [
        { label: 'active repos', value: String(telemetry.repoCount) },
        { label: 'stars logged', value: String(telemetry.totalStars) },
        {
          label: 'top systems',
          value: telemetry.topLanguages.map((l) => l.name).join(' · ') || '—',
        },
        {
          label: 'last signal',
          value: telemetry.lastPush
            ? new Date(telemetry.lastPush).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '—',
        },
      ]
    : []

  if (!loading && !telemetry) return null

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-12"
      aria-label="Live GitHub statistics"
    >
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card p-4 animate-pulse">
              <div className="h-3 bg-muted rounded w-1/2 mb-2" />
              <div className="h-5 bg-muted rounded w-2/3" />
            </div>
          ))
        : readouts.map(({ label, value }) => (
            <div key={label} className="bg-card p-4">
              <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5 select-none">
                {label}
              </p>
              <p className="font-mono text-sm text-glow tabular-nums break-words leading-relaxed">
                {value}
              </p>
            </div>
          ))}
    </div>
  )
}

function DossierCard({ study, index }: { study: CaseStudy; index: number }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.article
      className="group relative bg-card/80 border border-border rounded-lg p-6 md:p-8 backdrop-blur-sm hover:border-accent/40 transition-colors"
      initial={shouldReduce ? {} : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
    >
      {/* Stretched link: the whole card opens the repository */}
      <a
        href={study.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${study.title} on GitHub`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <span className="sr-only">Open {study.title} on GitHub</span>
      </a>

      <header className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-glow select-none">
            featured mission
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors inline-flex items-center gap-1.5">
          repository <ExternalLink className="w-3 h-3" />
        </span>
      </header>

      <h3 className="text-2xl font-bold text-foreground">{study.title}</h3>
      <p className="text-base text-accent mb-5">{study.tagline}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5 select-none">
              the problem
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">{study.problem}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5 select-none">
              my role
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">{study.role}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5 select-none">
              outcome
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">{study.outcome}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5 select-none">
              highlights
            </p>
            <ul className="space-y-1.5">
              {study.highlights.map((highlight, i) => (
                <li key={i} className="text-base text-muted-foreground flex gap-3 leading-relaxed">
                  <span className="text-accent/60 text-sm mt-1 shrink-0">▸</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-2 select-none">
              stack
            </p>
            <div className="flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full border border-border bg-secondary text-sm font-mono text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchRepos(bio.username)
      .then(setRepos)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const telemetry = repos.length > 0 ? computeTelemetry(repos) : null
  const gridRepos = repos.filter((repo) => !FEATURED_NAMES.has(repo.name))

  return (
    <SectionWrapper id="projects">
      <div className="flex items-center justify-between mb-10">
        <TypewriterHeading text="Missions" eyebrow="mission log" className="text-3xl md:text-4xl font-bold text-foreground" />
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5"
        >
          GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {!error && <TelemetryBand telemetry={telemetry} loading={loading} />}

      {/* Featured case studies */}
      <div className="space-y-6 mb-14">
        {caseStudies.map((study, i) => (
          <DossierCard key={study.name} study={study} index={i} />
        ))}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <p className="font-mono text-xs tracking-[0.32em] uppercase text-accent select-none">
          ✦ all missions
        </p>
        <p className="font-mono text-[11px] text-muted-foreground/70 select-none">
          hover a constellation to scan · click to open
        </p>
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
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <ConstellationMap repos={gridRepos} />
      )}
    </SectionWrapper>
  )
}
