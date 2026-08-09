'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createCheckoutSessionAction } from '@/actions/checkout-actions'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { Lock, CreditCard } from 'lucide-react'

export interface CheckoutFormInteractiveProps {
  cart: {
    items: Array<{ productId: string; title: string; priceCents: number; quantity: number; image: string }>
    subtotalCents: number
    shippingCents: number
    taxCents: number
    totalCents: number
  }
}

export function CheckoutFormInteractive({ cart }: CheckoutFormInteractiveProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    guestEmail: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  })

  useEffect(() => {
    getCurrentUserAction().then((user) => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: user.name || '',
          guestEmail: user.email || '',
        }))
      }
    })
  }, [])

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await createCheckoutSessionAction({
      guestEmail: formData.guestEmail,
      address: {
        ...formData.address,
        fullName: formData.fullName,
      },
    })
    setLoading(false)

    if (res.success && res.checkoutUrl) {
      router.push(res.checkoutUrl)
    } else {
      setError('error' in res ? (res as { error: string }).error : 'Failed to initialize checkout')
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your cart is empty. Please add products before checking out.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
      {/* Shipping Address Inputs */}
      <div className="lg:col-span-7 bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-border pb-4">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground">1. Contact & Shipping Address</h3>
          <p className="text-xs text-muted-foreground mt-1">Order confirmations and receipts will be sent to this email.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            placeholder="e.g. Jane Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="e.g. jane@example.com"
            value={formData.guestEmail}
            onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
          />

          <Input
            label="Street Address"
            required
            placeholder="e.g. 123 Main Street, Apt 4B"
            value={formData.address.street}
            onChange={(e) =>
              setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              required
              placeholder="e.g. New York"
              value={formData.address.city}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
              }
            />
            <Input
              label="State / Province"
              required
              placeholder="e.g. NY"
              value={formData.address.state}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              required
              placeholder="e.g. 10001"
              value={formData.address.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })
              }
            />
            <Input
              label="Country"
              required
              placeholder="e.g. United States"
              value={formData.address.country}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })
              }
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <h3 className="font-serif font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent-terracotta" /> 2. Payment Method
          </h3>
          <div className="p-4 rounded-xl bg-accent-sage/20 border border-accent-sage/40 text-xs text-foreground space-y-1">
            <p className="font-semibold text-accent-terracotta">Stripe Test Mode Activated</p>
            <p className="text-muted-foreground">
              You will be redirected to Stripe&apos;s secure test checkout element to complete testing.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary & Submit */}
      <div className="lg:col-span-5 bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs sticky top-24">
        <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground border-b border-border pb-4">
          Order Summary ({cart.items.length} items)
        </h3>

        <div className="divide-y divide-border/60 max-h-60 overflow-y-auto pr-1">
          {cart.items.map((item) => (
            <div key={item.productId} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-serif font-semibold text-foreground line-clamp-1">{item.title}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-foreground">{formatPrice(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm pt-4 border-t border-border">
          <div className="flex justify-between text-muted-foreground text-xs sm:text-sm">
            <span>Subtotal</span>
            <span className="text-foreground font-medium">{formatPrice(cart.subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-xs sm:text-sm">
            <span>Shipping</span>
            <span className="text-foreground font-medium">
              {cart.shippingCents === 0 ? 'FREE' : formatPrice(cart.shippingCents)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground text-xs sm:text-sm">
            <span>Tax</span>
            <span className="text-foreground font-medium">{formatPrice(cart.taxCents)}</span>
          </div>

          <div className="pt-3 border-t border-border flex justify-between text-base sm:text-lg font-serif font-bold text-foreground">
            <span>Total Due</span>
            <span className="text-accent-terracotta">{formatPrice(cart.totalCents)}</span>
          </div>
        </div>

        <Button type="submit" isLoading={loading} className="w-full py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase">
          Pay {formatPrice(cart.totalCents)} with Stripe Test
        </Button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
          <Lock className="w-3.5 h-3.5" />
          <span>Server-side calculated prices & 256-Bit SSL</span>
        </div>
      </div>
    </form>
  )
}
