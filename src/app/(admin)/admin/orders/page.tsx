import React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { getOrdersAction } from '@/actions/checkout-actions'
import { ShoppingBag, Package, MapPin, Mail, Calendar, CreditCard } from 'lucide-react'

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
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 sm:p-12 overflow-y-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Super Admin Logistics
            </span>
            <h1 className="text-3xl font-serif font-bold text-foreground">Order & Booking Management</h1>
            <p className="text-xs text-muted-foreground mt-1">
              View customer bookings, line items, customer Gmail accounts, and shipping addresses stored in MongoDB.
            </p>
          </div>
          <div className="px-4 py-2 bg-accent-sage/20 border border-accent-sage/40 rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-accent-terracotta" /> Total Orders: {orders.length}
          </div>
        </div>

        {/* Detailed Orders Feed */}
        <div className="space-y-6">
          {orders.map((o) => {
            const addr = o.shippingAddress as Record<string, string> | null
            return (
              <div key={o.id} className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-foreground">{o.orderNumber}</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Payment: {o.paymentStatus}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                        Fulfillment: {o.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-accent-terracotta" />
                      Booked on: {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Order Total</span>
                    <p className="font-serif text-2xl font-bold text-foreground">{formatPrice(o.totalCents)}</p>
                  </div>
                </div>

                {/* Grid Content: Items + Customer & Shipping Info */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Itemized Booked Products */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-accent-terracotta" /> Booked Items ({o.items.length})
                    </h4>
                    <div className="divide-y divide-border/60 bg-muted/40 rounded-2xl border border-border p-4 space-y-3">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 pt-3 first:pt-0">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif font-bold text-sm text-foreground truncate">{item.title}</h5>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.priceCents)}</p>
                          </div>
                          <div className="font-semibold text-sm text-foreground font-mono">
                            {formatPrice(item.priceCents * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info & Shipping Address */}
                  <div className="lg:col-span-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-accent-terracotta" /> Customer & Shipping Info
                    </h4>
                    <div className="bg-muted/40 rounded-2xl border border-border p-4 space-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground uppercase font-semibold text-[10px]">Booked By (Email)</span>
                        <p className="font-semibold text-foreground text-sm font-mono mt-0.5">{o.userEmail}</p>
                      </div>

                      {addr && (
                        <div className="pt-2 border-t border-border/60">
                          <span className="text-muted-foreground uppercase font-semibold text-[10px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent-terracotta" /> Delivery Address
                          </span>
                          <p className="font-medium text-foreground mt-1 leading-relaxed">
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
