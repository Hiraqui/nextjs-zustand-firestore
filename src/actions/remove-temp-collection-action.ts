"use server";

import { removeTempCollection } from "@/lib/firebase/firestores";
import { getServerFirestore } from "@/lib/firebase/server-app";
import type { ActionResult } from "@/types/action-result";
import { createErrorResult, createSuccessResult } from "@/types/action-result";
import { TEMP_COLLECTIONS_MAP } from "@/lib/utils/temp-collections-map";

/**
 * Removes a value from a temporary collection for the current user
 * @param collection - The client storage name to map to server collection
 * @returns Promise<ActionResult> - Success or error result
 */
export async function removeTempCollectionAction(
  collection: string
): Promise<ActionResult> {
  try {
    const serverCollection = TEMP_COLLECTIONS_MAP[collection];
    if (!serverCollection) {
      return createErrorResult("Invalid collection");
    }

    const { db, currentUser } = await getServerFirestore();

    if (!currentUser) {
      return createErrorResult("User not found");
    }

    await removeTempCollection(db, currentUser.uid, serverCollection);
    return createSuccessResult();
  } catch (error) {
    console.error("Error removing temp collection:", error);
    return createErrorResult("Failed to remove temp collection");
  }
}
