'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-20 pb-12 border-t border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Bio */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-white">
              Modulive<span className="text-accent-terracotta">.</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Architectural furniture engineered for timeless interiors. Crafted with FSC-certified timbers, mouth-blown glass, and tactile Italian textiles.
            </p>
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Newsletter</p>
              <form className="flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 flex-1"
                />
                <button type="submit" className="px-5 py-2.5 bg-white text-foreground font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-accent-warm hover:text-white transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white/50 font-semibold">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Catalog</Link></li>
              <li><Link href="/shop?category=seating" className="hover:text-white transition-colors">Seating</Link></li>
              <li><Link href="/shop?category=tables" className="hover:text-white transition-colors">Tables</Link></li>
              <li><Link href="/shop?category=lighting" className="hover:text-white transition-colors">Lighting</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white/50 font-semibold">Account</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-white transition-colors">Customer Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white/50 font-semibold">Showroom</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              108 Design Quarter Way<br />
              Copenhagen & New York Studios<br />
              contact@modulive-furniture.com
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1 hover:text-white cursor-pointer">Instagram <ArrowUpRight className="w-3 h-3" /></span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer">Pinterest <ArrowUpRight className="w-3 h-3" /></span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer">ArchDaily <ArrowUpRight className="w-3 h-3" /></span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Modulive Furniture Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
