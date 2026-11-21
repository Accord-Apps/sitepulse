import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

/**
 * Paddle Billing Webhook Handler (Phase 2 - Live Database Sync)
 * 
 * Handles real-time asynchronous subscription and transaction events from Paddle.
 * Supported events:
 * - subscription.created / subscription.activated
 * - subscription.updated
 * - subscription.canceled / subscription.past_due
 * - transaction.completed / transaction.paid
 */

const STARTER_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER || 'pri_01m7z41bqvy0wkqrv714vby96b';
const PRO_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO || 'pri_01m7z4388b3yg0e4ywnhtk9a73';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!rawBody) {
      return NextResponse.json({ error: 'Missing body' }, { status: 400 });
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = event?.event_type;
    const eventData = event?.data;

    console.log(`[Paddle Webhook] Received event: ${eventType} (ID: ${event?.event_id})`);

    const supabase = getServiceSupabase();

    // Handle subscription lifecycle events
    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.created': {
        const subId = eventData?.id;
        const customerId = eventData?.customer_id;
        const customerEmail = eventData?.customer?.email || eventData?.custom_data?.email;

        // Detect plan tier from items price ID
        let planTier: 'starter' | 'pro' = 'starter';
        const items = eventData?.items || [];
        const isPro = items.some((item: any) => item?.price?.id === PRO_PRICE_ID || item?.price_id === PRO_PRICE_ID);
        if (isPro) planTier = 'pro';

        console.log(`[Paddle Webhook] Activating ${planTier.toUpperCase()} for ${customerEmail || customerId} (Sub ID: ${subId})`);

        if (customerEmail) {
          // Update profile in Supabase
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: planTier,
              paddle_customer_id: customerId,
              paddle_subscription_id: subId,
              updated_at: new Date().toISOString(),
            })
            .ilike('email', customerEmail.trim());

          if (error) {
            console.error('[Paddle Webhook] Failed to update profile in database:', error.message);
          } else {
            console.log(`[Paddle Webhook] Profile successfully upgraded in Supabase for ${customerEmail}`);
          }
        }
        break;
      }

      case 'subscription.updated': {
        const subId = eventData?.id;
        const status = eventData?.status;
        console.log(`[Paddle Webhook] Subscription Updated: ${subId} Status: ${status}`);

        if (status === 'paused' || status === 'past_due') {
          await supabase
            .from('profiles')
            .update({ plan: 'free', updated_at: new Date().toISOString() })
            .eq('paddle_subscription_id', subId);
        }
        break;
      }

      case 'subscription.canceled': {
        const subId = eventData?.id;
        console.log(`[Paddle Webhook] Subscription Canceled: ${subId}`);

        // Revert user to free plan
        const { error } = await supabase
          .from('profiles')
          .update({
            plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('paddle_subscription_id', subId);

        if (error) {
          console.error('[Paddle Webhook] Error reverting profile to free:', error.message);
        }
        break;
      }

      case 'transaction.completed':
      case 'transaction.paid': {
        const txnId = eventData?.id;
        console.log(`[Paddle Webhook] Payment Successful: ${txnId}`);
        break;
      }

      default:
        console.log(`[Paddle Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({
      received: true,
      event_type: eventType,
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Paddle Webhook Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook handler error' },
      { status: 500 }
    );
  }
}
