'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  }

  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 bg-background">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-terracotta/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-sage/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Animated Text Banner */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6 sm:space-y-8 z-10"
          >
            {/* Tag Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-sage/20 text-accent-terracotta border border-accent-sage/40 text-xs font-semibold uppercase tracking-widest shadow-xs group hover:bg-accent-sage/30 transition-colors cursor-default">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-accent-terracotta" />
                <span>Modulive 2026 Collection</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.15] tracking-tight"
            >
              Sculptural living & timeless form.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Discover original furniture designed for peaceful living. Crafted with Italian bouclé, solid European oak, and hand-honed travertine stone.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full font-medium text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-3 group"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/shop?category=seating"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 border border-border hover:border-foreground rounded-full font-medium text-sm tracking-wide text-foreground transition-all hover:bg-white text-center justify-center flex items-center shadow-xs"
                >
                  View Armchairs
                </Link>
              </motion.div>
            </motion.div>

            {/* Key Trust Metrics */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 sm:pt-8 border-t border-border/80 text-center sm:text-left"
            >
              <div className="px-1 group">
                <p className="text-xl sm:text-3xl font-serif font-bold text-foreground group-hover:text-accent-terracotta transition-colors">240+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1 truncate">Designs</p>
              </div>
              <div className="px-1 group">
                <p className="text-xl sm:text-3xl font-serif font-bold text-foreground group-hover:text-accent-terracotta transition-colors">100%</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1 truncate">FSC Certified</p>
              </div>
              <div className="px-1 group">
                <p className="text-xl sm:text-3xl font-serif font-bold text-foreground group-hover:text-accent-terracotta transition-colors">10-Yr</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1 truncate">Warranty</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero Image Banner with Subtle Floating Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative mt-4 lg:mt-0"
          >
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-border bg-muted group">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85"
                alt="Modulive Bouclé Armchair"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              
              {/* Floating Product Highlight Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-xl gap-2 backdrop-blur-md bg-white/70 border border-white/40"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent-terracotta block truncate">Featured Highlight</span>
                  <h4 className="text-xs sm:text-sm font-serif font-semibold text-foreground truncate">Modulive Bouclé Lounge Chair</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">$1,250.00 • In Stock</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/product/modulive-boucle-curved-lounge-armchair"
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-foreground text-background text-xs font-semibold rounded-full hover:bg-accent-warm hover:text-white transition-colors shrink-0 block shadow-sm"
                  >
                    View
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
