'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import { bio, social } from '@/lib/data'
import { fetchRepos, type GitHubRepo } from '@/lib/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionWrapper } from '@/components/section-wrapper'
import { GlowCard } from '@/components/glow-card'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  JavaScript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Python: 'bg-green-500/20 text-green-400 border-green-500/30',
  Go: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Rust: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Java: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function ProjectSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <Skeleton className="h-5 w-3/4 bg-muted" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-2/3 bg-muted" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-16 bg-muted rounded-full" />
          <Skeleton className="h-5 w-10 bg-muted rounded-full" />
        </div>
      </CardContent>
    </Card>
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
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
        <span className="font-mono text-accent text-xl">04.</span> Projects
      </h2>

      {error ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-4">Couldn&apos;t load projects from GitHub.</p>
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProjectSkeleton key={i} />
              ))
            : repos.map((repo, i) => (
                <motion.div
                  key={repo.id}
                  className={shouldReduce ? '' : 'hover:scale-[1.02] transition-transform duration-200 will-change-transform'}
                  initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                  whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <GlowCard className="h-full rounded-lg">
                  <Card data-glow className="h-full bg-card border-border hover:border-accent/50 hover:shadow-[var(--glow-md)] transition-all duration-200 flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold font-mono">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent transition-colors"
                        >
                          {repo.name}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground flex-1 leading-relaxed italic">
                        {repo.description ?? 'No description provided.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {repo.language && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${LANGUAGE_COLORS[repo.language] ?? 'bg-muted/20 text-muted-foreground border-border'}`}
                            >
                              {repo.language}
                            </Badge>
                          )}
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3" />
                              {repo.stargazers_count}
                            </span>
                          )}
                        </div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${repo.name} on GitHub`}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  </GlowCard>
                </motion.div>
              ))}
        </div>
      )}
    </SectionWrapper>
  )
}
