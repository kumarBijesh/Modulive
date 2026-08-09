import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { ProductCard } from '@/components/storefront/ProductCard'
import { getProductsAction, getCategoriesAction } from '@/actions/product-actions'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

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
  const products = productsRes.products || []
  const categories = categoriesRes.categories || []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header Title */}
        <div className="space-y-4 mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Storefront Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            Architectural Furniture
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Explore our curated catalog of sculptural seating, oak dining tables, mouth-blown lighting, and modular walnut credenzas.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
              <Link
                href="/shop"
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  !categorySlug
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    categorySlug === cat.slug
                      ? 'bg-foreground text-background shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs font-semibold uppercase text-muted-foreground hidden sm:inline">Sort:</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}sort=featured`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortBy === 'featured' ? 'bg-accent-warm text-white font-semibold' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Featured
                </Link>
                <Link
                  href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}sort=price-asc`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortBy === 'price-asc' ? 'bg-accent-warm text-white font-semibold' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}sort=price-desc`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    sortBy === 'price-desc' ? 'bg-accent-warm text-white font-semibold' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground">
          <span>Showing <strong className="text-foreground font-semibold">{products.length}</strong> architectural pieces</span>
          {categorySlug && (
            <Link href="/shop" className="text-accent-terracotta hover:underline font-semibold">
              Clear Category Filter
            </Link>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center space-y-4 my-12">
            <h3 className="font-serif text-xl font-semibold text-foreground">No furniture pieces match your search</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Try adjusting your category filter or search keywords.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-foreground text-background text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-accent-warm hover:text-white transition-all"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
