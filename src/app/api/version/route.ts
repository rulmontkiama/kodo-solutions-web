import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.5",
    latestVersion: "1.0.5",
    releaseDate: "2026-08-09",
    notes: "Adaptation des graphiques et statistiques aux ventes de vêtements et prêt-à-porter (Tailles, Rayons, Tops Ventes).",
    changelog: "Adaptation des graphiques et statistiques aux ventes de vêtements et prêt-à-porter (Tailles, Rayons, Tops Ventes).",
    downloadUrl: "https://kodo-solutions-web.vercel.app/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.5.zip",
    mandatory: false,
  });
}
