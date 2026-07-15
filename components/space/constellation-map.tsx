'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ExternalLink, Star } from 'lucide-react'
import { generateConstellation, mulberry32, STARFIELD_SEED } from '@/lib/space'
import { LANG_COLORS, type GitHubRepo } from '@/lib/github'

/** Cell height in px — panel height grows by rows, width splits into columns. */
const CELL_H = 190
/** Bottom fraction of each cell reserved for the name label. */
const LABEL_ZONE = 0.22
const CARD_W = 264

interface PlacedRepo {
  repo: GitHubRepo
  col: number
  row: number
}

/** Faint non-interactive dust behind the constellations, seeded like the sky. */
function useDust() {
  return useMemo(() => {
    const rng = mulberry32(STARFIELD_SEED)
    return Array.from({ length: 70 }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      r: 0.5 + rng() * 0.7,
      alpha: 0.08 + rng() * 0.2,
    }))
  }, [])
}

function InfoCard({ placed, cols, rows, interactive }: {
  placed: PlacedRepo
  cols: number
  rows: number
  interactive: boolean
}) {
  const { repo, col, row } = placed
  const cx = ((col + 0.5) / cols) * 100
  const isLastRow = row === rows - 1
  const anchorY = ((row + (isLastRow ? 0.08 : 0.72)) / rows) * 100

  return (
    <div
      className={`absolute z-20 rounded-lg border border-accent/40 bg-popover/95 backdrop-blur-sm p-4 shadow-[0_0_24px_-6px_color-mix(in_srgb,var(--accent)_45%,transparent)] ${
        interactive ? '' : 'pointer-events-none'
      }`}
      style={{
        width: CARD_W,
        left: `clamp(0.5rem, calc(${cx}% - ${CARD_W / 2}px), calc(100% - ${CARD_W}px - 0.5rem))`,
        top: `${anchorY}%`,
        transform: isLastRow ? 'translateY(-100%)' : undefined,
      }}
      role="status"
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <p className="font-semibold text-sm text-foreground leading-snug">{repo.name}</p>
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Star className="w-3 h-3" />
            {repo.stargazers_count}
          </span>
        )}
      </div>
      {repo.description && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{repo.description}</p>
      )}
      <div className="flex items-center justify-between gap-3">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: LANG_COLORS[repo.language] ?? '#78716C' }}
            />
            {repo.language}
          </span>
        ) : (
          <span />
        )}
        {interactive ? (
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono text-accent"
          >
            open repository <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-mono text-accent/80">
            click to open <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  )
}

