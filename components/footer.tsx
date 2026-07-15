import { bio } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center space-y-3">
      <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-muted-foreground/70 select-none">
        ✦ end of transmission ✦
      </p>
      <p className="text-sm text-muted-foreground font-mono">
        © {new Date().getFullYear()} {bio.name} · Built with Next.js
      </p>
      <a
        href="#hero"
        className="inline-block text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
      >
        ↑ return to launch
      </a>
    </footer>
  )
}
