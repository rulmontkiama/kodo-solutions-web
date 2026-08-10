
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { nom, email, salon } = body || {};

    if (nom && email && salon) {
      // Sauvegarde optionnelle non-bloquante dans Firestore
      try {
        const { adminDb } = await import('@/lib/firebase/admin');
        if (adminDb) {
          const prospectRef = adminDb.collection('prospects').doc();
          await prospectRef.set({
            nom,
            email,
            salon,
            produit: 'Kōdo POS',
            statut: 'Nouveau',
            createdAt: new Date().toISOString()
          });
        }
      } catch (dbError) {
        console.warn('Sauvegarde Firestore ignorée:', dbError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prospect enregistré avec succès',
      downloadUrl: '/Kodo_POS_macOS.zip'
    });



  } catch (error: unknown) {
    console.error('Erreur Capture POS API:', error);

    return NextResponse.json({ 
      success: true, 
      downloadUrl: '/Kodo_POS_macOS.zip'
    });
  }
}
