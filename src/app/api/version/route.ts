import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    latestVersion: "1.0.2",
    releaseDate: "2026-08-09",
    downloadUrl: "https://kōdo-solutions.com/Installation_Kodo_POS.dmg",
    mandatory: false,
    changelog: "Version 1.0.2 (Test) : Test de notification et de téléchargement de mise à jour à distance.",
  });
}
