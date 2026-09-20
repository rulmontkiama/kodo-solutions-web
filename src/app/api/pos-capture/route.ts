import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { full_name, email, shop_name, phone, city, accepted_terms, operating_system } = body || {};

    if (full_name && email && shop_name) {
      // Sauvegarde optionnelle non-bloquante dans Firestore
      try {
        const { adminDb } = await import('@/lib/firebase/admin');
        if (adminDb) {
          const leadRef = adminDb.collection('leads').doc();
          await leadRef.set({
            type: 'beta_pos_apparel',
            shop_name: shop_name || '',
            full_name: full_name || '',
            email: email || '',
            phone: phone || '',
            city: city || '',
            accepted_terms: Boolean(accepted_terms),
            operating_system: operating_system || 'macOS',
            created_at: new Date().toISOString(),
            status: 'beta_applicant'
          });
        }
      } catch (dbError) {
        console.warn('Sauvegarde Firestore ignorée:', dbError);
      }
    }

    // Determine download URL based on OS
    const downloadUrl = operating_system === 'Windows' 
      ? '/Kodo_POS_Windows_Standalone.zip'
      : '/Installation_Kodo_POS.dmg';

    return NextResponse.json({ 
      success: true, 
      message: 'Candidature enregistrée avec succès',
      downloadUrl: downloadUrl
    });

  } catch (error: unknown) {
    console.error('Erreur Capture POS API:', error);

    return NextResponse.json({ 
      success: true, 
      downloadUrl: '/Installation_Kodo_POS.dmg'
    });
  }
}
