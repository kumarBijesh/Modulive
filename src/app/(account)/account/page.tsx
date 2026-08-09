import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { getOrdersAction } from '@/actions/checkout-actions'
import { User, Package, MapPin, LogOut } from 'lucide-react'
import { AccountInteractive } from './AccountInteractive'

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Customer Account
            </span>
            <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back, {user.name}</h1>
            <p className="text-xs text-muted-foreground mt-1">{user.email} • Role: <strong className="uppercase text-foreground">{user.role}</strong></p>
          </div>
          <AccountInteractive />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order History */}
          <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2 border-b border-border pb-4">
              <Package className="w-5 h-5 text-accent-terracotta" /> Recent Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 bg-foreground text-background text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-accent-warm hover:text-white transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-muted border border-border space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="font-mono font-bold text-foreground">{order.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase text-[10px] font-bold">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{order.items.length} items • Total: ${(order.totalCents / 100).toFixed(2)}</p>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Profile Card */}
          <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2 border-b border-border pb-4">
              <User className="w-5 h-5 text-accent-terracotta" /> Saved Details
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-muted-foreground uppercase font-semibold">Account Name</span>
                <p className="font-medium text-foreground text-sm">{user.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground uppercase font-semibold">Primary Email</span>
                <p className="font-medium text-foreground text-sm">{user.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground uppercase font-semibold">Default Shipping</span>
                <p className="font-medium text-foreground text-sm mt-1">
                  742 Design Quarter Ave<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
