import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { full_name, email, shop_name, phone, operating_system } = body || {};

    if (!email || !shop_name) {
      return NextResponse.json({ error: 'Email et nom du commerce requis.' }, { status: 400 });
    }

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
          status: 'pending',
        });
      }
    } catch (dbError) {
      console.warn('Sauvegarde Firestore ignorée:', dbError);
    }

    // No free public binary URL returned: downloads require an active subscription.
    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée. Choisissez une offre pour activer votre téléchargement.',
      redirectUrl: '/#pricing',
    });
  } catch (error: unknown) {
    console.error('Erreur Capture POS API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l’enregistrement de votre demande.' },
      { status: 500 }
    );
  }
}
