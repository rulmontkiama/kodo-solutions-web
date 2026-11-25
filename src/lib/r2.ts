import crypto from 'crypto';
import { adminDb } from '@/lib/firebase/admin';

export type ReleaseMetadata = {
  version: string;
  releaseDate: string;
  changelog: string;
  macObjectKey: string;
  winObjectKey: string;
  patchObjectKey: string;
  backendPatchObjectKey: string;
  macFilename: string;
  winFilename: string;
  patchFilename: string;
  backendPatchFilename: string;
  sha256Mac?: string;
  sha256Win?: string;
  sha256Patch?: string;
};

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      (process.env.R2_BUCKET_NAME || 'kodo-pos-releases')
  );
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function hmacSha256(key: string | Buffer, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Generates a short-lived AWS SigV4 presigned GET URL for a private Cloudflare R2 object
 * using pure Node.js crypto (zero external SDK dependency, edge & exFAT friendly).
 */
export async function createPresignedDownloadUrl(
  objectKey: string,
  options?: { expiresInSeconds?: number; filename?: string }
): Promise<string> {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME || 'kodo-pos-releases';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Configuration Cloudflare R2 incomplète (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).'
    );
  }

  const expiresIn = Math.max(1, Math.min(options?.expiresInSeconds ?? 300, 604800));
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = 'auto';
  const service = 's3';

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  const cleanKey = objectKey.replace(/^\/+/, '');
  const encodedKey = cleanKey.split('/').map(encodeRfc3986).join('/');
  const canonicalUri = `/${encodeRfc3986(bucket)}/${encodedKey}`;

  const queryParams: Array<[string, string]> = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', `${accessKeyId}/${credentialScope}`],
    ['X-Amz-Date', amzDate],
    ['X-Amz-Expires', String(expiresIn)],
    ['X-Amz-SignedHeaders', 'host'],
  ];

  if (options?.filename) {
    queryParams.push([
      'response-content-disposition',
      `attachment; filename="${options.filename}"`,
    ]);
  }

  // AWS SigV4 requires strict ASCII code-point sorting on encoded query keys
  const canonicalQueryString = queryParams
    .map(([k, v]) => [encodeRfc3986(k), encodeRfc3986(v)] as [string, string])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = 'host';
  const canonicalRequest = [
    'GET',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  const kSigning = hmacSha256(kService, 'aws4_request');
  const signature = crypto
    .createHmac('sha256', kSigning)
    .update(stringToSign, 'utf8')
    .digest('hex');

  return `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

/**
 * Loads the latest release metadata from Firestore (`releases/latest`) with env-var fallback.
 * Allows pushing new POS versions without redeploying the Next.js site.
 */
export async function getLatestReleaseMetadata(): Promise<ReleaseMetadata> {
  const defaultVersion = process.env.KODO_LATEST_VERSION || '1.0.73';
  const fallback: ReleaseMetadata = {
    version: defaultVersion,
    releaseDate: process.env.KODO_RELEASE_DATE || '2026-09-20',
    changelog:
      process.env.KODO_LATEST_CHANGELOG ||
      "v1.0.73 :\n• Ventes : correction du refus « Article introuvable en base » et des ventes enregistrées sur un autre article. La taille choisie est respectée et le bon stock est décompté.\n• Import Shopify : réimporter le catalogue conserve les articles, leur TVA, leur marque et leur seuil d'alerte, et importe aussi les catalogues de plus de 250 produits.\n• Réglages : modifier le fond de caisse ou le seuil d'alerte n'efface plus l'adresse, le n° BCE, le n° de TVA ni l'adresse de l'imprimante ; un fond de caisse à 0 € est enregistré.\n• Démarrage : ouvrir l'application une seconde fois n'arrête plus le serveur en cours, et l'interface affichée est toujours la plus récente.",
    macObjectKey:
      process.env.KODO_R2_MAC_KEY || `releases/v${defaultVersion}/Installation_Kodo_POS.dmg`,
    winObjectKey:
      process.env.KODO_R2_WIN_KEY ||
      `releases/v${defaultVersion}/Kodo_POS_Windows_Standalone.zip`,
    patchObjectKey:
      process.env.KODO_R2_PATCH_KEY || `releases/v${defaultVersion}/dist_v${defaultVersion}.zip`,
    backendPatchObjectKey:
      process.env.KODO_R2_BACKEND_PATCH_KEY ||
      `releases/v${defaultVersion}/backend_v${defaultVersion}.zip`,
    macFilename: `Installation_Kodo_POS_v${defaultVersion}.dmg`,
    winFilename: `Kodo_POS_Windows_v${defaultVersion}.zip`,
    patchFilename: `dist_v${defaultVersion}.zip`,
    backendPatchFilename: `backend_v${defaultVersion}.zip`,
    sha256Mac: process.env.KODO_SHA256_MAC,
    sha256Win: process.env.KODO_SHA256_WIN,
    sha256Patch: process.env.KODO_SHA256_PATCH,
  };

  try {
    if (!adminDb) return fallback;
    const snap = await adminDb.collection('releases').doc('latest').get();
    if (!snap.exists) return fallback;

    const data = snap.data() || {};
    const version = String(data.version || defaultVersion).replace(/^v/i, '');
    return {
      version,
      releaseDate: data.releaseDate || data.release_date || fallback.releaseDate,
      changelog: data.changelog || fallback.changelog,
      macObjectKey: data.macObjectKey || data.mac_object_key || fallback.macObjectKey,
      winObjectKey: data.winObjectKey || data.win_object_key || fallback.winObjectKey,
      patchObjectKey: data.patchObjectKey || data.patch_object_key || fallback.patchObjectKey,
      backendPatchObjectKey:
        data.backendPatchObjectKey ||
        data.backend_patch_object_key ||
        fallback.backendPatchObjectKey,
      macFilename: data.macFilename || `Installation_Kodo_POS_v${version}.dmg`,
      winFilename: data.winFilename || `Kodo_POS_Windows_v${version}.zip`,
      patchFilename: data.patchFilename || `dist_v${version}.zip`,
      backendPatchFilename: data.backendPatchFilename || `backend_v${version}.zip`,
      sha256Mac: data.sha256Mac || data.sha256_mac,
      sha256Win: data.sha256Win || data.sha256_win,
      sha256Patch: data.sha256Patch || data.sha256_patch,
    };
  } catch (err) {
    console.warn('[R2] Lecture releases/latest ignorée, fallback env utilisé:', err);
    return fallback;
  }
}
