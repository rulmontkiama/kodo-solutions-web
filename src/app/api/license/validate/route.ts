import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase/admin';
import { findLicenseByKey, PLAN_DISPLAY_NAMES } from '@/lib/license';
import { verifyLicenseKey } from '@/lib/license_generator';

export const runtime = 'nodejs';

const SECRET_LIC_SALT = process.env.LICENSE_OFFLINE_SALT || 'KODO_SECURE_LIC_SALT_2026_BELGIUM';

function generateServerSignature(
  hardwareId: string,
  status: string,
  expiresAt: string,
  licenseKey: string
): string {
  const raw = `${hardwareId}|${status}|${expiresAt}|${licenseKey}|${SECRET_LIC_SALT}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { license_key, hardware_id } = body || {};

    if (!license_key || typeof license_key !== 'string') {
      return NextResponse.json(
        {
          valid: false,
          status: 'invalid',
          reason: 'Veuillez fournir une clé de licence valide.',
        },
        { status: 400 }
      );
    }

    const cleanKey = license_key.trim().toUpperCase();
    const cleanHardwareId =
      typeof hardware_id === 'string' && hardware_id.trim()
        ? hardware_id.trim().toUpperCase()
        : 'UNKNOWN';

    // 1. Canonical lookup in Firestore (`pos_licenses` + legacy `licenses`)
    const found = await findLicenseByKey(cleanKey);

    if (found) {
      const { record, collection } = found;

      // Hardware binding check (1 computer per license unless unbound)
      if (!record.hardware_id && cleanHardwareId !== 'UNKNOWN' && adminDb) {
        await adminDb.collection(collection).doc(cleanKey).update({
          hardware_id: cleanHardwareId,
          activated_at: new Date().toISOString(),
          last_check: new Date().toISOString(),
        });
        record.hardware_id = cleanHardwareId;
      } else if (
        record.hardware_id &&
        cleanHardwareId !== 'UNKNOWN' &&
        record.hardware_id.toUpperCase() !== cleanHardwareId
      ) {
        return NextResponse.json(
          {
            valid: false,
            status: 'hardware_mismatch',
            reason: 'Cette clé de licence est déjà associée à un autre ordinateur.',
            hardware_id: record.hardware_id,
          },
          { status: 403 }
        );
      } else if (adminDb) {
        await adminDb
          .collection(collection)
          .doc(cleanKey)
          .update({ last_check: new Date().toISOString() })
          .catch(() => {});
      }

      if (record.status === 'suspended') {
        return NextResponse.json(
          {
            valid: false,
            status: 'suspended',
            reason: 'Cette licence a été suspendue suite à un incident de paiement.',
          },
          { status: 403 }
        );
      }

      if (record.status === 'expired') {
        return NextResponse.json(
          {
            valid: false,
            status: 'expired',
            reason: `Votre abonnement a expiré le ${record.expiryDate}.`,
            expires_at: record.expiryDate,
          },
          { status: 403 }
        );
      }

      const todayStr = new Date().toISOString().split('T')[0];
      if (
        record.expiryDate &&
        record.expiryDate !== 'Permanent' &&
        record.expiryDate !== 'A vie' &&
        todayStr > record.expiryDate
      ) {
        return NextResponse.json(
          {
            valid: false,
            status: 'expired',
            reason: `La licence a expiré le ${record.expiryDate}.`,
            expires_at: record.expiryDate,
          },
          { status: 403 }
        );
      }

      const signature = generateServerSignature(
        cleanHardwareId,
        record.status,
        record.expiryDate,
        cleanKey
      );

      return NextResponse.json({
        valid: true,
        status: record.status,
        plan: record.plan,
        plan_label: PLAN_DISPLAY_NAMES[record.plan] || record.plan,
        license_key: cleanKey,
        expires_at: record.expiryDate,
        hardware_id: cleanHardwareId,
        signature,
        timestamp: new Date().toISOString(),
        message: 'Licence vérifiée et active.',
      });
    }

    // 2. Cryptographic HMAC fallback ONLY when Firestore is unavailable & HMAC secret verifies the key
    const hmacSecret = process.env.LICENSE_HMAC_SECRET;
    if (!adminDb && hmacSecret && verifyLicenseKey(cleanKey, hmacSecret)) {
      const parts = cleanKey.split('-');
      const plan = (parts[1] || 'PRO').toLowerCase();
      const duration = parts[2] === '1Y' ? 365 : 30;
      const expiresAt = new Date(Date.now() + duration * 86400000).toISOString().split('T')[0];
      const signature = generateServerSignature(cleanHardwareId, 'active', expiresAt, cleanKey);

      return NextResponse.json({
        valid: true,
        status: 'active',
        plan,
        plan_label: PLAN_DISPLAY_NAMES[plan] || plan,
        license_key: cleanKey,
        expires_at: expiresAt,
        hardware_id: cleanHardwareId,
        signature,
        timestamp: new Date().toISOString(),
        message: 'Licence cryptographique vérifiée.',
      });
    }

    return NextResponse.json(
      {
        valid: false,
        status: 'invalid',
        reason: 'Clé de licence incorrecte ou introuvable.',
      },
      { status: 404 }
    );
  } catch (error: unknown) {
    console.error('[LICENSE API] Erreur validation licence:', error);
    return NextResponse.json(
      {
        valid: false,
        status: 'error',
        reason: 'Erreur serveur lors de la validation de la licence.',
      },
      { status: 500 }
    );
  }
}
