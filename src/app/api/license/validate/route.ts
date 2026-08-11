import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { signLicenseToken } from '@/lib/jwt';
import { PLAN_FEATURES } from '@/lib/license';

const SECRET_LIC_SALT = "KODO_SECURE_LIC_SALT_2026_BELGIUM";

function generateServerSignature(hardwareId: string, status: string, expiresAt: string, licenseKey: string): string {
  const raw = `${hardwareId}|${status}|${expiresAt}|${licenseKey}|${SECRET_LIC_SALT}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { license_key, hardware_id, app_version } = body || {};

    if (!license_key || typeof license_key !== 'string') {
      return NextResponse.json({
        valid: false,
        status: "invalid",
        reason: "Veuillez fournir une clé de licence valide.",
      }, { status: 400 });
    }

    const cleanKey = license_key.trim().toUpperCase ? license_key.trim().toUpperCase() : license_key.trim();
    const cleanHardwareId = hardware_id ? hardware_id.trim().toUpperCase() : "UNKNOWN";

    let licenseData: {
      status: string;
      expires_at: string;
      hardware_id?: string;
      client_name?: string;
      plan?: string;
      features?: string[];
    } | null = null;

    // 1. Consultation optionnelle dans Firestore
    try {
      const { adminDb } = await import('@/lib/firebase/admin');
      if (adminDb) {
        // Recherche par ID de document (clé de licence) dans la collection pos_licenses
        const docRef = adminDb.collection('pos_licenses').doc(cleanKey);
        const doc = await docRef.get();

        if (doc.exists) {
          const data = doc.data();
          const plan = data?.plan || 'PRO';
          licenseData = {
            status: data?.status || 'active',
            expires_at: data?.expiry_date || data?.expires_at || '2056-08-10',
            hardware_id: data?.hardware_id || data?.fingerprint,
            client_name: data?.shop_name || data?.client_name,
            plan: plan,
            features: data?.features || PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES['PRO']
          };

          // Si le hardware_id n'était pas encore enregistré, association à la 1ère activation
          if (!data?.hardware_id && cleanHardwareId !== "UNKNOWN") {
            await docRef.update({
              hardware_id: cleanHardwareId,
              activated_at: new Date().toISOString(),
              last_check: new Date().toISOString()
            });
            licenseData.hardware_id = cleanHardwareId;
          } else if (data?.hardware_id && data.hardware_id !== cleanHardwareId) {
            return NextResponse.json({
              valid: false,
              status: "hardware_mismatch",
              reason: "Cette clé de licence est déjà associée à un autre ordinateur.",
              hardware_id: data.hardware_id
            }, { status: 403 });
          }
        }
      }
    } catch (dbError) {
      console.warn('[LICENSE API] Consultation Firestore ignorée:', dbError);
    }

    // 2. Fallback algorithmique (Clés Master / 30-Year / Algorithmiques)
    if (!licenseData) {
      const isMasterKey = cleanKey.includes("30Y") || cleanKey.includes("MASTER") || cleanKey.includes("PERMANENT") || cleanKey.startsWith("KODO-30YS");
      const isDemoKey = cleanKey === "DEMO-ACTIVE-2026";
      const isStandardFormat = cleanKey.startsWith("KODO-") && cleanKey.length >= 12;

      if (isMasterKey || isDemoKey || isStandardFormat) {
        const expiresAt = isMasterKey 
          ? "2056-08-10" 
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const plan = 'ENTERPRISE'; // Master/Demo keys get full access
        licenseData = {
          status: "active",
          expires_at: expiresAt,
          hardware_id: cleanHardwareId,
          plan: plan,
          features: PLAN_FEATURES[plan]
        };
      }
    }

    // 3. Traitement du statut et expiration
    if (!licenseData) {
      return NextResponse.json({
        valid: false,
        status: "invalid",
        reason: "Clé de licence incorrecte ou inconnue.",
      }, { status: 404 });
    }

    if (licenseData.status === 'suspended') {
      return NextResponse.json({
        valid: false,
        status: "suspended",
        reason: "Cette licence a été suspendue à distance.",
      }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (licenseData.expires_at !== 'Permanent' && licenseData.expires_at !== 'A vie' && todayStr > licenseData.expires_at) {
      return NextResponse.json({
        valid: false,
        status: "expired",
        reason: `La licence a expiré le ${licenseData.expires_at}.`,
        expires_at: licenseData.expires_at
      }, { status: 403 });
    }

    // 4. Génération du Token Signé pour Mode Hors-Ligne Assuré
    const signature = generateServerSignature(
      cleanHardwareId,
      licenseData.status,
      licenseData.expires_at,
      cleanKey
    );

    const plan = licenseData.plan || 'PRO';
    const features = licenseData.features || PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES['PRO'];

    const jwt = await signLicenseToken({
      license_key: cleanKey,
      plan: plan,
      features: features,
      expires_at: licenseData.expires_at,
      hardware_id: cleanHardwareId,
      status: licenseData.status,
    });

    return NextResponse.json({
      valid: true,
      status: licenseData.status,
      license_key: cleanKey,
      expires_at: licenseData.expires_at,
      hardware_id: cleanHardwareId,
      plan: plan,
      features: features,
      signature: signature,
      token: jwt, // The new JWT payload for gating
      timestamp: new Date().toISOString(),
      message: "Licence certifiée conforme et active"
    });

  } catch (error: unknown) {
    console.error('[LICENSE API] Erreur validation licence:', error);
    return NextResponse.json({
      valid: false,
      status: "error",
      reason: "Erreur serveur lors de la validation de la licence."
    }, { status: 500 });
  }
}
