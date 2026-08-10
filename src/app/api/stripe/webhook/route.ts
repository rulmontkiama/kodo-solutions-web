/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createLicenseRecord } from '@/lib/license';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev fallback parsing
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('⚠️ Signature webhook Stripe invalide:', (err as Error).message);
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  // Handle events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || 'Client Kōdo';
    const plan = session.metadata?.plan || 'monthly';
    const referralCodeUsed = session.metadata?.referralCode || '';

    if (customerEmail) {
      // 1. Generate & Save License in Firestore
      const license = await createLicenseRecord({
        email: customerEmail,
        customerName,
        plan,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        referredBy: referralCodeUsed,
      });

      console.log(`✅ Licence Kōdo POS générée avec succès pour ${customerEmail}: ${license.licenseKey}`);

      // 2. Process Referral Reward if a valid Referral Code was used
      if (referralCodeUsed) {
        try {
          const parrainQuery = await adminDb
            .collection('pos_licenses')
            .where('referralCode', '==', referralCodeUsed.trim().toUpperCase())
            .limit(1)
            .get();

          if (!parrainQuery.empty) {
            const parrainDoc = parrainQuery.docs[0];
            const parrainData = parrainDoc.data();

            // Record successful referral
            await adminDb.collection('referrals').add({
              parrainEmail: parrainData.email,
              parrainLicenseKey: parrainDoc.id,
              filleulEmail: customerEmail,
              filleulLicenseKey: license.licenseKey,
              createdAt: new Date().toISOString(),
              rewardGranted: true,
            });

            console.log(`🎁 Parrainage validé ! ${parrainData.email} a parrainé ${customerEmail}`);
          }
        } catch (refError) {
          console.error('Erreur traitement parrainage:', refError);
        }
      }
    }
  } else if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    const subscriptionId = invoice.subscription;
    if (subscriptionId) {
      try {
        const query = await adminDb.collection('pos_licenses')
          .where('stripeSubscriptionId', '==', subscriptionId)
          .limit(1)
          .get();

        if (!query.empty) {
          const docRef = query.docs[0].ref;
          const data = query.docs[0].data();

          // Extend expiry_date based on plan
          let newExpiryDate = '2099-12-31';
          if (data.plan === 'monthly') {
             const d = new Date();
             d.setMonth(d.getMonth() + 1);
             newExpiryDate = d.toISOString().split('T')[0];
          } else if (data.plan === 'annual') {
             const d = new Date();
             d.setFullYear(d.getFullYear() + 1);
             newExpiryDate = d.toISOString().split('T')[0];
          }

          await docRef.update({
            status: 'active',
            expiry_date: newExpiryDate
          });
          console.log(`✅ Licence prolongée pour l'abonnement ${subscriptionId}`);
        }
      } catch (err) {
        console.error('Erreur prolongation licence:', err);
      }
    }
  } else if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
    const object = event.data.object as any;
    const subscriptionId = event.type === 'customer.subscription.deleted' ? object.id : object.subscription;

    if (subscriptionId) {
      try {
        const query = await adminDb.collection('pos_licenses')
          .where('stripeSubscriptionId', '==', subscriptionId)
          .limit(1)
          .get();

        if (!query.empty) {
          const docRef = query.docs[0].ref;
          const newStatus = event.type === 'customer.subscription.deleted' ? 'expired' : 'suspended';
          await docRef.update({ status: newStatus });
          console.log(`❌ Statut de la licence mis à jour (${newStatus}) pour l'abonnement ${subscriptionId}`);
        }
      } catch (err) {
        console.error('Erreur mise à jour statut licence:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
