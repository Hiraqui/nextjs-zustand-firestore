"use server";

import { setTempCollection } from "@/lib/firebase/firestores";
import { getServerFirestore } from "@/lib/firebase/server-app";
import type { ActionResult } from "@/types/action-result";
import { createErrorResult, createSuccessResult } from "@/types/action-result";
import { TEMP_COLLECTIONS_MAP } from "@/lib/utils/temp-collections-map";

/**
 * Sets a value in a temporary collection for the current user
 * @param collection - The client storage name to map to server collection
 * @param value - The value to store
 * @returns Promise<ActionResult> - Success or error result
 */
export async function setTempCollectionAction(
  collection: string,
  value: string
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

    await setTempCollection(db, currentUser.uid, serverCollection, value);
    return createSuccessResult();
  } catch (error) {
    console.error("Error setting temp collection:", error);
    return createErrorResult("Failed to set temp collection");
  }
}
