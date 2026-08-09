'use server'

import { mockProducts, mockCategories, prisma, isDatabaseConfigured } from '@/lib/prisma'
import { handleActionError } from '@/lib/errors'

export interface ProductFilterOptions {
  categorySlug?: string
  searchQuery?: string
  minPriceCents?: number
  maxPriceCents?: number
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest'
}

export async function getProductsAction(options: ProductFilterOptions = {}) {
  try {
    let products = [...mockProducts]

    if (isDatabaseConfigured()) {
      try {
        const dbProducts = await prisma.product.findMany({
          where: { status: 'ACTIVE' },
          include: { category: true },
        })
        if (dbProducts.length > 0) {
          products = dbProducts as unknown as typeof mockProducts
        }
      } catch (err) {
        console.warn('Using mock products fallback:', err)
      }
    }

    // Filter by category
    if (options.categorySlug) {
      products = products.filter(
        (p) => p.category.slug.toLowerCase() === options.categorySlug?.toLowerCase()
      )
    }

    // Filter by search query
    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const query = options.searchQuery.toLowerCase().trim()
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.material?.toLowerCase().includes(query) ||
          p.color?.toLowerCase().includes(query)
      )
    }

    // Filter by price range
    if (options.minPriceCents !== undefined) {
      products = products.filter((p) => p.priceCents >= (options.minPriceCents || 0))
    }
    if (options.maxPriceCents !== undefined) {
      products = products.filter((p) => p.priceCents <= (options.maxPriceCents || Infinity))
    }

    // Sorting
    if (options.sortBy === 'price-asc') {
      products.sort((a, b) => a.priceCents - b.priceCents)
    } else if (options.sortBy === 'price-desc') {
      products.sort((a, b) => b.priceCents - a.priceCents)
    } else if (options.sortBy === 'newest') {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      // Default: featured first
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return {
      success: true,
      products,
      total: products.length,
    }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    let product = mockProducts.find((p) => p.slug === slug)

    if (isDatabaseConfigured()) {
      try {
        const dbProduct = await prisma.product.findUnique({
          where: { slug },
          include: { category: true },
        })
        if (dbProduct) {
          product = dbProduct as unknown as typeof mockProducts[0]
        }
      } catch (err) {
        console.warn('Fallback for single product:', err)
      }
    }

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    return { success: true, product }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function getCategoriesAction() {
  try {
    let categories = [...mockCategories]

    if (isDatabaseConfigured()) {
      try {
        const dbCategories = await prisma.category.findMany()
        if (dbCategories.length > 0) {
          categories = dbCategories as unknown as typeof mockCategories
        }
      } catch (err) {
        console.warn('Using mock categories fallback')
      }
    }

    return { success: true, categories }
  } catch (err) {
    return handleActionError(err)
  }
}
