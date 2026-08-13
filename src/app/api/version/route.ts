import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "v1.0.18",
    has_update: true,
    latest_version: "v1.0.18",
    download_url: "https://github.com/rulmontkiama/Kodo-Ecosystem/archive/refs/tags/v1.0.18.zip",
    changelog: "Nouvelle interface React et correction du bug de suppression des produits/utilisateurs (persistance après redémarrage)."
  });
}
