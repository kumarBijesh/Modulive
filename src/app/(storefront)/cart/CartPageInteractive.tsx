'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { updateCartQuantityAction, removeFromCartAction } from '@/actions/cart-actions'

export interface CartPageInteractiveProps {
  initialCart: {
    items: Array<{ productId: string; title: string; priceCents: number; quantity: number; image: string; maxStock: number }>
    subtotalCents: number
    shippingCents: number
    taxCents: number
    totalCents: number
  }
}

export function CartPageInteractive({ initialCart }: CartPageInteractiveProps) {
  const [cart, setCart] = useState(initialCart)

  const handleUpdate = async (productId: string, newQty: number) => {
    const res = await updateCartQuantityAction(productId, newQty)
    setCart(res as any)
  }

  const handleRemove = async (productId: string) => {
    const res = await removeFromCartAction(productId)
    setCart(res as any)
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-foreground">Your shopping bag is empty</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Explore our collection of sculptural chairs, solid oak tables, and architectural floor lamps.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Items Table */}
      <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-border pb-4 hidden sm:grid grid-cols-12 text-xs font-semibold uppercase text-muted-foreground">
          <span className="col-span-6">Product</span>
          <span className="col-span-3 text-center">Quantity</span>
          <span className="col-span-3 text-right">Total</span>
        </div>

        <div className="divide-y divide-border/60">
          {cart.items.map((item) => (
            <div key={item.productId} className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 flex items-center gap-4 w-full">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                  <Image src={item.image} alt={item.title} fill className="object-cover object-center" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-semibold text-base text-foreground line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-accent-terracotta font-semibold">{formatPrice(item.priceCents)}</p>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-xs text-muted-foreground hover:text-red-600 flex items-center gap-1 transition-colors pt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              <div className="sm:col-span-3 flex justify-center w-full sm:w-auto">
                <div className="flex items-center border border-border rounded-full bg-white px-3 py-1.5">
                  <button
                    onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-3 text-right w-full sm:w-auto">
                <span className="font-serif font-semibold text-base text-foreground">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
        <h3 className="font-serif font-bold text-xl text-foreground border-b border-border pb-4">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground font-medium">{formatPrice(cart.subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Shipping</span>
            <span className="text-foreground font-medium">
              {cart.shippingCents === 0 ? 'FREE' : formatPrice(cart.shippingCents)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Tax (8%)</span>
            <span className="text-foreground font-medium">{formatPrice(cart.taxCents)}</span>
          </div>

          <div className="pt-4 border-t border-border flex justify-between text-lg font-serif font-bold text-foreground">
            <span>Total</span>
            <span className="text-accent-terracotta">{formatPrice(cart.totalCents)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="w-full py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
        >
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          🔒 Encrypted SSL Checkout & Stripe Test Payment Mode
        </p>
      </div>
    </div>
  )
}
