import { NextRequest, NextResponse } from 'next/server';

/**
 * Paddle Billing Webhook Handler
 * 
 * Handles real-time asynchronous subscription and transaction events from Paddle.
 * Supported events:
 * - subscription.created
 * - subscription.activated
 * - subscription.updated
 * - subscription.canceled
 * - subscription.past_due
 * - transaction.completed
 * - transaction.paid
 */

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('paddle-signature');

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

    // Handle subscription lifecycle events
    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.created': {
        const subId = eventData?.id;
        const customerId = eventData?.customer_id;
        const status = eventData?.status;
        console.log(`[Paddle Webhook] Subscription Active: ${subId} for customer ${customerId} (Status: ${status})`);
        break;
      }

      case 'subscription.updated': {
        const subId = eventData?.id;
        console.log(`[Paddle Webhook] Subscription Updated: ${subId}`);
        break;
      }

      case 'subscription.canceled': {
        const subId = eventData?.id;
        console.log(`[Paddle Webhook] Subscription Canceled: ${subId}`);
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
