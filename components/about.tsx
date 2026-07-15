'use client'

import Image from 'next/image'
import { about, bio } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'

export function About() {
  return (
    <SectionWrapper id="about">
      <TypewriterHeading text="The Pilot" eyebrow="crew manifest" className="text-3xl md:text-4xl font-bold mb-10 text-foreground" />
      <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-start">
        <div className="space-y-5">
          {about.story.map((paragraph, i) => (
            <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}

          <div className="pt-2">
            <p className="font-mono text-xs tracking-[0.32em] uppercase text-accent mb-3 select-none">
              ✦ currently exploring
            </p>
            <div className="flex flex-wrap gap-2">
              {about.learning.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-full border border-border bg-card text-sm font-mono text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-56 md:w-56 md:h-64 rounded-lg overflow-hidden border border-accent/30 shadow-[0_0_36px_-6px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
            <Image
              src={bio.avatarUrl}
              alt={bio.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-glow/30 bg-card text-xs font-mono text-muted-foreground">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-glow opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-glow" />
            </span>
            {about.availability}
          </span>
        </div>
      </div>
    </SectionWrapper>
  )
}
