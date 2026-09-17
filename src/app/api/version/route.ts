import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "v1.0.64",
    latestVersion: "1.0.64",
    latest_version: "v1.0.64",
    has_update: true,
    releaseDate: "2026-09-17",
    download_url: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.64.zip",
    distPatchUrl: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.64.zip",
    dist_patch_url: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.64.zip",
    changelog: "v1.0.64 :\n• Seuil d'alerte général : Enregistrement direct et instantané depuis les paramètres (bouton vert dédié), sans bloquer sur les autres réglages.\n• Synchronisation automatique des stocks : Vos articles sans seuil spécifique adoptent immédiatement le seuil général et actualisent leur alerte en temps réel sans rafraîchir la page.\n• Imprimante & Tickets de caisse : Résolution définitive du message « Moteur local non reconnu » et garantie d'une impression fluide et continue de tous vos tickets.\n• Fiches produits & Actions groupées : Prise en compte immédiate des seuils de réapprovisionnement par lot ou à l'unité dans votre inventaire."
  });
}
