import { NextResponse } from 'next/server';

const SERVICE_LABELS: Record<string, string> = {
  pos: 'POS',
  POS: 'POS',
  bookings: 'Bookings',
  Bookings: 'Bookings',
  web: 'Web',
  Web: 'Web',
  bundle: 'Pack Global',
  'Pack Global': 'Pack Global',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, phone, message } = body;

    if (!name || !email || !service) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const normalizedService = SERVICE_LABELS[service] || service;
    const NOTION_TOKEN = process.env.NOTION_TOKEN;
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

    // Si les clés ne sont pas configurées, on simule un succès pour le développement
    if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
      console.warn("⚠️ Clés Notion manquantes. Simulation d'enregistrement réussie.");
      return NextResponse.json({ success: true, simulated: true });
    }

    const childrenBlocks: Array<Record<string, unknown>> = [];
    if (phone) {
      childrenBlocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `Téléphone : ${phone}` } }],
        },
      });
    }
    if (message) {
      childrenBlocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `Précisions : ${message}` } }],
        },
      });
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          'Nom du commerce': {
            title: [{ text: { content: name } }],
          },
          Email: {
            email: email,
          },
          Branche: {
            select: { name: normalizedService },
          },
          Statut: {
            status: { name: 'Lead Entrant' },
          },
          'Date de demande': {
            date: { start: new Date().toISOString() },
          },
        },
        ...(childrenBlocks.length > 0 ? { children: childrenBlocks } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API Notion:', errorText);
      return NextResponse.json({ error: 'Erreur lors de la communication avec Notion' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur serveur API:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
