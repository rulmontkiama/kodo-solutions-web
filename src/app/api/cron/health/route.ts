import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // 1. Vérification de sécurité Vercel Cron (si applicable)
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const report: any = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {}
    };

    // 2. Vérification de l'intégrité du fichier de mise à jour POS
    const posFilePath = path.join(process.cwd(), 'public', 'updates', 'dist_v1.0.14.zip');

    try {
      const stats = fs.statSync(posFilePath);
      report.checks.posFile = {
        status: 'ok',
        exists: true,
        sizeInBytes: stats.size,
        lastModified: stats.mtime.toISOString()
      };

      // Alerte si le fichier est anormalement petit (< 100KB par exemple)
      if (stats.size < 100 * 1024) {
        report.status = 'warning';
        report.checks.posFile.warning = 'File size is unusually small (under 100KB)';
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      report.status = 'error';
      report.checks.posFile = {
        status: 'error',
        exists: false,
        error: err.message
      };
    }

    // 3. Vérifications supplémentaires possibles
    // Exemple : Vérifier si Firebase Admin s'initialise correctement (si applicable)

    // 4. (Optionnel) Envoi d'alerte si status !== 'healthy' (ex: Discord Webhook, Resend)
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    if (report.status !== 'healthy' && DISCORD_WEBHOOK_URL) {
      const markdownReport = `
⚠️ **Alerte Intégrité Kōdo Solutions** ⚠️
*Généré le ${new Date().toLocaleDateString('fr-FR')}*

Statut: **${report.status}**

Détails:
\`\`\`json
${JSON.stringify(report.checks, null, 2)}
\`\`\`
      `;

      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: markdownReport })
        });
      } catch (e) {
         console.error("Erreur lors de l'envoi de l'alerte discord:", e);
      }
    }

    return NextResponse.json(report, {
      status: report.status === 'error' ? 500 : 200
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Health Check Error:", error);
    return NextResponse.json({ error: "Échec du contrôle d'intégrité", details: error.message }, { status: 500 });
  }
}
