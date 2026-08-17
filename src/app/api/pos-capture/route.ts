import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
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
    const downloadUrl = operating_system === 'Windows' 
      ? '/Kodo_POS_v1.0.18_Windows_Pack.zip'
      : '/Installation_Kodo_POS_macOS.zip';

    return NextResponse.json({ 
      success: true, 
      message: 'Prospect enregistré avec succès',
      downloadUrl: downloadUrl
    });

  } catch (error: unknown) {
    console.error('Erreur Capture POS API:', error);

    return NextResponse.json({ 
      success: true, 
      downloadUrl: '/Installation_Kodo_POS_macOS.zip'
    });
  }
}
