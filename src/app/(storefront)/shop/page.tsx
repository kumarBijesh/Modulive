import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { ProductCard } from '@/components/storefront/ProductCard'
import { CatalogControls } from '@/components/storefront/CatalogControls'
import { getProductsAction, getCategoriesAction } from '@/actions/product-actions'

export interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const categorySlug = params.category
  const searchQuery = params.search
  const sortBy = (params.sort as any) || 'featured'
  const minPriceCents = params.minPrice ? parseInt(params.minPrice) * 100 : undefined
  const maxPriceCents = params.maxPrice ? parseInt(params.maxPrice) * 100 : undefined

  const productsRes = await getProductsAction({
    categorySlug,
    searchQuery,
    sortBy,
    minPriceCents,
    maxPriceCents,
  })

  const categoriesRes = await getCategoriesAction()
  const products = productsRes.success && 'products' in productsRes ? productsRes.products : []
  const categories = categoriesRes.success && 'categories' in categoriesRes ? categoriesRes.categories : []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full">
        {/* Header Title Banner */}
        <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Storefront Catalog
          </span>
          <h1 className="text-2xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            Architectural Furniture
          </h1>
          <p className="text-stone-700 font-medium text-xs sm:text-sm max-w-xl leading-relaxed">
            Explore our curated catalog of sculptural seating, oak dining tables, mouth-blown lighting, and modular walnut credenzas.
          </p>
        </div>

        {/* Filter Controls & Sort Dropdown Bar */}
        <CatalogControls
          categories={categories}
          selectedCategory={categorySlug}
          selectedSort={sortBy}
        />

        {/* Results Counter & Clear Filter */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 text-xs text-stone-600">
          <span>Showing <strong className="text-foreground font-semibold">{products.length}</strong> pieces</span>
          {categorySlug && (
            <Link href="/shop" className="text-accent-terracotta hover:underline font-semibold text-xs shrink-0">
              Clear Filter
            </Link>
          )}
        </div>

        {/* Product Grid (2-Column on Mobile, 3 on Tablet, 4 on Desktop) */}
        {products.length === 0 ? (
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center space-y-3 sm:space-y-4 my-6 sm:my-12">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">No furniture pieces match your search</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
              Try adjusting your category filter or search keywords.
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-foreground text-background text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-accent-warm hover:text-white transition-all"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
