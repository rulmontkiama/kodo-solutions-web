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
    console.error('⚠️ Signature webhook Stripe invalide:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle checkout.session.completed
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
            .collection('licenses')
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
  }

  return NextResponse.json({ received: true });
}
