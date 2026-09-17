import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "v1.0.63",
    latestVersion: "1.0.63",
    latest_version: "v1.0.63",
    has_update: true,
    releaseDate: "2026-09-17",
    download_url: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.63.zip",
    distPatchUrl: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.63.zip",
    dist_patch_url: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.63.zip",
    changelog: "v1.0.63 : 1) Paramètres > Stock & Alertes : réglage du seuil d'alerte par défaut pour toute la boutique (persistant en SQLite). 2) Stocks : nouvelle action groupée « Seuil alerte (N) » pour modifier le seuil ou rétablir le seuil général en masse. 3) Fiche Produit : affichage du seuil par défaut en placeholder/badge, vider le champ rétablit l'héritage sans forcer 5. 4) Compteur et filtre « Alertes » : respect strict du seuil effectif de chaque article (personnalisé ou global). 5) Fichier Client : correction du blocage de l'enregistrement lié au champ email."
  });
}