export function ConstellationMap({ repos }: { repos: GitHubRepo[] }) {
  const shouldReduce = useReducedMotion()
  // Ink on paper needs far more opacity than glow on night sky to stay legible.
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'
  const lineOpacity = isLight ? 0.5 : 0.22
  const starOpacity = isLight ? 0.92 : 0.7
  const dustBoost = isLight ? 1.8 : 1
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(4)
  const [active, setActive] = useState<number | null>(null)
  // Lazy init keeps this out of the effect; it renders nothing until interaction.
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  )
  const dust = useDust()

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setCols(w >= 900 ? 4 : w >= 620 ? 3 : 2)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const rows = Math.max(1, Math.ceil(repos.length / cols))

  const placed: PlacedRepo[] = useMemo(() => {
    const lastRowCount = repos.length % cols || cols
    return repos.map((repo, i) => {
      const row = Math.floor(i / cols)
      const isLastRow = row === Math.ceil(repos.length / cols) - 1
      // Center a partially-filled last row so the sky doesn't list to port.
      const offset = isLastRow ? (cols - lastRowCount) / 2 : 0
      return { repo, col: (i % cols) + offset, row }
    })
  }, [repos, cols])

  const constellations = useMemo(
    () => repos.map((repo) => generateConstellation(repo.name)),
    [repos]
  )

  if (repos.length === 0) return null

  const activePlaced = active === null ? null : placed[active]

  // Star/line percent coordinates: constellations draw in the cell's upper
  // region, leaving LABEL_ZONE at the bottom for the repo name.
  const starX = (p: PlacedRepo, sx: number) => ((p.col + sx) / cols) * 100
  const starY = (p: PlacedRepo, sy: number) => ((p.row + sy * (1 - LABEL_ZONE)) / rows) * 100

  return (
    <motion.div
      ref={wrapperRef}
      className="relative rounded-lg border border-border bg-card/40 overflow-hidden"
      style={{ height: rows * CELL_H }}
      initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setActive(null)
      }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* Background dust */}
        {dust.map((d, i) => (
          <circle
            key={`dust-${i}`}
            cx={`${d.x}%`}
            cy={`${d.y}%`}
            r={d.r}
            fill="var(--foreground)"
            opacity={Math.min(0.5, d.alpha * dustBoost)}
          />
        ))}

        {placed.map((p, i) => {
          const spec = constellations[i]
          const isActive = active === i
          const dimmed = active !== null && !isActive
          const mainColor = p.repo.language
            ? (LANG_COLORS[p.repo.language] ?? 'var(--accent)')
            : 'var(--accent)'

          return (
            <g
              key={p.repo.id}
              style={{ opacity: dimmed ? 0.3 : 1, transition: 'opacity 0.25s ease' }}
            >
              {spec.links.map(([a, b], j) => (
                <line
                  key={j}
                  x1={`${starX(p, spec.stars[a].x)}%`}
                  y1={`${starY(p, spec.stars[a].y)}%`}
                  x2={`${starX(p, spec.stars[b].x)}%`}
                  y2={`${starY(p, spec.stars[b].y)}%`}
                  stroke={isActive ? 'var(--accent)' : 'var(--foreground)'}
                  strokeWidth={isActive ? 1.4 : 1}
                  opacity={isActive ? 0.9 : lineOpacity}
                  style={{ transition: 'stroke 0.25s ease, opacity 0.25s ease' }}
                />
              ))}
              {spec.stars.map((s, j) => (
                <g key={j}>
                  {/* Halo behind the star when its constellation is scanned */}
                  {isActive && (
                    <circle
                      cx={`${starX(p, s.x)}%`}
                      cy={`${starY(p, s.y)}%`}
                      r={s.r * 3}
                      fill={s.main ? mainColor : 'var(--accent)'}
                      opacity={0.18}
                    />
                  )}
                  <circle
                    className={
                      !shouldReduce && !s.main && j % 2 === 0 ? 'animate-star-twinkle' : undefined
                    }
                    style={{ animationDelay: `${(j * 0.7 + p.col) % 3}s` }}
                    cx={`${starX(p, s.x)}%`}
                    cy={`${starY(p, s.y)}%`}
                    r={isActive ? s.r * 1.25 : s.r}
                    fill={s.main ? mainColor : 'var(--foreground)'}
                    opacity={s.main ? 1 : isActive ? 0.95 : starOpacity}
                  />
                </g>
              ))}
            </g>
          )
        })}
      </svg>

      {/* Interactive layer: one anchor per cell, label pinned at its bottom */}
      {placed.map((p, i) => (
        <a
          key={p.repo.id}
          href={p.repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${p.repo.name}${p.repo.description ? ` — ${p.repo.description}` : ''} (opens GitHub)`}
          className="group absolute flex items-end justify-center pb-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          style={{
            left: `${(p.col / cols) * 100}%`,
            top: `${(p.row / rows) * 100}%`,
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
          }}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
          onClick={(e) => {
            // Touch: first tap scans (shows the card), second tap opens.
            if (isTouch && active !== i) {
              e.preventDefault()
              setActive(i)
            }
          }}
        >
          <span
            className={`max-w-full truncate px-2 font-mono text-[11px] tracking-[0.14em] transition-colors ${
              active === i ? 'text-accent' : 'text-muted-foreground/70'
            }`}
          >
            {p.repo.name}
          </span>
        </a>
      ))}

      {activePlaced && (
        <InfoCard placed={activePlaced} cols={cols} rows={rows} interactive={isTouch} />
      )}
    </motion.div>
  )
}
