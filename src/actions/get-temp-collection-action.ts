"use server";

import { getTempCollection } from "@/lib/firebase/firestores";
import { getServerFirestore } from "@/lib/firebase/server-app";
import type { ActionResult } from "@/types/action-result";
import { createErrorResult, createSuccessResult } from "@/types/action-result";
import { TEMP_COLLECTIONS_MAP } from "@/lib/utils/temp-collections-map";

/**
 * Server action to retrieve data from a temporary collection for the authenticated user.
 *
 * This action validates the collection name against the allowed collections map,
 * authenticates the user, and retrieves their stored data from Firestore.
 * The collection name is mapped from client storage name to server collection name
 * for security purposes.
 *
 * @param collection - The client storage name to map to server collection
 * @returns Promise resolving to ActionResult containing the stored data or error
 */
export async function getTempCollectionAction(
  collection: string
): Promise<ActionResult<string | null>> {
  try {
    const serverCollection = TEMP_COLLECTIONS_MAP[collection];
    if (!serverCollection) {
      return createErrorResult("Invalid collection");
    }

    const { db, currentUser } = await getServerFirestore();

    if (!currentUser) {
      return createErrorResult("User not found");
    }

    const value = await getTempCollection(
      db,
      currentUser.uid,
      serverCollection
    );
    return createSuccessResult(value);
  } catch (error) {
    console.error("Error getting temp collection:", error);
    return createErrorResult("Failed to get temp collection");
  }
}
