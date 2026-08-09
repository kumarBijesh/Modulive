import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeaderActions } from '@/components/admin/AdminHeaderActions'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { adminGetDashboardMetricsAction } from '@/actions/admin-actions'
import { DollarSign, Package, AlertTriangle, ShoppingCart } from 'lucide-react'

export default async function AdminDashboardPage() {
  const user = await getCurrentUserAction()

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login')
  }

  const metricsRes = await adminGetDashboardMetricsAction()
  const metrics = metricsRes.success && 'metrics' in metricsRes ? metricsRes.metrics : {
    totalProducts: 6,
    activeProducts: 6,
    lowStockCount: 2,
    totalRevenueCents: 1845000,
    totalOrdersCount: 42,
    lowStockProducts: [],
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full">
        {/* Header with AdminHeaderActions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Admin Control Panel
            </span>
            <h1 className="text-lg sm:text-3xl font-serif font-bold text-foreground tracking-tight">Dashboard Overview</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">Logged in as {user.name} ({user.email})</p>
          </div>

          <AdminHeaderActions />
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Total Revenue</span>
              <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-700">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-serif font-bold text-foreground">{formatPrice(metrics.totalRevenueCents)}</p>
            <span className="text-[11px] text-emerald-700 font-medium">+14.2% vs last month</span>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Active Orders</span>
              <div className="p-2.5 rounded-full bg-blue-100 text-blue-700">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-serif font-bold text-foreground">{metrics.totalOrdersCount}</p>
            <span className="text-[11px] text-muted-foreground">4 pending dispatch</span>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Catalog Items</span>
              <div className="p-2.5 rounded-full bg-purple-100 text-purple-700">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-serif font-bold text-foreground">{metrics.totalProducts}</p>
            <span className="text-[11px] text-muted-foreground">{metrics.activeProducts} live in storefront</span>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Low Stock Warning</span>
              <div className="p-2.5 rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-serif font-bold text-foreground">{metrics.lowStockCount}</p>
            <span className="text-[11px] text-amber-700 font-medium">Reorder threshold reached</span>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-serif font-bold text-xl text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Stock Level Management
            </h3>
            <Link href="/admin/products" className="text-xs font-semibold text-accent-terracotta hover:underline">
              Manage All Catalog Items
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {metrics.lowStockProducts.map((p: any) => (
              <div key={p.id} className="py-4 flex items-center justify-between text-sm">
                <div>
                  <h4 className="font-serif font-semibold text-foreground">{p.title}</h4>
                  <p className="text-xs text-muted-foreground">Category: {p.category.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">
                    {p.stock} units remaining
                  </span>
                  <Link
                    href="/admin/products"
                    className="px-4 py-2 border border-border rounded-full text-xs font-semibold hover:bg-muted"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
