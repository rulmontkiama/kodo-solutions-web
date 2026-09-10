import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "v1.0.44",
    has_update: true,
    latest_version: "v1.0.44",
    download_url: "https://raw.githubusercontent.com/rulmontkiama/kodo-solutions-web/main/public/Kodo_POS_v1.0.44_Windows_Pack.zip",
    changelog: "v1.0.44 : Synchronisation Shopify directe (Admin API 2025-01, SSL macOS), persistance complète des paramètres SQLite, lanceur Windows en 1-clic."
  });
}
