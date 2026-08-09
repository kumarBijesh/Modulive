'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { getCartAction, updateCartQuantityAction, removeFromCartAction } from '@/actions/cart-actions'

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCartChange?: () => void
}

export function CartDrawer({ isOpen, onClose, onCartChange }: CartDrawerProps) {
  const [cartData, setCartData] = useState<{
    items: Array<{ productId: string; title: string; priceCents: number; quantity: number; image: string; maxStock: number }>
    subtotalCents: number
    shippingCents: number
    totalCents: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const loadCart = async () => {
    setLoading(true)
    const data = await getCartAction()
    setCartData(data as any)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  const handleUpdateQty = async (productId: string, newQty: number) => {
    const res = await updateCartQuantityAction(productId, newQty)
    setCartData(res as any)
    if (onCartChange) onCartChange()
  }

  const handleRemove = async (productId: string) => {
    const res = await removeFromCartAction(productId)
    setCartData(res as any)
    if (onCartChange) onCartChange()
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-terracotta" />
              <h3 className="font-serif font-semibold text-lg text-foreground">Your Shopping Bag</h3>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {!cartData || cartData.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-foreground">Your bag is currently empty</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Discover our architectural furniture collection and start building your space.
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="px-6 py-3 bg-foreground text-background rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-accent-warm hover:text-white transition-all"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              cartData.items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-3 border-b border-border/60 last:border-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                    <Image src={item.image} alt={item.title} fill className="object-cover object-center" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-foreground line-clamp-1">{item.title}</h4>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-accent-terracotta mt-1">{formatPrice(item.priceCents)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border rounded-full bg-white px-2 py-1">
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cartData && cartData.items.length > 0 && (
            <div className="p-6 border-t border-border bg-card space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">{formatPrice(cartData.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span className="text-foreground font-medium">
                    {cartData.shippingCents === 0 ? 'FREE' : formatPrice(cartData.shippingCents)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(cartData.totalCents)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
