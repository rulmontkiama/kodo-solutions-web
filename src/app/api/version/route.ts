import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.11",
    latestVersion: "1.0.11",
    releaseDate: "2026-08-10",
    notes: "Correction de l'étirement vertical 100% plein écran de la barre de navigation latérale.",
    changelog: "Correction de l'étirement vertical 100% plein écran de la barre de navigation latérale.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.11.zip",
    mandatory: false,
  });
}



