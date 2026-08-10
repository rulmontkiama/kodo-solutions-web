import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.8",
    latestVersion: "1.0.8",
    releaseDate: "2026-08-10",
    notes: "Optimisation de l'ergonomie et de la réactivité responsive pour toutes les tailles d'écrans et mode fenêtre.",
    changelog: "Optimisation de l'ergonomie et de la réactivité responsive pour toutes les tailles d'écrans et mode fenêtre.",
    downloadUrl: "https://kodo-solutions-web.vercel.app/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.8.zip",
    mandatory: false,
  });
}
