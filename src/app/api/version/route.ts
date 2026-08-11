import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.15",
    latestVersion: "1.0.15",
    releaseDate: "2026-08-11",
    notes: "Intégration du plan de permissions de licence et restriction dynamique des fonctionnalités Shopify et Clôture Z.",
    changelog: "Intégration du plan de permissions de licence et restriction dynamique des fonctionnalités Shopify et Clôture Z.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.15.zip",
    mandatory: false,
  });
}
