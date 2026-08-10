import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Vercel Cron might provide an auth token in headers depending on setup
// but we'll assume standard setup where we just execute it.
// Make sure to add RESEND_API_KEY in .env

export async function GET(request: Request) {
  const results = {
    api_version: { status: 'unknown', details: '' },
    mac_installer: { status: 'unknown', details: '' }
  };
  let hasErrors = false;
  const baseUrl = new URL(request.url).origin;

  // 1. Check API Version route
  try {
    const versionCheck = await fetch(`${baseUrl}/api/version`);
    if (versionCheck.ok) {
      results.api_version = { status: 'ok', details: 'API is reachable' };
    } else {
      results.api_version = { status: 'error', details: `HTTP ${versionCheck.status}` };
      hasErrors = true;
    }
  } catch (e: any) {
    results.api_version = { status: 'error', details: e.message };
    hasErrors = true;
  }

  // 2. Check MacOS Installer (Assuming URL is on Github Releases as per memory)
  // We use a dummy URL if memory didn't specify exactly, or we check the /updates/ directory.
  // The memory states: "The full Kodo POS macOS installer is hosted externally on GitHub Releases".
  // Let's assume a github release URL or a redirect route exists. We will ping a placeholder or standard URL.
  // If we had the exact URL, we'd ping it. We will use a dummy one and check if it resolves (HEAD request).
  const installerUrl = process.env.MAC_INSTALLER_URL || 'https://github.com/Kodo-Solutions/kodo-pos/releases/latest/download/Kodo_POS_macOS.zip';

  try {
    const installerCheck = await fetch(installerUrl, { method: 'HEAD' });
    if (installerCheck.ok || installerCheck.status === 302) { // 302 is common for github releases redirect
      results.mac_installer = { status: 'ok', details: 'Installer link is valid' };
    } else {
      results.mac_installer = { status: 'error', details: `HTTP ${installerCheck.status}` };
      hasErrors = true;
    }
  } catch (e: any) {
    results.mac_installer = { status: 'error', details: e.message };
    hasErrors = true;
  }

  // 3. Send Alert if needed
  if (hasErrors) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kodo-solutions.com';

    try {
      await resend.emails.send({
        from: 'Kodo Alerts <alerts@kodo-solutions.com>',
        to: [adminEmail],
        subject: '⚠️ Alerte Cron: Problème détecté sur Kōdo POS',
        html: `
          <h2>Rapport de santé du système</h2>
          <p>Une ou plusieurs vérifications ont échoué :</p>
          <ul>
            <li><strong>API Version:</strong> ${results.api_version.status} - ${results.api_version.details}</li>
            <li><strong>Mac Installer:</strong> ${results.mac_installer.status} - ${results.mac_installer.details}</li>
          </ul>
          <p>Merci de vérifier les logs serveur.</p>
        `
      });
      console.log('Alerte email envoyée suite à des erreurs de health check.');
    } catch (emailErr) {
      console.error('Erreur envoi email via Resend:', emailErr);
    }
  }

  return NextResponse.json({
    status: hasErrors ? 'degraded' : 'healthy',
    results,
    timestamp: new Date().toISOString()
  }, { status: hasErrors ? 500 : 200 });
}
