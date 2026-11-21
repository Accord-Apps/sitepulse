'use client';

declare global {
  interface Window {
    Paddle?: any;
  }
}

export const PADDLE_CONFIG = {
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'live_74e780c1418d89036aaf936116b',
  prices: {
    starter: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER || 'pri_01m7z41bqvy0wkqrv714vby96b',
    pro: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO || 'pri_01m7z4388b3yg0e4ywnhtk9a73',
  },
};

let isPaddleInitialized = false;

export function initializePaddle(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.Paddle) {
    console.warn('Paddle.js not loaded yet');
    return false;
  }

  if (!isPaddleInitialized) {
    try {
      window.Paddle.Initialize({
        token: PADDLE_CONFIG.clientToken,
        eventCallback: function (data: any) {
          if (data.name === 'checkout.completed') {
            console.log('✅ Paddle Checkout Completed:', data);
            window.location.href = `${window.location.origin}/dashboard?payment=success&plan=pro`;
          }
        },
      });
      isPaddleInitialized = true;
      console.log('✅ Paddle.js initialized in live mode');
    } catch (err) {
      console.error('Error initializing Paddle:', err);
      return false;
    }
  }

  return true;
}

export function openPaddleCheckout(plan: 'starter' | 'pro', customerEmail?: string): boolean {
  if (typeof window === 'undefined') return false;

  const initialized = initializePaddle();
  if (!initialized || !window.Paddle) {
    alert('Paddle payment engine is loading. Please try again in 2 seconds.');
    return false;
  }

  const priceId = PADDLE_CONFIG.prices[plan];
  const origin = window.location.origin;

  try {
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: customerEmail ? { email: customerEmail } : undefined,
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
        successUrl: `${origin}/dashboard?payment=success&plan=${plan}`,
      },
    });
    return true;
  } catch (err) {
    console.error('Paddle checkout open error:', err);
    // If domain isn't whitelisted in Paddle, fallback gracefully
    alert('Unable to open checkout overlay. Please ensure your domain is added under Paddle -> Developer Tools -> Web Domains.');
    return false;
  }
}
