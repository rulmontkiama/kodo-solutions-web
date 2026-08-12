import { adminDb } from '@/lib/firebase/admin';

export interface LicenseRecord {
  licenseKey: string;
  email: string;
  customerName?: string;
  plan: string;
  status: 'active' | 'suspended' | 'expired';
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  expiryDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export function generateLicenseKey(plan?: string): string {
  const parts = Array.from({ length: 4 }, () => 
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  const prefix = plan ? `KODO-${plan.toUpperCase()}` : 'KODO';
  return `${prefix}-${parts.join('-')}`;
}

export function generateReferralCode(name: string): string {
  const cleanName = (name || 'USER')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 8);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REF-${cleanName}-${randomNum}`;
}

export async function createLicenseRecord(params: {
  email: string;
  customerName?: string;
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  referredBy?: string;
}): Promise<LicenseRecord> {
  const licenseKey = generateLicenseKey(params.plan);
  const referralCode = generateReferralCode(params.customerName || params.email.split('@')[0]);

  let expiryDate: string | undefined;
  if (['starter', 'pro', 'max', 'monthly'].includes(params.plan)) {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    expiryDate = d.toISOString().split('T')[0];
  } else if (params.plan === 'annual') {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    expiryDate = d.toISOString().split('T')[0];
  } else {
    // Lifetime -> 2099
    expiryDate = '2099-12-31';
  }

  const record: LicenseRecord = {
    licenseKey,
    email: params.email,
    customerName: params.customerName || 'Client Kōdo',
    plan: params.plan,
    status: 'active',
    referralCode,
    referredBy: params.referredBy || '',
    createdAt: new Date().toISOString(),
    expiryDate,
    stripeCustomerId: params.stripeCustomerId || '',
    stripeSubscriptionId: params.stripeSubscriptionId || '',
  };

  // Save to Firestore licenses collection
  await adminDb.collection('pos_licenses').doc(licenseKey).set(record);
  
  // Save reverse lookup by email
  await adminDb.collection('user_licenses').doc(params.email.toLowerCase()).set({
    licenseKey,
    updatedAt: new Date().toISOString(),
  });

  return record;
}
