'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { social } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'
import { TypewriterHeading } from '@/components/typewriter-heading'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Create a free access key at https://web3forms.com and set it in
// .env.local as NEXT_PUBLIC_WEB3FORMS_KEY (inlined at build time).
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ''

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const LINKS = [
  { label: 'livnes.ganes@gmail.com', href: social.email, Icon: Mail, external: false },
  { label: 'github.com/CrudusLiv', href: social.github, Icon: GithubIcon, external: true },
  { label: 'LinkedIn', href: social.linkedin, Icon: LinkedinIcon, external: true },
]

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-accent/60 transition-colors'

function TransmissionForm() {
  const [status, setStatus] = useState<FormStatus>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    if (!ACCESS_KEY) {
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          subject: 'New transmission from the portfolio',
          botcheck: formData.get('botcheck'),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Console header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/50">
        <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground select-none">
          transmission console
        </span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-glow/70" />
          <span className="w-2 h-2 rounded-full bg-accent/70" />
          <span className="w-2 h-2 rounded-full bg-solar/70" />
        </span>
      </div>

      <form onSubmit={onSubmit} className="p-5 space-y-4" aria-label="Contact form">
        {/* Honeypot — bots fill it, humans never see it; Web3Forms discards those */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tx-name" className="block font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5">
              name
            </label>
            <input
              id="tx-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ada Lovelace"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tx-email" className="block font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5">
              reply channel
            </label>
            <input
              id="tx-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Any provider works. I&apos;ll reply to this address.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="tx-message" className="block font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5">
            message
          </label>
          <textarea
            id="tx-message"
            name="message"
            required
            rows={6}
            placeholder={
              'Hi Livnes, I came across your portfolio and liked the TaskZen project. ' +
              "We're looking for a junior software developer for a 3-month project, mostly TypeScript and Node. " +
              'Are you free for a quick call this week? You can reach me at this email.'
            }
            className={cn(inputClass, 'resize-y min-h-32')}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'disabled:opacity-60')}
          >
            <Send className="w-4 h-4 mr-1.5" />
            {status === 'sending' ? 'Transmitting…' : 'Send transmission'}
          </button>

          <p aria-live="polite" className="text-xs font-mono">
            {status === 'sent' && (
              <span className="text-glow">
                ✦ Transmission received. I&apos;ll reply from livnes.ganes@gmail.com soon.
              </span>
            )}
            {status === 'error' && (
              <span className="text-red-400">
                Transmitter offline. Email me directly at livnes.ganes@gmail.com instead.
              </span>
            )}
          </p>
        </div>
      </form>
    </div>
  )
}

export function Contact() {
  const shouldReduce = useReducedMotion()

  return (
    <SectionWrapper id="contact">
      <TypewriterHeading text="Let's build something" eyebrow="transmission" className="text-3xl md:text-4xl font-bold mb-3 text-foreground" />
      <p className="text-muted-foreground mb-10 leading-relaxed text-base max-w-lg">
        Open to new opportunities and interesting projects. Messages sent here land straight in
        my inbox at{' '}
        <span className="text-foreground font-medium">livnes.ganes@gmail.com</span>, and any
        email provider works on your side: Gmail, Outlook, or anything else.
      </p>

      <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-start">
        <TransmissionForm />

        <div className="flex flex-col gap-4">
          {LINKS.map(({ label, href, Icon, external }, i) => (
            <motion.a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-3 text-base text-muted-foreground hover:text-accent transition-colors group"
              initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
            >
              <span className="w-8 h-8 flex items-center justify-center rounded border border-border bg-card group-hover:border-accent/60 transition-colors shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </span>
              {label}
            </motion.a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
