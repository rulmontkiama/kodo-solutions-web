import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';

function generateLicenseKey() {
  const parts = [];
  for (let i = 0; i < 4; i++) {
    parts.push(crypto.randomBytes(3).toString('hex').toUpperCase());
  }
  return parts.join('-');
}

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const snapshot = await adminDb.collection('licenses').orderBy('created_at', 'desc').get();
    const licenses = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ licenses });
  } catch (error) {
    console.error('Error fetching licenses:', error);
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const body = await request.json();
    const { lead_id, validity_months, type } = body;

    if (!lead_id) {
      return NextResponse.json({ error: "Missing lead_id" }, { status: 400 });
    }

    const licenseKey = generateLicenseKey();
    const createdAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (validity_months || 12));

    const licenseDoc = {
      key: licenseKey,
      lead_id,
      type: type || 'pro',
      status: 'active',
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString()
    };

    const docRef = await adminDb.collection('licenses').add(licenseDoc);

    // Update lead with license association
    await adminDb.collection('leads').doc(lead_id).update({
      has_license: true,
      license_id: docRef.id,
      status: 'converted'
    });

    return NextResponse.json({ success: true, license: { id: docRef.id, ...licenseDoc } });
  } catch (error) {
    console.error('Error creating license:', error);
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: "Missing id or updates" }, { status: 400 });
    }

    await adminDb.collection('licenses').doc(id).update(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating license:', error);
    return NextResponse.json({ error: "Failed to update license" }, { status: 500 });
  }
}
