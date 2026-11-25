/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import {
  createLicenseRecord,
  findLicenseBySessionId,
  PLAN_DISPLAY_NAMES,
  sendLicenseWelcomeEmail,
} from '@/lib/license';
import { getLatestReleaseMetadata, isR2Configured } from '@/lib/r2';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id')?.trim();

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json(
      { paid: false, error: 'Identifiant de session Stripe invalide ou manquant.' },
      { status: 400 }
    );
  }

  try {
    const session = (await stripe.checkout.sessions.retrieve(sessionId)) as any;

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { paid: false, error: 'Le paiement de cette session n’est pas encore confirmé.' },
        { status: 402 }
      );
    }

    // Retrieve existing license created by webhook, or create idempotently if webhook hasn't arrived yet
    let license = await findLicenseBySessionId(session.id);

    if (!license) {
      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.customer_email ||
        '';
      const customerName = session.customer_details?.name || 'Client Kōdo';
      const plan = session.metadata?.plan || 'pro';
      const billingCycle = session.metadata?.billing_cycle || 'monthly';
      const referralCode = session.metadata?.referralCode || '';
      const stripeSubId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id || '';
      const stripeCustId =
        typeof session.customer === 'string' ? session.customer : session.customer?.id || '';

      license = await createLicenseRecord({
        email: customerEmail,
        customerName,
        plan,
        billingCycle,
        stripeSessionId: session.id,
        stripeCustomerId: stripeCustId,
        stripeSubscriptionId: stripeSubId,
        referredBy: referralCode,
      });

      if (customerEmail) {
        await sendLicenseWelcomeEmail({
          email: customerEmail,
          licenseKey: license.licenseKey,
          plan: license.plan,
          referralCode: license.referralCode,
        });
      }
    }

    const release = await getLatestReleaseMetadata();

    return NextResponse.json({
      paid: true,
      licenseKey: license.licenseKey,
      plan: license.plan,
      planLabel: PLAN_DISPLAY_NAMES[license.plan] || license.plan,
      billingCycle: license.billingCycle,
      expiryDate: license.expiryDate,
      referralCode: license.referralCode,
      email: license.email,
      latestVersion: release.version,
      r2Ready: isR2Configured(),
    });
  } catch (error) {
    console.error('[CHECKOUT SESSION API] Erreur:', error);
    return NextResponse.json(
      { paid: false, error: 'Impossible de vérifier la session de paiement Stripe.' },
      { status: 500 }
    );
  }
}
