/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let dbInstance: any = null;
let authInstance: any = null;

try {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey ? rawKey.replace(/\\n/g, '\n') : undefined;

    if (projectId && clientEmail && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
      dbInstance = getFirestore();
      authInstance = getAuth();
    }
  } else {
    dbInstance = getFirestore();
    authInstance = getAuth();
  }
} catch (e) {
  console.warn('Firebase Admin safe init fallback:', e);
}

export const adminDb = dbInstance;
export const adminAuth = authInstance;
