import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.12",
    latestVersion: "1.0.12",
    releaseDate: "2026-08-10",
    notes: "Mise à jour officielle de la barre de navigation latérale et de l'ergonomie Kōdo POS.",
    changelog: "Mise à jour officielle de la barre de navigation latérale et de l'ergonomie Kōdo POS.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.12.zip",
    mandatory: false,
  });
}




