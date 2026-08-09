import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    latestVersion: "1.0.1",
    releaseDate: "2026-08-09",
    downloadUrl: "https://kōdo-solutions.com/Installation_Kodo_POS.dmg",
    mandatory: false,
    changelog: "Version 1.0.1 : Optimisations des méta-données, améliorations des performances et stabilité globale.",
  });
}
