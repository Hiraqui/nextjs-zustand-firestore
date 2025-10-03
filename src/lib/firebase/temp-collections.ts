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
