import type { Metadata } from 'next'
import './globals.css'
import { bio } from '@/lib/data'
import { CursorGlow } from '@/components/cursor-glow'
import { FloatingThemeToggle } from '@/components/floating-theme-toggle'
import { Starfield } from '@/components/space/starfield'
import { ThemeProvider } from '@/components/theme-provider'
import { JourneyHud } from '@/components/journey-hud'
import { ScrollProgress } from '@/components/scroll-progress'

// Vercel injects the production domain at build time; override with
// NEXT_PUBLIC_SITE_URL once a custom domain is attached.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${bio.name} · Software Developer`,
  description: bio.tagline,
  openGraph: {
    title: `${bio.name} · Software Developer`,
    description: bio.tagline,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <ScrollProgress />
          <Starfield />
          <CursorGlow />
          <JourneyHud />
          <FloatingThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
