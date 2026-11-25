/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import {
  findLicenseByKey,
  findLicenseBySessionId,
  isLicenseActive,
  PLAN_DISPLAY_NAMES,
} from '@/lib/license';
import {
  createPresignedDownloadUrl,
  getLatestReleaseMetadata,
  isR2Configured,
} from '@/lib/r2';

export const runtime = 'nodejs';

type TargetOs = 'mac' | 'win';

function normalizeOs(raw?: string | null): TargetOs {
  const val = (raw || 'mac').toLowerCase();
  if (val === 'win' || val === 'windows' || val === 'exe') return 'win';
  return 'mac';
}

async function authorizeDownload(params: { licenseKey?: string | null; sessionId?: string | null }) {
  // 1. Authorization via active license key in Firestore
  if (params.licenseKey) {
    const found = await findLicenseByKey(params.licenseKey);
    if (!found) {
      return {
        authorized: false as const,
        status: 404,
        error: 'Clé de licence introuvable. Vérifiez votre email de confirmation.',
      };
    }

    if (!isLicenseActive(found.record)) {
      return {
        authorized: false as const,
        status: 403,
        error:
          found.record.status === 'suspended'
            ? 'Votre licence est suspendue (paiement en attente).'
            : `Votre abonnement a expiré le ${found.record.expiryDate}. Renouvelez pour télécharger.`,
      };
    }

    return { authorized: true as const, license: found.record };
  }

  // 2. Authorization via verified paid Stripe Checkout Session
  if (params.sessionId && params.sessionId.startsWith('cs_')) {
    try {
      const session = (await stripe.checkout.sessions.retrieve(params.sessionId)) as any;
      if (session?.payment_status !== 'paid') {
        return {
          authorized: false as const,
          status: 402,
          error: 'Paiement non confirmé pour cette session.',
        };
      }

      const license = await findLicenseBySessionId(session.id);
      return {
        authorized: true as const,
        license: license || {
          licenseKey: '',
          plan: session.metadata?.plan || 'pro',
          billingCycle: session.metadata?.billing_cycle === 'yearly' ? 'yearly' : 'monthly',
          expiryDate: '',
          status: 'active' as const,
          email: session.customer_details?.email || '',
        },
      };
    } catch (err) {
      console.error('[DOWNLOAD API] Erreur Stripe session:', err);
      return {
        authorized: false as const,
        status: 403,
        error: 'Session de paiement invalide ou expirée.',
      };
    }
  }

  return {
    authorized: false as const,
    status: 401,
    error: 'Clé de licence active ou session de paiement requise pour télécharger Kōdo POS.',
  };
}

/**
 * GET /api/download?os=mac|win&key=KODO-... (or &session_id=cs_...)
 * Redirects directly to a 5-minute Cloudflare R2 presigned URL (or returns JSON if format=json).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const os = normalizeOs(searchParams.get('os'));
  const key = searchParams.get('key');
  const sessionId = searchParams.get('session_id');
  const format = searchParams.get('format');

  const auth = await authorizeDownload({ licenseKey: key, sessionId });
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          'Le stockage sécurisé Cloudflare R2 n’est pas encore configuré sur ce serveur (variables R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY).',
      },
      { status: 503 }
    );
  }

  try {
    const release = await getLatestReleaseMetadata();
    const objectKey = os === 'win' ? release.winObjectKey : release.macObjectKey;
    const filename = os === 'win' ? release.winFilename : release.macFilename;

    const signedUrl = await createPresignedDownloadUrl(objectKey, {
      expiresInSeconds: 300, // 5 minutes
      filename,
    });

    if (format === 'json') {
      return NextResponse.json({
        url: signedUrl,
        version: release.version,
        filename,
        expiresInSeconds: 300,
      });
    }

    return NextResponse.redirect(signedUrl, 302);
  } catch (error) {
    console.error('[DOWNLOAD API] Erreur signature R2:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du lien de téléchargement sécurisé.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/download { license_key } -> verifies license and returns portal info + latest version.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const licenseKey = typeof body.license_key === 'string' ? body.license_key.trim() : '';

    const auth = await authorizeDownload({ licenseKey });
    if (!auth.authorized) {
      return NextResponse.json({ valid: false, error: auth.error }, { status: auth.status });
    }

    const release = await getLatestReleaseMetadata();
    const license = auth.license;

    return NextResponse.json({
      valid: true,
      license: {
        licenseKey: license.licenseKey,
        plan: license.plan,
        planLabel: PLAN_DISPLAY_NAMES[license.plan] || license.plan,
        billingCycle: license.billingCycle,
        expiryDate: license.expiryDate,
        email: license.email,
        hasBillingPortal: Boolean('stripeCustomerId' in license && license.stripeCustomerId),
      },
      release: {
        version: release.version,
        releaseDate: release.releaseDate,
        changelog: release.changelog,
        macFilename: release.macFilename,
        winFilename: release.winFilename,
      },
      r2Ready: isR2Configured(),
    });
  } catch (error) {
    console.error('[DOWNLOAD API POST] Erreur:', error);
    return NextResponse.json(
      { valid: false, error: 'Erreur lors de la vérification de votre licence.' },
      { status: 500 }
    );
  }
}
