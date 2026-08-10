import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.14",
    latestVersion: "1.0.14",
    releaseDate: "2026-08-10",
    notes: "Harmonisation visuelle et alignement épuré de la barre d'actions supérieure de caisse.",
    changelog: "Harmonisation visuelle et alignement épuré de la barre d'actions supérieure de caisse.",
    downloadUrl: "/updates/dist_v1.0.14.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.14.zip",
    mandatory: false,
  });
}
