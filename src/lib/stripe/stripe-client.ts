/**
 * Stripe Client with Fallback Mode
 * Works without API keys in demo mode
 */

import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

interface MockStripe {
  type: 'mock';
  createPaymentMethod: () => Promise<{ paymentMethod: { id: string } }>;
  confirmCardPayment: () => Promise<{ paymentIntent: { status: string } }>;
  redirectToCheckout: () => Promise<{ error?: { message: string } }>;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLIC_KEY;
}

/**
 * Get Stripe instance or mock
 */
export async function getStripeClient(): Promise<Stripe | MockStripe | null> {
  if (isStripeConfigured()) {
    if (!stripePromise) {
      stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
  }
  
  // Return mock Stripe for demo mode
  return {
    type: 'mock',
    createPaymentMethod: async () => ({
      paymentMethod: { id: 'mock_pm_' + Math.random().toString(36).substr(2, 9) }
    }),
    confirmCardPayment: async () => ({
      paymentIntent: { status: 'succeeded' }
    }),
    redirectToCheckout: async () => {
      // Simulate successful checkout in demo mode
      console.log('[DEMO] Stripe Checkout würde hier starten');
      return {};
    }
  };
}

/**
 * Mock subscription data for demo mode
 */
export function getMockSubscriptionData() {
  return {
    plan: 'Starter',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelAtPeriodEnd: false,
    seats: 5,
    price: 99,
    features: [
      'Bis zu 50 Fahrer',
      'Unbegrenzte Aufträge',
      'Echtzeit-Tracking',
      'Basis-Statistiken',
      'E-Mail Support'
    ]
  };
}

/**
 * Create checkout session (mock or real)
 */
export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  if (isStripeConfigured()) {
    // Real Stripe checkout
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
      }),
    });
    
    const session = await response.json();
    const stripe = await getStripeClient();
    
    if (stripe && 'redirectToCheckout' in stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (error) {
        throw error;
      }
    }
  } else {
    // Demo mode
    console.log('[DEMO] Checkout-Session würde erstellt für:', priceId);
    alert('Demo-Modus: Stripe ist nicht konfiguriert. In der Produktion würde hier der Checkout-Prozess starten.');
    
    // Simulate successful subscription
    localStorage.setItem('demo-subscription', JSON.stringify({
      priceId,
      createdAt: new Date().toISOString(),
      status: 'active'
    }));
  }
}

/**
 * Cancel subscription (mock or real)
 */
export async function cancelSubscription(subscriptionId: string) {
  if (isStripeConfigured()) {
    // Real cancellation via API
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });
    
    return response.json();
  } else {
    // Demo mode
    console.log('[DEMO] Subscription würde gekündigt:', subscriptionId);
    localStorage.setItem('demo-subscription', JSON.stringify({
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    }));
    
    return { success: true, message: 'Demo: Subscription gekündigt' };
  }
}