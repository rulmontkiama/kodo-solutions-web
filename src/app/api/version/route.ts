import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.7",
    latestVersion: "1.0.7",
    releaseDate: "2026-08-10",
    notes: "Nouveau système complet de gestion des licences et activation par clé (Hardware Fingerprinting & Clé Kōdo).",
    changelog: "Nouveau système complet de gestion des licences et activation par clé (Hardware Fingerprinting & Clé Kōdo).",
    downloadUrl: "https://kodo-solutions-web.vercel.app/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.7.zip",
    mandatory: false,
  });
}

