import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any,
    })
  : null;

export const PLANS = {
  starter: {
    name: 'SitePulse Starter Owner Plan',
    price: 19,
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    monitoredSitesLimit: 3,
  },
  pro: {
    name: 'SitePulse Pro Agency Plan',
    price: 39,
    priceId: process.env.STRIPE_PRICE_PRO || '',
    monitoredSitesLimit: 10,
  },
};
