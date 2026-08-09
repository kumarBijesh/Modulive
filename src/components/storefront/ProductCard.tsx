'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Check, Eye } from 'lucide-react'
import { addToCartAction } from '@/actions/cart-actions'

export interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    priceCents: number
    compareAtCents?: number | null
    images: string[]
    category?: { name: string; slug: string }
    isFeatured?: boolean
    stock: number
  }
  onAddedToCart?: () => void
}

export function ProductCard({ product, onAddedToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    const res = await addToCartAction(product.id, 1)
    setIsAdding(false)

    if (res.success) {
      setJustAdded(true)
      if (onAddedToCart) onAddedToCart()
      setTimeout(() => setJustAdded(false), 2000)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  return (
    <div className="group relative bg-card rounded-2xl border border-border p-3 transition-all duration-300 hover:shadow-hover hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Compare At Badge */}
        {product.compareAtCents && (
          <span className="absolute top-3 left-3 bg-accent-terracotta text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Sale
          </span>
        )}

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="p-3 bg-white text-foreground rounded-full hover:bg-foreground hover:text-white transition-colors shadow-md"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || product.stock === 0}
            className="p-3 bg-white text-foreground rounded-full hover:bg-accent-warm hover:text-white transition-colors shadow-md disabled:opacity-50"
            title="Quick Add to Cart"
          >
            {justAdded ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="pt-4 px-1 pb-1 space-y-2">
        {product.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </span>
        )}
        <h3 className="font-serif font-semibold text-base text-foreground line-clamp-1 group-hover:text-accent-terracotta transition-colors">
          <Link href={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm text-foreground">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
