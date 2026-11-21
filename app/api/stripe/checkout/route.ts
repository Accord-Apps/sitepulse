import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // fallback if body is empty or malformed
    }
    const plan = (body?.plan as 'starter' | 'pro') || 'pro';
    const email = body?.email;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const selectedPlan = PLANS[plan] || PLANS.pro;

    // If Stripe is configured with a real Secret Key:
    if (stripe && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...')) {
      const lineItem = selectedPlan.priceId
        ? { price: selectedPlan.priceId, quantity: 1 }
        : {
            price_data: {
              currency: 'usd',
              product_data: {
                name: selectedPlan.name,
                description: `AuditFlow Automated Speed & SEO Monitoring (${selectedPlan.monitoredSitesLimit} sites)`,
              },
              unit_amount: selectedPlan.price * 100, // cents ($1900 or $3900)
              recurring: { interval: 'month' as const },
            },
            quantity: 1,
          };

      const session = await stripe.checkout.sessions.create({
        line_items: [lineItem as any],
        mode: 'subscription',
        success_url: `${appUrl}/dashboard?payment=success&plan=${plan}`,
        cancel_url: `${appUrl}/#pricing`,
        customer_email: email || undefined,
        billing_address_collection: 'auto',
      });

      return NextResponse.json({ url: session.url, isDemo: false });
    }

    // Sandbox / Simulator Mode (When user hasn't set Stripe keys yet):
    // Allows testing the subscriber experience and UI instantly!
    return NextResponse.json({
      url: `${appUrl}/dashboard?payment=demo_success&plan=${plan}`,
      isDemo: true,
      message: 'Running in sandbox mode. Add your STRIPE_SECRET_KEY to .env.local to collect real payments.',
    });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
