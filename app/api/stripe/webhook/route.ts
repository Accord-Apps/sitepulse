import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 400 });
  }

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    console.error('Webhook signature verification failed:', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('✅ Subscription checkout completed for customer:', session.customer);
      // Here you can provision the customer subscription in your database
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('⚠️ Subscription canceled:', subscription.id);
      break;
    }
    case 'invoice.payment_succeeded': {
      console.log('💰 Recurring payment succeeded!');
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
