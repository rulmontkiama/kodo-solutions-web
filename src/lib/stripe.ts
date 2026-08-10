/* eslint-disable @typescript-eslint/no-explicit-any */

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_build', {
  apiVersion: '2025-01-27.acacia' as any,
  appInfo: {
    name: 'Kodo Solutions',
    version: '1.0.3',
  },
});
