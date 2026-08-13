import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    latestVersion: "1.0.17",
    releaseDate: "2026-08-13",
    downloadUrl: "https://github.com/rulmontkiama/Kodo-Ecosystem/releases/latest",
    mandatory: false,
    changelog: "Correction majeure : La suppression des produits et administrateurs est désormais définitive, même après le redémarrage de la caisse. Nouveau système de mise à jour intégré via GitHub (plus rapide et sécurisé). Le bouton de mise à jour ouvre désormais correctement le navigateur.",
  });
}
