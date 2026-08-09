import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { CheckCircle2, ArrowRight, PackageCheck } from 'lucide-react'

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string; session_id?: string }> }) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 space-y-6 shadow-card">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            Payment Confirmed (Stripe Test)
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Thank you for your order.
          </h1>

          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            We have received your order and sent a confirmation receipt to your email address. Our white-glove logistics team is preparing your furniture.
          </p>

          <div className="p-4 rounded-2xl bg-muted border border-border text-xs space-y-2 text-left max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase font-semibold">Order Reference:</span>
              <span className="font-mono font-bold text-foreground">MS-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase font-semibold">Fulfillment Status:</span>
              <span className="font-bold text-emerald-700">PAID & PROCESSING</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase font-semibold">Estimated Delivery:</span>
              <span className="font-medium text-foreground">3 - 5 Business Days</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/account"
              className="w-full sm:w-auto px-8 py-4 border border-border hover:border-foreground rounded-full font-semibold text-xs uppercase tracking-wider text-foreground transition-all hover:bg-white"
            >
              View Order History
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
