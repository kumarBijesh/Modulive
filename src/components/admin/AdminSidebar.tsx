'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, ShieldAlert, ArrowLeft } from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders & Shipping', icon: ShoppingCart },
    { href: '/admin/users', label: 'User Directory', icon: Users },
    { href: '/admin/audit-logs', label: 'Security Audit Logs', icon: ShieldAlert },
  ]

  return (
    <aside className="w-64 bg-foreground text-background flex flex-col justify-between p-6 min-h-screen border-r border-accent">
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

      {/* Return to Storefront */}
      <div className="pt-6 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </Link>
      </div>
    </aside>
  )
}
