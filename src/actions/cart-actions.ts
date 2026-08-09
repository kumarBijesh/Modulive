'use server'

import { cookies } from 'next/headers'
import { cartItemSchema } from '@/lib/validations'
import { mockProducts, prisma, isDatabaseConfigured } from '@/lib/prisma'
import { AppError, handleActionError } from '@/lib/errors'

export interface CartLineItem {
  productId: string
  title: string
  slug: string
  priceCents: number
  quantity: number
  image: string
  maxStock: number
}

let inMemoryCartCache: CartLineItem[] = []

async function readCartFromCookie(): Promise<CartLineItem[]> {
  try {
    const cookieStore = await cookies()
    const cartCookie = cookieStore.get('mystore_cart')
    if (cartCookie?.value) {
      return JSON.parse(cartCookie.value) as CartLineItem[]
    }
    return []
  } catch (e) {
    // Cookie unmounted context fallback
  }
  return inMemoryCartCache
}

async function writeCartToCookie(items: CartLineItem[]) {
  inMemoryCartCache = items
  try {
    const cookieStore = await cookies()
    cookieStore.set('mystore_cart', JSON.stringify(items), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })
  } catch (e) {
    // Cookie unmounted context fallback
  }
}

export async function getCartAction() {
  const currentCart = await readCartFromCookie()
  const subtotalCents = currentCart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  const shippingCents = subtotalCents > 150000 || currentCart.length === 0 ? 0 : 4900
  const taxCents = Math.round(subtotalCents * 0.08)
  const totalCents = subtotalCents + shippingCents + taxCents

  return {
    success: true,
    items: currentCart,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
  }
}

export async function addToCartAction(productId: string, quantity = 1) {
  try {
    cartItemSchema.parse({ productId, quantity })

    const currentCart = await readCartFromCookie()
    let product: any = mockProducts.find((p) => p.id === productId || p.slug === productId)

    if (!product && isDatabaseConfigured()) {
      try {
        const dbProd = await prisma.product.findFirst({
          where: {
            OR: [{ id: productId }, { slug: productId }],
          },
          include: { category: true },
        })
        if (dbProd) {
          product = {
            id: dbProd.id,
            title: dbProd.title,
            slug: dbProd.slug,
            priceCents: dbProd.priceCents,
            stock: dbProd.stock,
            images: dbProd.images,
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB cart product lookup fallback:', dbErr)
      }
    }

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    if (product.stock < quantity) {
      throw new AppError(`Only ${product.stock} units available in stock`, 400)
    }

    const updatedCart = [...currentCart]
    const existingIndex = updatedCart.findIndex(
      (i) => i.productId === product.id || i.productId === productId || i.slug === product.slug
    )

    if (existingIndex > -1) {
      const newQty = updatedCart[existingIndex].quantity + quantity
      if (newQty > product.stock) {
        throw new AppError(`Cannot add more than total stock (${product.stock})`, 400)
      }
      updatedCart[existingIndex].quantity = newQty
    } else {
      updatedCart.push({
        productId: product.id,
        title: product.title,
        slug: product.slug,
        priceCents: product.priceCents,
        quantity,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        maxStock: product.stock,
      })
    }

    await writeCartToCookie(updatedCart)
    return await getCartAction()
  } catch (err) {
    return handleActionError(err)
  }
}

export async function updateCartQuantityAction(productId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return await removeFromCartAction(productId)
    }

    const currentCart = await readCartFromCookie()
    const updatedCart = currentCart.map((item) => {
      if (item.productId === productId) {
        if (quantity > item.maxStock) {
          throw new AppError(`Cannot exceed stock of ${item.maxStock}`, 400)
        }
        return { ...item, quantity }
      }
      return item
    })

    await writeCartToCookie(updatedCart)
    return await getCartAction()
  } catch (err) {
    return handleActionError(err)
  }
}

export async function removeFromCartAction(productId: string) {
  const currentCart = await readCartFromCookie()
  const updatedCart = currentCart.filter((i) => i.productId !== productId)
  await writeCartToCookie(updatedCart)
  return await getCartAction()
}

export async function clearCartAction() {
  await writeCartToCookie([])
  return await getCartAction()
}
