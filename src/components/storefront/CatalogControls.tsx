'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, ArrowUpDown } from 'lucide-react'

export interface CatalogControlsProps {
  categories: Array<{ id: string; name: string; slug: string }>
  selectedCategory?: string
  selectedSort: string
}

export function CatalogControls({
  categories,
  selectedCategory,
  selectedSort,
}: CatalogControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (val) {
      current.set('category', val)
    } else {
      current.delete('category')
    }
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`/shop${query}`)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (val && val !== 'featured') {
      current.set('sort', val)
    } else {
      current.delete('sort')
    }
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`/shop${query}`)
  }

  return (
    <div className="bg-card border border-border p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs mb-6 sm:mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        
        {/* Category Dropdown Select */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-accent-terracotta pointer-events-none">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            className="w-full bg-background border border-border focus:border-accent-terracotta text-foreground text-xs sm:text-sm font-medium rounded-full pl-10 pr-8 py-2.5 sm:py-3 appearance-none cursor-pointer focus:outline-none transition-colors shadow-xs"
            aria-label="Filter by Category"
          >
            <option value="">Category: All Products</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                Category: {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 text-muted-foreground pointer-events-none text-xs">
            ▼
          </div>
        </div>

        {/* Sort By Dropdown Select */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-accent-terracotta pointer-events-none">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            value={selectedSort || 'featured'}
            onChange={handleSortChange}
            className="w-full bg-background border border-border focus:border-accent-terracotta text-foreground text-xs sm:text-sm font-medium rounded-full pl-10 pr-8 py-2.5 sm:py-3 appearance-none cursor-pointer focus:outline-none transition-colors shadow-xs"
            aria-label="Sort Products"
          >
            <option value="featured">Sort by: Featured Releases</option>
            <option value="price-asc">Sort by: Price (Low → High)</option>
            <option value="price-desc">Sort by: Price (High → Low)</option>
          </select>
          <div className="absolute right-3.5 text-muted-foreground pointer-events-none text-xs">
            ▼
          </div>
        </div>

      </div>
    </div>
  )
}
