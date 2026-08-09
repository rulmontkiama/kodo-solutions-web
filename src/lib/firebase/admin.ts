
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let dbInstance: any = null;
let authInstance: any = null;

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
      dbInstance = getFirestore();
      authInstance = getAuth();
    } catch (e) {
      console.warn('Firebase cert initialization error:', e);
    }
  }
} else {
  try {
    dbInstance = getFirestore();
    authInstance = getAuth();
  } catch (e) {
    console.warn('Firebase getFirestore error:', e);
  }
}

export const adminDb = dbInstance;
export const adminAuth = authInstance;

