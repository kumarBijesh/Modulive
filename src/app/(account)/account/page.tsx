import React from 'react'
import { redirect } from 'next/navigation'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { getOrdersAction } from '@/actions/checkout-actions'
import { AccountInteractive } from './AccountInteractive'
import { CustomerPortalClient } from './CustomerPortalClient'

export default async function AccountPage() {
  const user = await getCurrentUserAction()

  if (!user) {
    redirect('/login')
  }

  const ordersRes = await getOrdersAction()
  const orders = ordersRes.orders || []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full space-y-6 sm:space-y-8">
        
        {/* Account Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border pb-4 sm:pb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Customer Portal
            </span>
            <h1 className="text-lg sm:text-3xl font-serif font-bold text-foreground tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 break-all">
              {user.email} • Role: <strong className="uppercase text-foreground font-semibold">{user.role}</strong>
            </p>
          </div>

          <AccountInteractive role={user.role} />
        </div>

        {/* Customer Portal Client Component */}
        <CustomerPortalClient user={user} initialOrders={orders} />
      </main>

      <Footer />
    </div>
  )
}
