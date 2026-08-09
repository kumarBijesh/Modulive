'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Truck, CheckCircle2, Clock, MapPin, User, Search, ShieldCheck, ArrowRight } from 'lucide-react'

export interface CustomerPortalClientProps {
  user: { name: string; email: string; role: string }
  initialOrders: any[]
}

export function CustomerPortalClient({ user, initialOrders }: CustomerPortalClientProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'track' | 'profile'>('orders')
  const [trackQuery, setTrackQuery] = useState('')
  const [foundOrder, setFoundOrder] = useState<any | null>(null)
  const [trackError, setTrackError] = useState('')

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setTrackError('')
    setFoundOrder(null)

    const query = trackQuery.trim().toUpperCase()
    if (!query) return

    const match = initialOrders.find(
      (o) => o.orderNumber.toUpperCase() === query || o.id.toUpperCase() === query
    )

    if (match) {
      setFoundOrder(match)
    } else {
      setTrackError(`No active booking found matching order reference "${trackQuery}". Please check your code (e.g. MS-894210-402).`)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Customer Portal Navigation Tabs (Compact & Responsive on Mobile) */}
      <div className="flex items-center gap-1 sm:gap-2 bg-card border border-border p-1.5 rounded-xl sm:rounded-2xl shadow-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-stone-700 hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bookings & Orders ({initialOrders.length})</span>
          <span className="sm:hidden">Bookings ({initialOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
            activeTab === 'track'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-stone-700 hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Track Booking</span>
          <span className="sm:hidden">Track</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-foreground text-background shadow-xs'
              : 'text-stone-700 hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Saved Profile</span>
          <span className="sm:hidden">Profile</span>
        </button>
      </div>

      {/* Tab 1: Bookings & Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4 sm:space-y-6">
          {initialOrders.length === 0 ? (
            <div className="bg-card border border-border rounded-xl sm:rounded-3xl p-6 sm:p-12 text-center space-y-3 sm:space-y-4 shadow-xs">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-accent-terracotta/40 mx-auto" />
              <h3 className="font-serif text-base sm:text-xl font-semibold text-foreground">No furniture bookings found</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                Explore our architectural catalog of sculptural armchairs, oak dining tables, and lighting to place your first booking.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-foreground text-background text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-accent-warm hover:text-white transition-all shadow-sm"
              >
                Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            initialOrders.map((order) => {
              const addr = order.shippingAddress as Record<string, string> | null
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 shadow-xs">
                  
                  {/* Order Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-border">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-mono font-bold text-sm sm:text-lg text-foreground tracking-tight">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase border ${getStatusBadgeClass(order.status)}`}>
                          STATUS: {order.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold uppercase border border-emerald-300">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Booked on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Total Paid</span>
                      <p className="font-serif text-lg sm:text-2xl font-bold text-foreground">{formatPrice(order.totalCents)}</p>
                    </div>
                  </div>

                  {/* Delivery Progress Timeline Bar (2-Cols on Mobile, 4-Cols on Tablet+) */}
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-stone-600 block">Delivery Progress Timeline</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center space-y-0.5 sm:space-y-1 border ${order.status ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-muted border-border text-muted-foreground'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-emerald-600" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase block leading-tight">Confirmed</span>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center space-y-0.5 sm:space-y-1 border ${order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-muted border-border text-muted-foreground'}`}>
                        <Clock className="w-3.5 h-3.5 mx-auto text-amber-600" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase block leading-tight">Crafting</span>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center space-y-0.5 sm:space-y-1 border ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-muted border-border text-muted-foreground'}`}>
                        <Truck className="w-3.5 h-3.5 mx-auto text-blue-600" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase block leading-tight">In Transit</span>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center space-y-0.5 sm:space-y-1 border ${order.status === 'DELIVERED' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-muted border-border text-muted-foreground'}`}>
                        <Package className="w-3.5 h-3.5 mx-auto text-stone-600" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase block leading-tight">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Booked Items List & Delivery Address */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 pt-1">
                    
                    {/* Item List */}
                    <div className="lg:col-span-7 space-y-2">
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-stone-600 block">Booked Items ({order.items.length})</span>
                      <div className="divide-y divide-border/60 bg-muted/40 rounded-xl border border-border p-2.5 sm:p-3 space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2.5 sm:gap-3 pt-2 first:pt-0">
                            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-2">{item.title}</h5>
                              <p className="text-[10px] sm:text-[11px] text-stone-600 mt-0.5">Qty: {item.quantity} × {formatPrice(item.priceCents)}</p>
                            </div>
                            <div className="font-semibold text-xs sm:text-sm text-foreground font-mono shrink-0">
                              {formatPrice(item.priceCents * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address Card */}
                    <div className="lg:col-span-5 space-y-2">
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-stone-600 block">Shipping Destination</span>
                      <div className="bg-muted/40 rounded-xl border border-border p-3 space-y-1.5 text-xs">
                        <p className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-accent-terracotta shrink-0" /> {order.userName || user.name}
                        </p>
                        <p className="text-stone-700 leading-relaxed font-medium pl-5 text-xs">
                          {addr?.street || '742 Design Quarter Ave'}<br />
                          {addr?.city || 'New York'}, {addr?.state || 'NY'} {addr?.postalCode || '10001'}<br />
                          {addr?.country || 'United States'}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              )
            })
          )}
        </div>
      )}

      {/* Tab 2: Track Order Search Lookup */}
      {activeTab === 'track' && (
        <div className="bg-card border border-border rounded-xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base sm:text-xl text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-accent-terracotta" /> Track Your Booking Status
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Enter your booking reference code (e.g. <strong className="font-mono text-foreground font-semibold">MS-894210-402</strong>) to get live shipping progress.
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-lg">
            <input
              type="text"
              placeholder="e.g. MS-894210-402"
              required
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-background border border-border rounded-full text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground shadow-xs"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-foreground text-background font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-accent-warm hover:text-white transition-all shadow-xs shrink-0"
            >
              Track Order
            </button>
          </form>

          {trackError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
              {trackError}
            </div>
          )}

          {foundOrder && (
            <div className="bg-muted/40 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xs animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-terracotta block">Match Found</span>
                  <h4 className="font-mono font-bold text-sm sm:text-base text-foreground">{foundOrder.orderNumber}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase border ${getStatusBadgeClass(foundOrder.status)}`}>
                  {foundOrder.status}
                </span>
              </div>
              <div className="text-xs text-stone-700 space-y-1 font-medium">
                <p>Items Booked: {foundOrder.items.length} piece(s)</p>
                <p>Total Paid: <strong className="text-foreground">{formatPrice(foundOrder.totalCents)}</strong></p>
                <p>Booked Date: {new Date(foundOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Profile & Preferences */}
      {activeTab === 'profile' && (
        <div className="bg-card border border-border rounded-xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
          <h3 className="font-serif font-bold text-base sm:text-xl text-foreground flex items-center gap-2 border-b border-border pb-3 sm:pb-4">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-accent-terracotta" /> Saved Account Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
            <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Customer Full Name</span>
              <p className="font-semibold text-foreground text-xs sm:text-sm">{user.name}</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Primary Contact Email</span>
              <p className="font-semibold text-foreground text-xs sm:text-sm font-mono break-all">{user.email}</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Account Security Status</span>
              <p className="font-semibold text-emerald-700 text-xs flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Authenticated & Encrypted Session
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Account Permission Role</span>
              <p className="font-semibold text-foreground text-xs uppercase font-mono">{user.role}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
