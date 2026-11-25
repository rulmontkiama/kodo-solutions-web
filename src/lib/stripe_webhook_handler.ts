/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase/admin';
import {
  createLicenseRecord,
  findLicenseBySubscriptionId,
  sendLicenseWelcomeEmail,
} from '@/lib/license';

/**
 * Shared Stripe webhook processor used by both `/api/webhooks/stripe` and `/api/stripe/webhook`
 * so whichever endpoint is configured in Stripe Dashboard behaves identically.
 */
export async function handleStripeWebhookRequest(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;
  try {
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Signature Stripe manquante' }, { status: 400 });
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else if (process.env.NODE_ENV !== 'production') {
      event = JSON.parse(body);
    } else {
      console.error('STRIPE_WEBHOOK_SECRET manquant en production.');
      return NextResponse.json({ error: 'Configuration webhook incomplète' }, { status: 500 });
    }
  } catch (err: unknown) {
    console.error('⚠️ Signature webhook Stripe invalide:', (err as Error).message);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      if (session.payment_status && session.payment_status !== 'paid') {
        return NextResponse.json({ received: true, skipped: 'unpaid' });
      }

      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.customer_email;
      const customerName = session.customer_details?.name || 'Client Kōdo';
      const plan = session.metadata?.plan || 'pro';
      const billingCycle = session.metadata?.billing_cycle || 'monthly';
      const referralCodeUsed = session.metadata?.referralCode || '';

      if (customerEmail) {
        const stripeSubId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id || '';
        const stripeCustId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id || '';

        const license = await createLicenseRecord({
          email: customerEmail,
          customerName,
          plan,
          billingCycle,
          stripeSessionId: session.id,
          stripeCustomerId: stripeCustId,
          stripeSubscriptionId: stripeSubId,
          referredBy: referralCodeUsed,
        });

        await sendLicenseWelcomeEmail({
          email: customerEmail,
          licenseKey: license.licenseKey,
          plan: license.plan,
          referralCode: license.referralCode,
        });

        // Process referral reward if valid
        if (referralCodeUsed && adminDb) {
          try {
            const parrainQuery = await adminDb
              .collection('pos_licenses')
              .where('referralCode', '==', referralCodeUsed.trim().toUpperCase())
              .limit(1)
              .get();

            if (!parrainQuery.empty) {
              const parrainDoc = parrainQuery.docs[0];
              const parrainData = parrainDoc.data();
              await adminDb.collection('referrals').add({
                parrainEmail: parrainData.email || '',
                parrainLicenseKey: parrainDoc.id,
                filleulEmail: customerEmail,
                filleulLicenseKey: license.licenseKey,
                createdAt: new Date().toISOString(),
                rewardGranted: true,
              });
            }
          } catch (refError) {
            console.error('Erreur traitement parrainage:', refError);
          }
        }

        return NextResponse.json({ received: true, license_key: license.licenseKey });
      }
    } else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subscriptionId) {
        const found = await findLicenseBySubscriptionId(subscriptionId);
        if (found) {
          const isYearly = found.record.billingCycle === 'yearly';
          const d = new Date();
          if (isYearly) {
            d.setFullYear(d.getFullYear() + 1);
          } else {
            d.setMonth(d.getMonth() + 1);
          }
          const newExpiryDay = d.toISOString().split('T')[0];

          await found.docRef.update({
            status: 'active',
            expiryDate: newExpiryDay,
            expiry_date: newExpiryDay,
            expires_at: d.toISOString(),
          });
        }
      }
    } else if (
      event.type === 'customer.subscription.deleted' ||
      event.type === 'invoice.payment_failed'
    ) {
      const obj = event.data.object as any;
      const subscriptionId =
        event.type === 'customer.subscription.deleted'
          ? obj.id
          : typeof obj.subscription === 'string'
            ? obj.subscription
            : obj.subscription?.id;

      if (subscriptionId) {
        const found = await findLicenseBySubscriptionId(subscriptionId);
        if (found) {
          const newStatus =
            event.type === 'customer.subscription.deleted' ? 'expired' : 'suspended';
          await found.docRef.update({ status: newStatus });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur traitement webhook Stripe:', error);
    return NextResponse.json({ error: 'Erreur interne webhook Stripe' }, { status: 500 });
  }
}
