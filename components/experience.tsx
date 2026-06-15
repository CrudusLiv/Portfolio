import { experience } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { Separator } from '@/components/ui/separator'

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
        <span className="font-mono text-accent text-xl">03.</span> Experience
      </h2>
      <div className="relative">
        {/* Vertical line — hidden on mobile */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-border hidden sm:block" aria-hidden="true" />
        <ol className="space-y-10 pl-0 sm:pl-8">
          {experience.map((entry, i) => (
            <li key={i} className="relative">
              {/* Dot — hidden on mobile */}
              <div
                className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-background hidden sm:block"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-lg font-semibold">{entry.role}</h3>
                  <span className="font-mono text-sm text-muted-foreground shrink-0">
                    {entry.dateRange}
                  </span>
                </div>
                <p className="text-accent font-medium text-sm">
                  {entry.company}
                  {entry.location && (
                    <span className="text-muted-foreground font-normal"> · {entry.location}</span>
                  )}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {entry.bullets.map((bullet, j) => (
                    <li key={j} className="text-muted-foreground text-sm flex gap-2">
                      <span className="text-accent mt-0.5 shrink-0">▸</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              {i < experience.length - 1 && (
                <Separator className="mt-8 bg-border/50" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  )
}
