'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, ShieldAlert } from 'lucide-react'
import { getCartAction } from '@/actions/cart-actions'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { CartDrawer } from './CartDrawer'

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  const refreshCart = async () => {
    const res = await getCartAction()
    if (res.items) {
      setCartCount(res.items.reduce((sum, i) => sum + i.quantity, 0))
    }
  }

  useEffect(() => {
    refreshCart()
    getCurrentUserAction().then(setUser)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header border-b border-border/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-full"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground group-hover:text-accent-warm transition-colors">
              Modulive<span className="text-accent-terracotta">.</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className="text-foreground hover:text-accent-terracotta transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-foreground hover:text-accent-terracotta transition-colors">
              Catalog
            </Link>
            <Link href="/shop?category=seating" className="text-muted-foreground hover:text-foreground transition-colors">
              Seating
            </Link>
            <Link href="/shop?category=tables" className="text-muted-foreground hover:text-foreground transition-colors">
              Tables
            </Link>
            <Link href="/shop?category=lighting" className="text-muted-foreground hover:text-foreground transition-colors">
              Lighting
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="p-2 text-foreground hover:bg-muted rounded-full transition-colors hidden sm:flex"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </Link>

            {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
              <Link
                href="/admin"
                className="px-3 py-1.5 bg-accent-terracotta text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin
              </Link>
            ) : null}

            <Link
              href={user ? '/account' : '/login'}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full hover:bg-muted text-foreground transition-all border border-border/60 text-xs font-semibold shadow-sm"
              title={user ? `Account (${user.name})` : 'Sign In'}
            >
              <User className="w-4 h-4 text-accent-terracotta" />
              <span className="max-w-[130px] truncate">{user ? user.name : 'Sign In'}</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-foreground text-background hover:bg-accent-warm rounded-full transition-all flex items-center justify-center shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-terracotta text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-foreground py-2 border-b border-border/40"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-foreground py-2 border-b border-border/40"
            >
              All Catalog
            </Link>
            <Link
              href="/shop?category=seating"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-muted-foreground py-1.5"
            >
              Seating & Sofas
            </Link>
            <Link
              href="/shop?category=tables"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-muted-foreground py-1.5"
            >
              Tables & Desks
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-foreground py-2 font-semibold"
            >
              View Cart ({cartCount})
            </Link>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCartChange={refreshCart} />
    </>
  )
}
