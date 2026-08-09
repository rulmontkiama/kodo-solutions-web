import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, salon } = body;

    if (!nom || !email || !salon) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    // Sauvegarde optionnelle dans Firestore si configuré
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
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
      console.warn('Erreur Firestore non-bloquante:', dbError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prospect enregistré avec succès',
      downloadUrl: '/Installation_Kodo_POS.dmg'
    });
  } catch (error: any) {
    console.error('Erreur Capture POS API:', error);
    return NextResponse.json({ 
      success: true, 
      downloadUrl: '/Installation_Kodo_POS.dmg' 
    });
  }
}

