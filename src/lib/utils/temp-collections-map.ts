import { TEMP_COLLECTIONS } from "../firebase/config";
import { STORAGES } from "@/store/client-storages";

/**
 * SECURITY: Server-side only mapping between client storage names and server collection names
 *
 * This mapping ensures:
 * 1. Client only knows storage names (e.g., "onboarding-storage")
 * 2. Server translates these to secure collection names (e.g., "temp-onboarding")
 * 3. No server collection names are ever exposed to the client
 *
 * Used by temp collection actions to translate between client and server
 *
 * This mapping is automatically generated from STORAGES and TEMP_COLLECTIONS,
 * so no manual updates are needed when adding new storage/collection pairs.
 */
export const TEMP_COLLECTIONS_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(STORAGES).map(([key, storageName]) => [
    storageName,
    TEMP_COLLECTIONS[key as keyof typeof TEMP_COLLECTIONS],
  ])
);

/**
 * Type-safe helper to get collection name from storage name
 * Returns undefined for invalid storage names to prevent unauthorized access
 *
 * @param storageName - The client storage name to map
 * @returns The server collection name or undefined if invalid
 */
export function getCollectionFromStorage(
  storageName: string
): string | undefined {
  return TEMP_COLLECTIONS_MAP[storageName];
}
