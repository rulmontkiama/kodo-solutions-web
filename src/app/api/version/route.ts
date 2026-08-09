import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    latestVersion: "1.0.3",
    releaseDate: "2026-08-09",
    downloadUrl: "https://kōdo-solutions.com/Installation_Kodo_POS.dmg",
    mandatory: false,
    changelog: "Connexion par Code PIN Vendeur au lancement et Téléchargement interactif des exports comptables Pro.",
  });
}
