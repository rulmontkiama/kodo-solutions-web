import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0.13",
    latestVersion: "1.0.13",
    releaseDate: "2026-08-10",
    notes: "Arrondi symétrique (28px) des coins supérieur et inférieur droits de la barre latérale.",
    changelog: "Arrondi symétrique (28px) des coins supérieur et inférieur droits de la barre latérale.",
    downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip",
    distPatchUrl: "https://kodo-solutions-web.vercel.app/updates/dist_v1.0.13.zip",
    mandatory: false,
  });
}





