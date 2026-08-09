'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react'
import { getCartAction } from '@/actions/cart-actions'
import { getCurrentUserAction, logoutAction } from '@/actions/auth-actions'
import { CartDrawer } from './CartDrawer'

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [toastData, setToastData] = useState<{ title?: string; quantity?: number; totalItems?: number } | null>(null)

  const refreshCart = async () => {
    const res = await getCartAction()
    if (res.items) {
      const totalQty = res.items.reduce((sum, i) => sum + i.quantity, 0)
      setCartCount(totalQty)
      return totalQty
    }
    return 0
  }

  const handleLogout = async () => {
    await logoutAction()
    setUser(null)
    setIsMobileMenuOpen(false)
    window.location.href = '/login'
  }

  useEffect(() => {
    refreshCart()
    getCurrentUserAction().then(setUser)

    const handleCartUpdate = async (e: Event) => {
      const total = await refreshCart()
      const customEv = e as CustomEvent
      if (customEv.detail?.title) {
        setToastData({
          title: customEv.detail.title,
          quantity: customEv.detail.quantity || 1,
          totalItems: total,
        })
        setTimeout(() => setToastData(null), 4000)
      }
    }

    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header border-b border-border/60 transition-all relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between">
          
          {/* Logo (Left side) */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-accent-warm transition-colors">
              Modulive<span className="text-accent-terracotta">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Center) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
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

          {/* Header Action Buttons (Right side) */}
          <div className="flex items-center gap-2 sm:gap-3">
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

            {/* Desktop Sign In / Account Button */}
            <Link
              href={user ? '/account' : '/login'}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full hover:bg-muted text-foreground transition-all border border-border/60 text-xs font-semibold shadow-sm"
              title={user ? `Account (${user.name})` : 'Sign In'}
            >
              <User className="w-4 h-4 text-accent-terracotta" />
              <span className="max-w-[130px] truncate">{user ? user.name : 'Sign In'}</span>
            </Link>

            {/* Styled Modern Cart Button with Dynamic Badge Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 text-foreground bg-background hover:bg-muted rounded-full transition-all flex items-center justify-center border border-border hover:border-foreground/40 shadow-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent-terracotta text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-background shadow-xs animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle (Rightmost position) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Floating Mobile Navigation Dropdown Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 pt-3 pb-6 space-y-3 shadow-2xl">
            
            {/* Mobile User Profile & Sign Out Controls */}
            <div className="space-y-2">
              <Link
                href={user ? '/account' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/80 hover:bg-muted text-foreground font-semibold text-sm transition-all border border-border/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <User className="w-4 h-4 text-accent-terracotta shrink-0" />
                  <span className="truncate">{user ? user.name : 'Sign In'}</span>
                </div>
                <span className="text-xs text-muted-foreground font-normal shrink-0">{user ? 'My Account' : 'Login'}</span>
              </Link>

              {/* Mobile Menu Sign Out Button */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold text-xs uppercase tracking-wider hover:bg-red-100 transition-all shadow-xs"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-border/40 space-y-2">
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
                href="/shop?category=lighting"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm text-muted-foreground py-1.5"
              >
                Lighting
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating Animated Add-To-Cart Success Toast Notification */}
      {toastData && (
        <div className="fixed top-16 sm:top-20 right-4 z-50 bg-foreground text-background border border-white/20 rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-xs sm:max-w-sm w-[calc(100vw-2rem)]">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent-terracotta">Added to Bag!</p>
            <p className="text-xs sm:text-sm font-serif font-bold truncate text-white mt-0.5">{toastData.quantity}× {toastData.title}</p>
            <p className="text-[10px] text-white/70">Total items in bag: {toastData.totalItems}</p>
          </div>
          <button
            onClick={() => {
              setToastData(null)
              setIsCartOpen(true)
            }}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-accent-terracotta text-white rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-accent-warm transition-colors shrink-0"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCartChange={refreshCart} />
    </>
  )
}
