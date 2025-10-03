// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const SESSION_COOKIE = "__session";

/**
 * Server-side collection names for Firestore temp collections
 * These should NEVER be exposed to the client for security reasons
 * Only server-side actions should have access to these names
 */
export const TEMP_COLLECTIONS = {
  onboarding: "temp-onboarding",
};

export const TEMP_COLLECTIONS_NAMES = Object.values(TEMP_COLLECTIONS);
// Type helper for temp collection keys

export type TempCollectionKeys = keyof typeof TEMP_COLLECTIONS;
