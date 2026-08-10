import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.10",
    latestVersion: "1.0.10",
    releaseDate: "2026-08-10",
    notes: "Rétablissement du design original v1.0.7 de la barre de navigation latérale.",
    changelog: "Rétablissement du design original v1.0.7 de la barre de navigation latérale.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.10.zip",
    mandatory: false,
  });
}


