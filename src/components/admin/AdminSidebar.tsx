'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logoutAction } from '@/actions/auth-actions'
import { LayoutDashboard, Package, ShoppingCart, Users, ShieldAlert, ArrowLeft, Menu, X, LogOut } from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders & Shipping', icon: ShoppingCart },
    { href: '/admin/users', label: 'User Directory', icon: Users },
    { href: '/admin/audit-logs', label: 'Security Audit Logs', icon: ShieldAlert },
  ]

  return (
    <>
      {/* Mobile Top Header Bar & Collapsible Drawer */}
      <div className="md:hidden sticky top-0 z-40 bg-foreground text-white border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-white">
            Modulive<span className="text-accent-terracotta">.</span>
          </span>
          <span className="text-[9px] bg-accent-terracotta text-white font-bold px-2 py-0.5 rounded-full uppercase">
            Admin
          </span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle Admin Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Floating Mobile Admin Menu Overlay */}
        {isMobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-foreground border-b border-white/10 p-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2">
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-sm font-semibold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-accent-terracotta" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors px-3 py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Storefront
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-3 py-2 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar (hidden on mobile, flex on md+) */}
      <aside className="hidden md:flex md:w-64 bg-foreground text-background flex-col justify-between p-6 min-h-screen border-r border-accent shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Modulive<span className="text-accent-terracotta">.</span>
            </span>
            <span className="text-[10px] bg-accent-terracotta text-white font-bold px-2 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions: Storefront & Sign Out */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
