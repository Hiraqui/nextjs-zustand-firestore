"use server";

import { setTempCollection } from "@/lib/firebase/firestores";
import { getServerFirestore } from "@/lib/firebase/server-app";
import type { ActionResult } from "@/types/action-result";
import { createErrorResult, createSuccessResult } from "@/types/action-result";
import { TEMP_COLLECTIONS_MAP } from "@/lib/utils/temp-collections-map";

/**
 * Server action to store data in a temporary collection for the authenticated user.
 *
 * This action validates the collection name against the allowed collections map,
 * authenticates the user, and stores their data in Firestore. The collection name
 * is mapped from client storage name to server collection name for security purposes.
 *
 * @param collection - The client storage name to map to server collection
 * @param value - The string value to store in the collection
 * @returns Promise resolving to ActionResult indicating success or failure
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
