import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { generateLicenseKey } from '@/lib/license';

// Very basic backend auth checking for the admin API
function isAuthorized(request: Request) {
  const authHeader = request.headers.get('Authorization');
  // For production, use process.env.ADMIN_API_KEY
  const secret = process.env.ADMIN_API_KEY || 'admin123';
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!adminDb) {
       return NextResponse.json({ licenses: [] });
    }
    const snapshot = await adminDb.collection('pos_licenses').get();
    const licenses = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json({ licenses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { license_key, status } = await request.json();
    if (!adminDb || !license_key || !status) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await adminDb.collection('pos_licenses').doc(license_key).update({ status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update license' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { shop_name, plan } = await request.json();
    if (!adminDb) {
      return NextResponse.json({ error: 'DB not available' }, { status: 500 });
    }

    const licenseKey = generateLicenseKey();
    let expiryDate = '2099-12-31';
    if (plan === 'annual') {
       const d = new Date();
       d.setFullYear(d.getFullYear() + 1);
       expiryDate = d.toISOString().split('T')[0];
    } else if (plan === 'monthly') {
       const d = new Date();
       d.setMonth(d.getMonth() + 1);
       expiryDate = d.toISOString().split('T')[0];
    }

    const record = {
      license_key: licenseKey,
      status: 'active',
      expiry_date: expiryDate,
      hardware_id: '',
      shop_name: shop_name || 'Nouvelle Boutique',
      created_at: new Date().toISOString()
    };

    await adminDb.collection('pos_licenses').doc(licenseKey).set(record);
    return NextResponse.json({ success: true, license: record });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create license' }, { status: 500 });
  }
}
