import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { logAuditEvent } from '@/lib/security/audit-logger'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_MockStripeWebhookSecretForLocalDevTestMode000000'

  let event

  try {
    if (signature && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('Mock')) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // Local developer test event parsing fallback
      event = JSON.parse(body)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown signature error'
    console.error(`⚠️ Webhook signature verification failed: ${message}`)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // Handle Event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      await logAuditEvent({
        action: 'STRIPE_WEBHOOK_PAYMENT_CONFIRMED',
        resource: 'StripeWebhook',
        details: { orderId, stripeSessionId: session.id, amountTotal: session.amount_total },
      })
      break
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object
      await logAuditEvent({
        action: 'STRIPE_PAYMENT_INTENT_SUCCEEDED',
        resource: 'StripeWebhook',
        details: { paymentIntentId: paymentIntent.id },
      })
      break
    }
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
