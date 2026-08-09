import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.4",
    latestVersion: "1.0.4",
    releaseDate: "2026-08-09",
    notes: "Nouveau module de sécurité et changement interactif de Code PIN.",
    changelog: "Nouveau module de sécurité et changement interactif de Code PIN.",
    downloadUrl: "https://kodo-solutions-web.vercel.app/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.4.zip",
    mandatory: false,
  });
}
