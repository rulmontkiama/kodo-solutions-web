import { NextResponse } from 'next/server';
import { findLicenseByKey, isLicenseActive } from '@/lib/license';
import {
  createPresignedDownloadUrl,
  getLatestReleaseMetadata,
  isR2Configured,
} from '@/lib/r2';

export const runtime = 'nodejs';

function compareSemver(a: string, b: string): number {
  const pa = a.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * GET /api/version
 * - Once Cloudflare R2 is configured: returns public non-sensitive version metadata ONLY (no direct binary URLs leaked).
 * - Before R2 is enabled: preserves backwards compatibility for existing v1.0.73 POS auto-updaters.
 */
export async function GET() {
  const release = await getLatestReleaseMetadata();

  if (isR2Configured()) {
    return NextResponse.json({
      version: `v${release.version}`,
      latestVersion: release.version,
      latest_version: `v${release.version}`,
      releaseDate: release.releaseDate,
      changelog: release.changelog,
      requires_license: true,
    });
  }

  const dmgUrl = 'https://kodo-solutions-web.vercel.app/Installation_Kodo_POS.dmg';
  const distUrl = `https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v${release.version}.zip`;
  const backendUrl = `https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/backend_v${release.version}.zip`;

  return NextResponse.json({
    version: `v${release.version}`,
    latestVersion: release.version,
    latest_version: `v${release.version}`,
    has_update: true,
    releaseDate: release.releaseDate,
    download_url: dmgUrl,
    downloadUrl: dmgUrl,
    dmgUrl,
    dmg_url: dmgUrl,
    distPatchUrl: distUrl,
    dist_patch_url: distUrl,
    backendPatch: { version: release.version, url: backendUrl },
    changelog: release.changelog,
  });
}

/**
 * POST /api/version
 * Called by Kōdo POS desktop app: { license_key, hardware_id, current_version, os }
 * Returns short-lived (10 min) Cloudflare R2 presigned URLs ONLY if the subscription is active.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const licenseKey = typeof body.license_key === 'string' ? body.license_key.trim() : '';
    const hardwareId = typeof body.hardware_id === 'string' ? body.hardware_id.trim().toUpperCase() : '';
    const currentVersion = typeof body.current_version === 'string' ? body.current_version.trim() : '0.0.0';
    const os = typeof body.os === 'string' && body.os.toLowerCase().includes('win') ? 'win' : 'mac';

    if (!licenseKey) {
      return NextResponse.json(
        {
          has_update: false,
          license_status: 'missing',
          error: 'Clé de licence requise pour vérifier les mises à jour.',
        },
        { status: 401 }
      );
    }

    const found = await findLicenseByKey(licenseKey);
    if (!found) {
      return NextResponse.json(
        {
          has_update: false,
          license_status: 'invalid',
          error: 'Clé de licence inconnue.',
        },
        { status: 404 }
      );
    }

    if (!isLicenseActive(found.record)) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodo-solutions-web.vercel.app';
      return NextResponse.json(
        {
          has_update: false,
          license_status: found.record.status,
          expires_at: found.record.expiryDate,
          renew_url: `${siteUrl}/kodo-pos?key=${encodeURIComponent(found.record.licenseKey)}`,
          error: 'Abonnement expiré ou suspendu — renouvelez pour recevoir les mises à jour.',
        },
        { status: 403 }
      );
    }

    if (
      found.record.hardware_id &&
      hardwareId &&
      found.record.hardware_id.toUpperCase() !== hardwareId
    ) {
      return NextResponse.json(
        {
          has_update: false,
          license_status: 'hardware_mismatch',
          error: 'Cette licence est liée à un autre poste.',
        },
        { status: 403 }
      );
    }

    const release = await getLatestReleaseMetadata();
    const hasUpdate = compareSemver(release.version, currentVersion) > 0;

    if (!hasUpdate) {
      return NextResponse.json({
        has_update: false,
        license_status: 'active',
        plan: found.record.plan,
        version: `v${release.version}`,
        latestVersion: release.version,
        releaseDate: release.releaseDate,
      });
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        {
          has_update: true,
          license_status: 'active',
          version: `v${release.version}`,
          latestVersion: release.version,
          changelog: release.changelog,
          error: 'Stockage Cloudflare R2 non configuré sur le serveur.',
        },
        { status: 503 }
      );
    }

    const installerKey = os === 'win' ? release.winObjectKey : release.macObjectKey;
    const installerFilename = os === 'win' ? release.winFilename : release.macFilename;

    const [signedInstallerUrl, signedPatchUrl, signedBackendPatchUrl] = await Promise.all([
      createPresignedDownloadUrl(installerKey, {
        expiresInSeconds: 600, // 10 minutes
        filename: installerFilename,
      }),
      createPresignedDownloadUrl(release.patchObjectKey, {
        expiresInSeconds: 600,
        filename: release.patchFilename,
      }),
      createPresignedDownloadUrl(release.backendPatchObjectKey, {
        expiresInSeconds: 600,
        filename: release.backendPatchFilename,
      }),
    ]);

    return NextResponse.json({
      has_update: true,
      license_status: 'active',
      plan: found.record.plan,
      version: `v${release.version}`,
      latestVersion: release.version,
      latest_version: `v${release.version}`,
      releaseDate: release.releaseDate,
      changelog: release.changelog,
      download_url: signedInstallerUrl,
      downloadUrl: signedInstallerUrl,
      distPatchUrl: signedPatchUrl,
      dist_patch_url: signedPatchUrl,
      backendPatch: { version: release.version, url: signedBackendPatchUrl },
      sha256: os === 'win' ? release.sha256Win : release.sha256Mac,
      sha256_patch: release.sha256Patch,
      expires_in_seconds: 600,
    });
  } catch (error) {
    console.error('[VERSION API] Erreur:', error);
    return NextResponse.json(
      { has_update: false, error: 'Erreur serveur lors de la vérification de mise à jour.' },
      { status: 500 }
    );
  }
}
