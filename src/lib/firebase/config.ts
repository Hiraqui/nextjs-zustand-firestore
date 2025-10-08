/**
 * Firebase configuration object containing all necessary credentials and settings.
 * All values are loaded from environment variables for security.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * The name of the session cookie used for authentication.
 * Must be "__session" for Firebase Hosting compatibility.
 */
export const SESSION_COOKIE = "__session";

/**
 * Server-side collection names for Firestore temp collections
 * These should NEVER be exposed to the client for security reasons
 * Only server-side actions should have access to these names
 */
export const TEMP_COLLECTIONS = {
  onboarding: "temp-onboarding",
};

/**
 * Array of all available temp collection names.
 * Used for validation in server actions to ensure only authorized collections are accessed.
 */
export const TEMP_COLLECTIONS_NAMES = Object.values(TEMP_COLLECTIONS);

/**
 * Type representing the available keys for temp collections.
 * Provides type safety when referencing temp collection configurations.
 */
export type TempCollectionKeys = keyof typeof TEMP_COLLECTIONS;
