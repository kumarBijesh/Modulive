'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-12 sm:pt-20 pb-8 sm:pb-12 border-t border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 sm:pb-16 border-b border-white/10">
          
          {/* Brand Bio & Newsletter */}
          <div className="md:col-span-5 space-y-4 sm:space-y-6">
            <Link href="/" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white inline-block">
              Modulive<span className="text-accent-terracotta">.</span>
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-sm">
              Architectural furniture engineered for timeless interiors. Crafted with FSC-certified timbers, mouth-blown glass, and tactile Italian textiles.
            </p>

            <div className="pt-2">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-white/50 mb-2.5 font-semibold">Newsletter</p>
              <form className="flex flex-col sm:flex-row max-w-md gap-2.5" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 flex-1 w-full"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-foreground font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-accent-warm hover:text-white transition-all w-full sm:w-auto shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Sub-Grid (2-Column on Mobile for tight vertical space management) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-7 gap-6 sm:gap-8 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
            
            {/* Navigation */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-widest text-white/50 font-semibold">Navigation</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/shop" className="hover:text-white transition-colors">All Catalog</Link></li>
                <li><Link href="/shop?category=seating" className="hover:text-white transition-colors">Seating</Link></li>
                <li><Link href="/shop?category=tables" className="hover:text-white transition-colors">Tables & Desks</Link></li>
                <li><Link href="/shop?category=lighting" className="hover:text-white transition-colors">Lighting</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-widest text-white/50 font-semibold">Account</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/account" className="hover:text-white transition-colors">Order Tracking</Link></li>
                <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Area</Link></li>
              </ul>
            </div>

            {/* Showroom */}
            <div className="col-span-2 md:col-span-3 space-y-3 pt-2 sm:pt-0">
              <h4 className="text-[11px] sm:text-xs uppercase tracking-widest text-white/50 font-semibold">Showroom</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                108 Design Quarter Way<br />
                Copenhagen & New York Studios<br />
                contact@modulive-furniture.com
              </p>
              <div className="pt-1 flex items-center gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">Instagram <ArrowUpRight className="w-3 h-3" /></span>
                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">Pinterest <ArrowUpRight className="w-3 h-3" /></span>
                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">ArchDaily <ArrowUpRight className="w-3 h-3" /></span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-muted-foreground gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Modulive Furniture Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
