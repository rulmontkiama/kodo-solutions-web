import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "v1.0.45",
    latestVersion: "1.0.45",
    latest_version: "v1.0.45",
    has_update: true,
    releaseDate: "2026-09-15",
    download_url: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.45.zip",
    distPatchUrl: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.45.zip",
    dist_patch_url: "https://raw.githubusercontent.com/rulmontkiama/Kodo-Ecosystem/main/public/dist_v1.0.45.zip",
    changelog: "v1.0.45 : Renforcement du cœur backend (Calculs Panier Decimal, Grand Livre fiscal inaltérable SHA-256, Crash Recovery temps réel), HWID matériel Apple immuable, réimpression directe des tickets et personnalisation du logo thermique 80mm."
  });
}
