import { adminDb } from '@/lib/firebase/admin';
import {
  billingCycleToDuration,
  computeExpirationDate,
  generateLicenseKey as generateHmacLicenseKey,
  isValidLicensePlan,
  LicensePlan,
} from '@/lib/license_generator';

export interface LicenseRecord {
  licenseKey: string;
  license_key: string;
  email: string;
  customerName: string;
  shop_name: string;
  plan: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'suspended' | 'expired';
  referralCode: string;
  referredBy: string;
  createdAt: string;
  created_at: string;
  expiryDate: string;
  expiry_date: string;
  expires_at: string;
  hardware_id: string;
  stripeSessionId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  starter: 'Essentiel',
  essentiel: 'Essentiel',
  pro: 'Pro',
  max: 'Omnicanal',
  omnicanal: 'Omnicanal',
};

export function normalizePlanKey(plan?: string): 'starter' | 'pro' | 'max' {
  const lower = (plan || 'pro').toLowerCase();
  if (lower === 'starter' || lower === 'essentiel') return 'starter';
  if (lower === 'max' || lower === 'omnicanal') return 'max';
  return 'pro';
}

export function generateLicenseKey(plan?: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): string {
  const hmacSecret = process.env.LICENSE_HMAC_SECRET;
  const upperPlan = normalizePlanKey(plan).toUpperCase();

  if (hmacSecret && isValidLicensePlan(upperPlan)) {
    const duration = billingCycleToDuration(billingCycle);
    return generateHmacLicenseKey({
      plan: upperPlan as LicensePlan,
      duration,
      secret: hmacSecret,
    });
  }

  const parts = Array.from({ length: 4 }, () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  const prefix = plan ? `KODO-${upperPlan}` : 'KODO';
  return `${prefix}-${parts.join('-')}`;
}

export function generateReferralCode(name: string): string {
  const cleanName = (name || 'USER')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 8);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REF-${cleanName}-${randomNum}`;
}

export function isLicenseActive(license: Partial<LicenseRecord> | null | undefined): boolean {
  if (!license) return false;
  if (license.status !== 'active') return false;

  const expiry = license.expiry_date || license.expiryDate || license.expires_at;
  if (!expiry || expiry === 'Permanent' || expiry === 'A vie') return true;

  const expiryDay = expiry.includes('T') ? expiry.split('T')[0] : expiry;
  const todayStr = new Date().toISOString().split('T')[0];
  return todayStr <= expiryDay;
}

function normalizeFirestoreDoc(id: string, data: Record<string, unknown>): LicenseRecord {
  const expiry = String(
    data.expiry_date || data.expiryDate || data.expires_at || '2099-12-31'
  );
  const expiryDay = expiry.includes('T') ? expiry.split('T')[0] : expiry;
  const rawBilling = String(data.billingCycle || data.billing_cycle || 'monthly').toLowerCase();
  const billingCycle: 'monthly' | 'yearly' =
    rawBilling === 'yearly' || rawBilling === 'annual' ? 'yearly' : 'monthly';
  const key = String(data.license_key || data.licenseKey || id).toUpperCase();

  return {
    licenseKey: key,
    license_key: key,
    email: String(data.email || data.customer_email || ''),
    customerName: String(data.customerName || data.customer_name || data.shop_name || 'Client Kōdo'),
    shop_name: String(data.shop_name || data.customerName || data.customer_name || 'Client Kōdo'),
    plan: normalizePlanKey(String(data.plan || 'pro')),
    billingCycle,
    status: (data.status as 'active' | 'suspended' | 'expired') || 'active',
    referralCode: String(data.referralCode || data.referral_code || ''),
    referredBy: String(data.referredBy || data.referred_by || ''),
    createdAt: String(data.createdAt || data.created_at || new Date().toISOString()),
    created_at: String(data.created_at || data.createdAt || new Date().toISOString()),
    expiryDate: expiryDay,
    expiry_date: expiryDay,
    expires_at: expiry,
    hardware_id: String(data.hardware_id || data.fingerprint || ''),
    stripeSessionId: String(data.stripeSessionId || data.stripe_session_id || ''),
    stripeCustomerId: String(data.stripeCustomerId || data.stripe_customer_id || ''),
    stripeSubscriptionId: String(data.stripeSubscriptionId || data.stripe_subscription_id || ''),
  };
}

/**
 * Finds a license in canonical `pos_licenses` (with read fallback to legacy `licenses`).
 */
export async function findLicenseByKey(
  rawKey: string
): Promise<{ record: LicenseRecord; collection: 'pos_licenses' | 'licenses' } | null> {
  if (!adminDb || !rawKey) return null;
  const cleanKey = rawKey.trim().toUpperCase();

  const primaryDoc = await adminDb.collection('pos_licenses').doc(cleanKey).get();
  if (primaryDoc.exists) {
    return {
      record: normalizeFirestoreDoc(primaryDoc.id, primaryDoc.data() || {}),
      collection: 'pos_licenses',
    };
  }

  const legacyDoc = await adminDb.collection('licenses').doc(cleanKey).get();
  if (legacyDoc.exists) {
    return {
      record: normalizeFirestoreDoc(legacyDoc.id, legacyDoc.data() || {}),
      collection: 'licenses',
    };
  }

  return null;
}

export async function findLicenseBySessionId(sessionId: string): Promise<LicenseRecord | null> {
  if (!adminDb || !sessionId) return null;

  const snap = await adminDb
    .collection('pos_licenses')
    .where('stripeSessionId', '==', sessionId)
    .limit(1)
    .get();

  if (!snap.empty) {
    const doc = snap.docs[0];
    return normalizeFirestoreDoc(doc.id, doc.data() || {});
  }

  return null;
}

export async function findLicenseBySubscriptionId(
  subscriptionId: string
): Promise<{ record: LicenseRecord; docRef: FirebaseFirestore.DocumentReference } | null> {
  if (!adminDb || !subscriptionId) return null;

  for (const field of ['stripeSubscriptionId', 'stripe_subscription_id']) {
    const snap = await adminDb
      .collection('pos_licenses')
      .where(field, '==', subscriptionId)
      .limit(1)
      .get();
    if (!snap.empty) {
      const doc = snap.docs[0];
      return {
        record: normalizeFirestoreDoc(doc.id, doc.data() || {}),
        docRef: doc.ref,
      };
    }
  }

  return null;
}

export async function createLicenseRecord(params: {
  email: string;
  customerName?: string;
  plan: string;
  billingCycle?: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  referredBy?: string;
}): Promise<LicenseRecord> {
  // Idempotency: if a license was already created for this Stripe session, return it!
  if (params.stripeSessionId) {
    const existing = await findLicenseBySessionId(params.stripeSessionId);
    if (existing) return existing;
  }

  const normalizedPlan = normalizePlanKey(params.plan);
  const rawCycle = (params.billingCycle || 'monthly').toLowerCase();
  const billingCycle: 'monthly' | 'yearly' =
    rawCycle === 'yearly' || rawCycle === 'annual' ? 'yearly' : 'monthly';

  const licenseKey = generateLicenseKey(normalizedPlan, billingCycle);
  const referralCode = generateReferralCode(params.customerName || params.email.split('@')[0]);

  const createdAtDate = new Date();
  const duration = billingCycleToDuration(billingCycle);
  const expiresAtDate = computeExpirationDate(createdAtDate, duration);
  const expiryDay = expiresAtDate.toISOString().split('T')[0];

  const displayName = params.customerName || 'Client Kōdo';

  const record: LicenseRecord = {
    licenseKey,
    license_key: licenseKey,
    email: params.email,
    customerName: displayName,
    shop_name: displayName,
    plan: normalizedPlan,
    billingCycle,
    status: 'active',
    referralCode,
    referredBy: params.referredBy || '',
    createdAt: createdAtDate.toISOString(),
    created_at: createdAtDate.toISOString(),
    expiryDate: expiryDay,
    expiry_date: expiryDay,
    expires_at: expiresAtDate.toISOString(),
    hardware_id: '',
    stripeSessionId: params.stripeSessionId || '',
    stripeCustomerId: params.stripeCustomerId || '',
    stripeSubscriptionId: params.stripeSubscriptionId || '',
  };

  if (adminDb) {
    await adminDb.collection('pos_licenses').doc(licenseKey).set(record);

    if (params.email) {
      await adminDb.collection('user_licenses').doc(params.email.toLowerCase()).set({
        licenseKey,
        plan: normalizedPlan,
        updatedAt: createdAtDate.toISOString(),
      });
    }
  }

  return record;
}

export async function sendLicenseWelcomeEmail(params: {
  email: string;
  licenseKey: string;
  plan: string;
  referralCode?: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY manquant. Email de bienvenue simulé pour", params.email);
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodo-solutions-web.vercel.app';
  const planLabel = PLAN_DISPLAY_NAMES[params.plan.toLowerCase()] || params.plan;
  const portalUrl = `${siteUrl}/kodo-pos?key=${encodeURIComponent(params.licenseKey)}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.LICENSE_EMAIL_FROM || 'Kōdo POS <licences@kodo-solutions.com>',
        to: params.email,
        subject: `Votre licence Kōdo POS (${planLabel}) et lien de téléchargement`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; color: #09090B;">
            <h2 style="font-size: 22px; margin-bottom: 12px;">Bienvenue sur Kōdo POS</h2>
            <p>Merci pour votre abonnement à l'offre <strong>Kōdo POS ${planLabel}</strong>.</p>
            <div style="background: #0A0A0F; color: #FFFFFF; padding: 20px; border-radius: 14px; margin: 20px 0;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #FF7F7F; margin-bottom: 6px;">Votre clé de licence personnelle</div>
              <div style="font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 1px;">${params.licenseKey}</div>
            </div>
            <p>Téléchargez votre installateur sécurisé (macOS ou Windows) depuis votre espace client :</p>
            <p style="margin: 22px 0;">
              <a href="${portalUrl}" style="display: inline-block; background: #FF7F7F; color: #09090B; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 999px;">
                Télécharger Kōdo POS
              </a>
            </p>
            ${
              params.referralCode
                ? `<p style="font-size: 13px; color: #52525B;">Votre code parrainage : <strong>${params.referralCode}</strong></p>`
                : ''
            }
            <p style="font-size: 12px; color: #71717A; margin-top: 28px;">
              Kōdo Solutions • Support direct Europe • Conservez précieusement cet email.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error('Erreur envoi email Resend:', await response.text());
    }
  } catch (err) {
    console.error('Erreur réseau Resend:', err);
  }
}
