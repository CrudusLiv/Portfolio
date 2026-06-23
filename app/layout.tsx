import type { Metadata } from 'next'
import './globals.css'
import { bio } from '@/lib/data'
import { CursorGlow } from '@/components/cursor-glow'
import { BackgroundEffect } from '@/components/background-effect'
import { ThemeProvider } from '@/components/theme-provider'
import { SectionDots } from '@/components/section-dots'
import { ScrollProgress } from '@/components/scroll-progress'

export const metadata: Metadata = {
  metadataBase: new URL('https://CrudusLiv.github.io/Portfolio'),
  title: `${bio.name} — Developer Portfolio`,
  description: bio.tagline,
  openGraph: {
    title: `${bio.name} — Developer Portfolio`,
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
        <ThemeProvider attribute="data-theme" forcedTheme="dark" enableSystem={false}>
          <ScrollProgress />
          <BackgroundEffect />
          <CursorGlow />
          <SectionDots />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
