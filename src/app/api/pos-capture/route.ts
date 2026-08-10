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

    const directDownloadUrl = "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip";

    return NextResponse.json({ 
      success: true, 
      message: 'Prospect enregistré avec succès',
      downloadUrl: directDownloadUrl
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: true, 
      downloadUrl: "https://github.com/rulmontkiama/kodo-solutions-web/releases/download/v1.0.9/Kodo_POS_macOS_Installer.zip" 
    });
  }
}

