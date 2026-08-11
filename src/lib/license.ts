import { adminDb } from '@/lib/firebase/admin';

export type LicensePlan = 'BASIC' | 'PRO' | 'ENTERPRISE';
export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING' | 'active' | 'suspended' | 'expired';

export const PLAN_FEATURES: Record<LicensePlan, string[]> = {
  BASIC: ['basic_sales', 'basic_inventory'],
  PRO: ['basic_sales', 'basic_inventory', 'advanced_stats', 'shopify_sync', 'nfs525_module'],
  ENTERPRISE: ['basic_sales', 'basic_inventory', 'advanced_stats', 'shopify_sync', 'nfs525_module', 'multi_cashier', 'priority_support']
};

export interface LicenseRecord {
  licenseKey: string;
  email: string;
  customerName?: string;
  plan: LicensePlan;
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  features: string[];
  hardware_id?: string;
  status: LicenseStatus;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  expiryDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export function generateLicenseKey(): string {
  const parts = Array.from({ length: 4 }, () => 
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  return `KODO-${parts.join('-')}`;
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
  plan?: LicensePlan;
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  referredBy?: string;
}): Promise<LicenseRecord> {
  const licenseKey = generateLicenseKey();
  const referralCode = generateReferralCode(params.customerName || params.email.split('@')[0]);

  let expiryDate: string | undefined;
  if (params.billingCycle === 'monthly') {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    expiryDate = d.toISOString().split('T')[0];
  } else if (params.billingCycle === 'annual') {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    expiryDate = d.toISOString().split('T')[0];
  } else {
    // Lifetime -> 2099
    expiryDate = '2099-12-31';
  }

  const plan = params.plan || 'PRO'; // Default to PRO if not specified
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES['PRO'];

  const record: LicenseRecord = {
    licenseKey,
    email: params.email,
    customerName: params.customerName || 'Client Kōdo',
    plan,
    billingCycle: params.billingCycle,
    features,
    status: 'ACTIVE',
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
