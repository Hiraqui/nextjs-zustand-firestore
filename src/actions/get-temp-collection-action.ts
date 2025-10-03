"use server";

import { getTempCollection } from "@/lib/firebase/firestores";
import { getServerFirestore } from "@/lib/firebase/server-app";
import type { ActionResult } from "@/types/action-result";
import { createErrorResult, createSuccessResult } from "@/types/action-result";
import { TEMP_COLLECTIONS_MAP } from "@/lib/utils/temp-collections-map";

/**
 * Gets a value from a temporary collection for the current user
 * @param collection - The client storage name to map to server collection
 * @returns Promise<ActionResult<string | null>> - Success with data or error result
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
