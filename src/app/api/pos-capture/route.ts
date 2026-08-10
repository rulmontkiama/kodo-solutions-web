import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    // Note: The form now sends full_name instead of nom, shop_name instead of salon,
    // phone, and operating_system.
    const { full_name, email, shop_name, phone, operating_system } = body || {};

    if (full_name && email && shop_name) {
      // Sauvegarde optionnelle non-bloquante dans Firestore
      try {
        const { adminDb } = await import('@/lib/firebase/admin');
        if (adminDb) {
          const leadRef = adminDb.collection('leads').doc();
          await leadRef.set({
            shop_name: shop_name || '',
            full_name: full_name || '',
            email: email || '',
            phone: phone || '',
            operating_system: operating_system || 'macOS',
            created_at: new Date().toISOString(),
            status: 'pending'
          });
        }
      } catch (dbError) {
        console.warn('Sauvegarde Firestore ignorée:', dbError);
      }
    }

    // Determine download URL based on OS
    let downloadUrl = "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip";
    if (operating_system === 'Windows') {
       // Using a placeholder or the same for now since we don't have a real Windows link in the prompt,
       // but typically we'd use a .exe or .zip for Windows.
       downloadUrl = "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_Windows_Setup.zip";
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prospect enregistré avec succès',
      downloadUrl: downloadUrl
    });

  } catch (error: unknown) {
    console.error('Erreur Capture POS API:', error);

    return NextResponse.json({ 
      success: true, 
      downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip" 
    });
  }
}
