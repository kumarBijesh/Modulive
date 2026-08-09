import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Award, ShieldCheck } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Banner */}
          <div className="lg:col-span-6 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-sage/20 text-accent-terracotta border border-accent-sage/40 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Modulive 2026 Collection
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.1] tracking-tight text-balance">
              Sculptural living & timeless form.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Discover original furniture designed for peaceful living. Crafted with Italian bouclé, solid European oak, and hand-honed travertine stone.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-8 py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full font-medium text-sm tracking-wide transition-all shadow-md flex items-center gap-3 group"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=seating"
                className="px-7 py-4 border border-border hover:border-foreground rounded-full font-medium text-sm tracking-wide text-foreground transition-all hover:bg-white"
              >
                View Armchairs
              </Link>
            </div>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/80">
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">240+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Designs</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">FSC Certified</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">10-Yr</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Warranty</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Banner */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border border-border bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85"
                alt="Modulive Bouclé Armchair"
                fill
                priority
                className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Floating Product Badge */}
              <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-terracotta">Featured Highlight</span>
                  <h4 className="text-sm font-serif font-semibold text-foreground">Modulive Bouclé Lounge Chair</h4>
                  <p className="text-xs text-muted-foreground">$1,250.00 • In Stock</p>
                </div>
                <Link
                  href="/product/modulive-boucle-curved-lounge-armchair"
                  className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-full hover:bg-accent-warm hover:text-white transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
