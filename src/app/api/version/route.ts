import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.14",
    latestVersion: "1.0.14",
    releaseDate: "2026-08-10",
    notes: "Harmonisation visuelle et alignement épuré de la barre d'actions supérieure de caisse.",
    changelog: "Harmonisation visuelle et alignement épuré de la barre d'actions supérieure de caisse.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.14.zip",
    mandatory: false,
  });
}







