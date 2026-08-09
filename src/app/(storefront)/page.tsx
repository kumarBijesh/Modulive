import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { Hero } from '@/components/storefront/Hero'
import { ProductCard } from '@/components/storefront/ProductCard'
import { getProductsAction, getCategoriesAction } from '@/actions/product-actions'
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Compass } from 'lucide-react'

export default async function HomePage() {
  const productsRes = await getProductsAction({ sortBy: 'featured' })
  const categoriesRes = await getCategoriesAction()

  const featuredProducts = (productsRes.success && 'products' in productsRes ? productsRes.products : []).slice(0, 4)
  const categories = categoriesRes.success && 'categories' in categoriesRes ? categoriesRes.categories : []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Flagship Editorial Hero */}
        <Hero />

        {/* Categories Showcase */}
        <section className="py-20 bg-muted/50 border-y border-border/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
                  Curated Collections
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-2">
                  Browse by category.
                </h2>
              </div>
              <Link
                href="/shop"
                className="mt-4 md:mt-0 text-sm font-semibold text-foreground hover:text-accent-terracotta flex items-center gap-1 transition-colors"
              >
                View all categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card border border-border bg-card"
                >
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <h3 className="font-serif text-xl font-semibold tracking-wide">{cat.name}</h3>
                    <p className="text-xs text-white/80 line-clamp-2">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
                Architectural Icons
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                Featured releases.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Each piece is sculpted from natural materials, hand-finished by master craftspeople for enduring comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
              >
                Explore Entire Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Editorial Brand Craftsmanship Banner */}
        <section className="py-24 bg-foreground text-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent-warm">
                  Design Philosophy
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight text-white">
                  Crafted with intent & sustainable timber.
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We believe true luxury resides in restraint. By pairing raw European oak with soft Italian bouclé and honed stone, Modulive creates quiet sanctuaries inside modern homes.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/15 text-sm">
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-white">Zero Harm Finishes</h4>
                    <p className="text-xs text-muted-foreground mt-1">VOC-free natural oils & water-based lacquers.</p>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-white">Ethical Craft</h4>
                    <p className="text-xs text-muted-foreground mt-1">Made in certified Danish & Italian workshops.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80"
                  alt="Craftsmanship detail"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Value Props */}
        <section className="py-16 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent-sage/20 text-accent-terracotta">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground">Complimentary Freight</h4>
                  <p className="text-xs text-muted-foreground mt-1">White-glove delivery on orders over $1,500.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent-sage/20 text-accent-terracotta">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground">10-Year Guarantee</h4>
                  <p className="text-xs text-muted-foreground mt-1">Comprehensive structural warranty on frames.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent-sage/20 text-accent-terracotta">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground">30-Day In-Home Trial</h4>
                  <p className="text-xs text-muted-foreground mt-1">Love it in your space or return effortlessly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent-sage/20 text-accent-terracotta">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground">Design Consultation</h4>
                  <p className="text-xs text-muted-foreground mt-1">Complimentary 3D room planning sessions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
