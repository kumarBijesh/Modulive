import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Modulive Furniture — Sculptural Living & Timeless Interiors',
  description:
    'Discover architectural furniture designed for peaceful living. Crafted with Italian bouclé, solid European oak, and hand-honed travertine stone.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent-warm selection:text-white">
        {children}
      </body>
    </html>
  )
}
