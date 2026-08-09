import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { getCartAction } from '@/actions/cart-actions'
import { CartPageInteractive } from './CartPageInteractive'

export default async function CartPage() {
  const cartData = await getCartAction()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Your Order
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-1">
            Shopping Bag
          </h1>
        </div>

        <CartPageInteractive initialCart={cartData as any} />
      </main>

      <Footer />
    </div>
  )
}
