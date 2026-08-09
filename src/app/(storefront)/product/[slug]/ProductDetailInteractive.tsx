'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react'
import { addToCartAction } from '@/actions/cart-actions'
import { CartDrawer } from '@/components/storefront/CartDrawer'

export interface ProductDetailInteractiveProps {
  product: {
    id: string
    title: string
    priceCents: number
    compareAtCents?: number | null
    description: string
    stock: number
    images: string[]
    dimensions?: string | null
    material?: string | null
    color?: string | null
    category: { name: string }
  }
}

export function ProductDetailInteractive({ product }: ProductDetailInteractiveProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    const res = await addToCartAction(product.id, quantity)
    setIsAdding(false)

    if (res.success) {
      setAddedSuccess(true)
      setIsCartOpen(true)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('cart-updated', {
            detail: { title: product.title, quantity },
          })
        )
      }
      setTimeout(() => setAddedSuccess(false), 3000)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card border border-border bg-muted">
            <Image
              src={selectedImage || product.images[0]}
              alt={product.title}
              fill
              priority
              className="object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img ? 'border-accent-terracotta scale-95' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details & Add to Cart */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              {product.category.name}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground mt-1 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 sm:gap-4 mt-3 sm:mt-4">
              <span className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                {formatPrice(product.priceCents)}
              </span>
              {product.compareAtCents && (
                <span className="text-sm sm:text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAtCents)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Key Attributes */}
          <div className="space-y-2.5 py-4 border-y border-border text-xs">
            {product.color && (
              <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground uppercase text-[10px] sm:text-xs">Color / Finish</span>
                <span className="font-medium text-foreground">{product.color}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between">
                <span className="font-semibold text-muted-foreground uppercase text-[10px] sm:text-xs">Material</span>
                <span className="font-medium text-foreground">{product.material}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold text-muted-foreground uppercase text-[10px] sm:text-xs">Availability</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-between sm:justify-start border border-border rounded-full bg-white px-3.5 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className="flex-1 py-3.5 sm:py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all shadow-md disabled:opacity-50"
              >
                {isAdding ? (
                  <span>Adding...</span>
                ) : addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart — {formatPrice(product.priceCents * quantity)}
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-foreground shrink-0" />
                <span>Complimentary Freight</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-foreground shrink-0" />
                <span>10-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer Trigger */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
