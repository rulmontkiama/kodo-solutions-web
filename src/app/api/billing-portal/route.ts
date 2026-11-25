import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { findLicenseByKey } from '@/lib/license';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const licenseKey = typeof body.license_key === 'string' ? body.license_key.trim() : '';

    if (!licenseKey) {
      return NextResponse.json({ error: 'Clé de licence requise.' }, { status: 400 });
    }

    const found = await findLicenseByKey(licenseKey);
    if (!found || !found.record.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Aucun compte de facturation Stripe associé à cette clé de licence.' },
        { status: 404 }
      );
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kodo-solutions-web.vercel.app'}/kodo-pos?key=${encodeURIComponent(found.record.licenseKey)}`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: found.record.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('[BILLING PORTAL API] Erreur:', error);
    return NextResponse.json(
      { error: 'Impossible d’ouvrir le portail de facturation Stripe.' },
      { status: 500 }
    );
  }
}
