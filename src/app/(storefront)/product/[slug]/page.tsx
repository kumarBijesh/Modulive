import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { getProductBySlugAction, getProductsAction } from '@/actions/product-actions'
import { ProductDetailInteractive } from './ProductDetailInteractive'
import { ProductCard } from '@/components/storefront/ProductCard'
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react'

export interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const res = await getProductBySlugAction(slug)

  if (!res.success || !res.product) {
    notFound()
  }

  const product = res.product
  const relatedRes = await getProductsAction({ categorySlug: product.category.slug })
  const relatedProducts = (relatedRes.success && 'products' in relatedRes ? relatedRes.products : []).filter((p: any) => p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold line-clamp-1">{product.title}</span>
        </nav>

        {/* Product Interactive Main View */}
        <ProductDetailInteractive product={product} />

        {/* Technical Specs & Material Highlights */}
        <section className="mt-20 pt-12 border-t border-border grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Craft & Engineering
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Material & Craftsmanship
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every Modulive piece is engineered to last for generations. Kiln-dried hardwood frames prevent warping, while high-resilience memory foam cushions maintain structural memory.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-accent-terracotta" />
                <span className="text-sm font-semibold text-foreground">10-Year Structural Frame Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-accent-terracotta" />
                <span className="text-sm font-semibold text-foreground">100% FSC-Certified Sustainable Hardwood</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
            <h4 className="font-serif font-semibold text-lg text-foreground border-b border-border pb-4">
              Specifications
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="text-xs uppercase font-semibold text-muted-foreground">Dimensions</dt>
                <dd className="font-medium text-foreground mt-1">{product.dimensions || 'Standard architectural proportions'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase font-semibold text-muted-foreground">Material</dt>
                <dd className="font-medium text-foreground mt-1">{product.material || 'Solid hardwood & Italian upholstery'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase font-semibold text-muted-foreground">Color / Finish</dt>
                <dd className="font-medium text-foreground mt-1">{product.color || 'Natural Finish'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase font-semibold text-muted-foreground">Assembly</dt>
                <dd className="font-medium text-foreground mt-1">Fully Assembled / White Glove Service</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-bold text-foreground">Complete the Interior</h3>
              <Link href={`/shop?category=${product.category.slug}`} className="text-sm font-semibold text-accent-terracotta hover:underline">
                View all in {product.category.name}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item: any) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
