import { bio } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center">
      <p className="text-sm text-muted-foreground font-mono">
        © {new Date().getFullYear()} {bio.name} · Built with Next.js
      </p>
    </footer>
  )
}
