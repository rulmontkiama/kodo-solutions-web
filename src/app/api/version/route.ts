import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.6",
    latestVersion: "1.0.6",
    releaseDate: "2026-08-09",
    notes: "Nouveau panneau de personnalisation des statistiques et métriques sur-mesure (KPIs, Tailles, Rayons).",
    changelog: "Nouveau panneau de personnalisation des statistiques et métriques sur-mesure (KPIs, Tailles, Rayons).",
    downloadUrl: "https://kodo-solutions-web.vercel.app/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.6.zip",
    mandatory: false,
  });
}
