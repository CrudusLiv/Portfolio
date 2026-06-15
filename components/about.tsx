import Image from 'next/image'
import { bio } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'

export function About() {
  return (
    <SectionWrapper id="about">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
        <span className="font-mono text-accent text-xl">01.</span> About Me
      </h2>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
          <p>{bio.aboutText}</p>
          <p>
            When I&apos;m not coding, you can find me exploring new technologies,
            contributing to open source, or writing about software development.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72">
            <div className="absolute inset-0 rounded-lg border-2 border-accent translate-x-3 translate-y-3" style={{ boxShadow: 'var(--glow-sm)' }} />
            <Image
              src={bio.avatarUrl}
              alt={`${bio.name} avatar`}
              fill
              data-glow
              className="rounded-lg object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-300"
              unoptimized
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
