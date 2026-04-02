import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Scribe IQ — The Copywriting Bible',
  description:
    'A dark-themed editorial copywriting bible and AI generation tool for crafting authoritative, persona-driven copy across niches.',
}

const navLinks = [
  { label: 'Bible', href: '/bible' },
  { label: 'Personas', href: '/personas' },
  { label: 'Generate', href: '/generate' },
  { label: 'Hooks', href: '/hooks' },
  { label: 'Eras', href: '/eras' },
  { label: 'Interactions', href: '/interactions' },
]

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-canvas/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-brand tracking-[0.2em] text-lg font-bold uppercase select-none"
          >
            SCRIBE IQ
          </Link>

          {/* Nav links — desktop only */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#8888A8] hover:text-brand transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger placeholder */}
          <button className="md:hidden p-2 text-[#8888A8] hover:text-brand transition-colors" aria-label="Open menu">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-canvas text-[#E8E8F0] antialiased">
        <Nav />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  )
}
