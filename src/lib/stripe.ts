import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_MockKeyForDevelopmentMode'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
  typescript: true,
})

export async function createStripeTestCheckoutSession(options: {
  orderId: string
  orderNumber: string
  items: Array<{ title: string; priceCents: number; quantity: number }>
  customerEmail?: string
  successUrl: string
  cancelUrl: string
}) {
  const isMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('Mock')

  if (isMock) {
    // Local developer test mode fallback
    const mockSessionId = `cs_test_mock_${Date.now()}`
    const mockUrl = `${options.successUrl}?session_id=${mockSessionId}&orderId=${options.orderId}`
    return {
      id: mockSessionId,
      url: mockUrl,
    }
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = options.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
      },
      unit_amount: item.priceCents,
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: options.customerEmail,
    line_items: lineItems,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    metadata: {
      orderId: options.orderId,
      orderNumber: options.orderNumber,
    },
  })

  return {
    id: session.id,
    url: session.url,
  }
}
