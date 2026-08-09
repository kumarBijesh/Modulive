import React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { getOrdersAction } from '@/actions/checkout-actions'
import { ShoppingBag, Package, MapPin, Mail, Calendar } from 'lucide-react'

export default async function AdminOrdersPage() {
  const user = await getCurrentUserAction()

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login')
  }

  const ordersRes = await getOrdersAction()
  let orders = ordersRes.orders || []

  // Seed sample demonstration order if system is fresh
  if (orders.length === 0) {
    orders = [
      {
        id: 'ord-demo-01',
        orderNumber: 'MS-894210-402',
        userEmail: 'khelegafrefire12@gmail.com',
        items: [
          {
            title: 'Modulive Bouclé Curved Lounge Armchair',
            priceCents: 125000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
          },
        ],
        subtotalCents: 125000,
        shippingCents: 4900,
        taxCents: 10000,
        totalCents: 139900,
        status: 'PAID',
        paymentStatus: 'PAID',
        shippingAddress: {
          street: '108 Design Quarter Way',
          city: 'Copenhagen',
          state: 'NY',
          postalCode: '10001',
          country: 'United States',
        },
        createdAt: new Date(),
      },
    ]
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-border pb-3 sm:pb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Super Admin Logistics
            </span>
            <h1 className="text-lg sm:text-3xl font-serif font-bold text-foreground tracking-tight">Order & Booking Management</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
              View customer bookings, line items, customer Gmail accounts, and shipping addresses stored in MongoDB.
            </p>
          </div>
          <div className="px-3 py-1 sm:px-4 sm:py-2 bg-accent-sage/20 border border-accent-sage/40 rounded-full text-[11px] sm:text-xs font-bold text-foreground flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-terracotta" /> Total Orders: {orders.length}
          </div>
        </div>

        {/* Detailed Orders Feed */}
        <div className="space-y-4 sm:space-y-6">
          {orders.map((o) => {
            const addr = o.shippingAddress as Record<string, string> | null
            return (
              <div key={o.id} className="bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-sm">
                
                {/* Responsive Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-base sm:text-lg text-foreground tracking-tight">{o.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase shrink-0">
                        PAYMENT: {o.paymentStatus}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase shrink-0">
                        FULFILLMENT: {o.status}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-accent-terracotta shrink-0" />
                      Booked on: {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Order Total</span>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-foreground">{formatPrice(o.totalCents)}</p>
                  </div>
                </div>

                {/* Grid Content: Items + Customer & Shipping Info */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
                  
                  {/* Itemized Booked Products */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-accent-terracotta" /> Booked Items ({o.items.length})
                    </h4>
                    <div className="divide-y divide-border/60 bg-muted/40 rounded-xl sm:rounded-2xl border border-border p-3 sm:p-4 space-y-3">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-2">{item.title}</h5>
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Qty: {item.quantity} × {formatPrice(item.priceCents)}</p>
                          </div>
                          <div className="font-semibold text-xs sm:text-sm text-foreground font-mono shrink-0 text-right">
                            {formatPrice(item.priceCents * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info & Shipping Address */}
                  <div className="lg:col-span-5 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-accent-terracotta" /> Customer & Shipping Info
                    </h4>
                    <div className="bg-muted/40 rounded-xl sm:rounded-2xl border border-border p-3 sm:p-4 space-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground uppercase font-semibold text-[10px]">Booked By (Email)</span>
                        <p className="font-semibold text-foreground text-xs sm:text-sm font-mono mt-0.5 break-all">{o.userEmail}</p>
                      </div>

                      {addr && (
                        <div className="pt-2 border-t border-border/60">
                          <span className="text-muted-foreground uppercase font-semibold text-[10px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent-terracotta" /> Delivery Address
                          </span>
                          <p className="font-medium text-foreground text-xs mt-1 leading-relaxed">
                            {addr.street || '108 Design Quarter Way'}<br />
                            {addr.city || 'Copenhagen'}, {addr.state || 'NY'} {addr.postalCode || '10001'}<br />
                            {addr.country || 'United States'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
