'use server'

import { checkoutSchema } from '@/lib/validations'
import { getCartAction, clearCartAction } from './cart-actions'
import { createStripeTestCheckoutSession } from '@/lib/stripe'
import { logAuditEvent } from '@/lib/security/audit-logger'
import { getMockSession } from '@/lib/auth'
import { prisma, isDatabaseConfigured } from '@/lib/prisma'
import { AppError, handleActionError } from '@/lib/errors'

export interface OrderRecord {
  id: string
  orderNumber: string
  userEmail: string
  userName?: string
  items: Array<{ title: string; priceCents: number; quantity: number; image: string }>
  subtotalCents: number
  shippingCents: number
  taxCents: number
  totalCents: number
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED'
  shippingAddress: unknown
  createdAt: Date
}

const mockOrders: OrderRecord[] = []

export async function createCheckoutSessionAction(formData: unknown) {
  try {
    const validated = checkoutSchema.parse(formData)
    const cart = await getCartAction()

    if (!cart.items || cart.items.length === 0) {
      throw new AppError('Your shopping cart is empty', 400)
    }

    const sessionUser = await getMockSession()
    const email = sessionUser?.email || validated.guestEmail

    if (!email) {
      throw new AppError('An email address is required for order confirmation', 400)
    }

    const userName = sessionUser?.name || (validated.address as { fullName?: string })?.fullName || email.split('@')[0]

    // Generate unique order number
    const orderNumber = `MS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`
    const orderId = `ord-${Date.now()}`

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      userEmail: email,
      userName,
      items: cart.items.map((i) => ({
        title: i.title,
        priceCents: i.priceCents,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotalCents: cart.subtotalCents,
      shippingCents: cart.shippingCents,
      taxCents: cart.taxCents,
      totalCents: cart.totalCents,
      status: 'PAID', // Direct confirmation in test mode
      paymentStatus: 'PAID',
      shippingAddress: {
        ...(validated.address as object),
        fullName: userName,
      },
      createdAt: new Date(),
    }

    mockOrders.unshift(newOrder)

    // Save order into MongoDB Atlas database if configured
    if (isDatabaseConfigured()) {
      try {
        await prisma.order.create({
          data: {
            orderNumber,
            guestEmail: email,
            totalCents: cart.totalCents,
            status: 'PAID',
            paymentStatus: 'PAID',
            shippingAddress: validated.address as object,
            items: {
              create: cart.items.map((i) => ({
                titleSnapshot: i.title,
                priceCents: i.priceCents,
                quantity: i.quantity,
                imageSnapshot: i.image,
                productId: i.productId.length === 24 ? i.productId : '60d5ecb8b5c9c92b3c7b3b3b',
              })),
            },
          },
        })
      } catch (dbErr) {
        console.warn('Order MongoDB persistence fallback:', dbErr)
      }
    }

    // Log security audit event
    await logAuditEvent({
      userId: sessionUser?.id,
      userEmail: email,
      action: 'ORDER_CREATED',
      resource: 'Orders',
      details: { orderNumber, totalCents: cart.totalCents, itemCount: cart.items.length },
    })

    // Initiate Stripe test checkout session
    const stripeSession = await createStripeTestCheckoutSession({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      items: newOrder.items,
      customerEmail: email,
      successUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success`,
      cancelUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/cart`,
    })

    // Clear cart after checkout
    await clearCartAction()

    return {
      success: true,
      orderNumber,
      orderId: newOrder.id,
      checkoutUrl: stripeSession.url,
    }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function getOrdersAction() {
  const session = await getMockSession()
  if (!session) {
    return { success: false, error: 'Authentication required' }
  }

  let dbOrders: OrderRecord[] = []

  if (isDatabaseConfigured()) {
    try {
      const dbRes = await prisma.order.findMany({
        where: session.role === 'SUPER_ADMIN' || session.role === 'ADMIN' ? {} : { guestEmail: session.email },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      })
      if (dbRes.length > 0) {
        dbOrders = dbRes.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          userEmail: o.guestEmail || session.email,
          items: o.items.map((i) => ({
            title: i.titleSnapshot,
            priceCents: i.priceCents,
            quantity: i.quantity,
            image: i.imageSnapshot || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          })),
          subtotalCents: o.totalCents,
          shippingCents: 0,
          taxCents: 0,
          totalCents: o.totalCents,
          status: o.status as OrderRecord['status'],
          paymentStatus: o.paymentStatus as OrderRecord['paymentStatus'],
          shippingAddress: o.shippingAddress,
          createdAt: o.createdAt,
        }))
      }
    } catch (dbErr) {
      console.warn('MongoDB order fetch fallback:', dbErr)
    }
  }

  const fallbackUserOrders = session.role === 'SUPER_ADMIN' || session.role === 'ADMIN'
    ? mockOrders
    : mockOrders.filter((o) => o.userEmail === session.email)

  const combinedOrders = [...dbOrders, ...fallbackUserOrders]
  // Remove duplicates by orderNumber
  const uniqueOrders = Array.from(new Map(combinedOrders.map((o) => [o.orderNumber, o])).values())

  return { success: true, orders: uniqueOrders }
}

export async function getOrderByIdAction(orderId: string) {
  const order = mockOrders.find((o) => o.id === orderId)
  if (!order) {
    return { success: false, error: 'Order not found' }
  }
  return { success: true, order }
}
