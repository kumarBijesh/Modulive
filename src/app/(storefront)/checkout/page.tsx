import React from 'react'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { getCartAction } from '@/actions/cart-actions'
import { CheckoutFormInteractive } from './CheckoutFormInteractive'

export default async function CheckoutPage() {
  const cartData = await getCartAction()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8 text-center max-w-lg mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Secure Server-Side Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Shipping & Payment
          </h1>
        </div>

        <CheckoutFormInteractive cart={cartData as any} />
      </main>

      <Footer />
    </div>
  )
}
