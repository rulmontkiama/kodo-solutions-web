import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.9",
    latestVersion: "1.0.9",
    releaseDate: "2026-08-10",
    notes: "Activation obligatoire par clé de licence Kōdo POS pour tout nouveau poste.",
    changelog: "Activation obligatoire par clé de licence Kōdo POS pour tout nouveau poste.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.9.zip",
    mandatory: false,
  });
}




