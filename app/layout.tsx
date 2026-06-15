import type { Metadata } from 'next'
import './globals.css'
import { bio } from '@/lib/data'
import { CursorGlow } from '@/components/cursor-glow'
import { BackgroundEffect } from '@/components/background-effect'
import { FloatingThemeToggle } from '@/components/floating-theme-toggle'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
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
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <BackgroundEffect />
          <CursorGlow />
          <FloatingThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
