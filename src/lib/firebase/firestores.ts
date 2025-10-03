/**
 * Firebase Firestore operations for temporary collections.
 *
 * This module provides CRUD operations for managing temporary user data
 * in Firebase Firestore. It includes validation to ensure only authorized
 * collections are accessed and proper error handling for all operations.
 *
 * All operations are scoped to individual users and validated against
 * a whitelist of allowed collection names for security.
 */

import type { FirebaseError } from "firebase/app";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  type Firestore,
} from "firebase/firestore/lite";

import { TEMP_COLLECTIONS_NAMES } from "./config";

/**
 * Retrieves a value from a user's temporary collection.
 *
 * This function fetches a document from the specified Firestore collection
 * using the user ID as the document ID. It validates the collection name
 * against a whitelist before attempting the operation.
 *
 * @param db - The Firestore database instance
 * @param userId - The unique identifier for the user
 * @param collection - The name of the temporary collection to read from
 * @returns Promise resolving to the stored value string, or null if not found or error occurred
 * @throws Error if the collection name is not in the allowed list
 */
export async function getTempCollection(
  db: Firestore,
  userId: string,
  collection: string
): Promise<string | null> {
  validateCollectionName(collection);
  try {
    const docRef = doc(db, getTempCollectionDocPath(userId, collection));
    const docSnap = await getDoc(docRef);

    return docSnap.data()?.value ?? null;
  } catch (error) {
    const err = error as FirebaseError;
    console.error(
      `Error fetching user's temp collection ${collection}:`,
      JSON.stringify(err, null, 2)
    );
    return null;
  }
}

/**
 * Stores a value in a user's temporary collection.
 *
 * This function creates or updates a document in the specified Firestore
 * collection using the user ID as the document ID. The value is stored
 * in a 'value' field within the document.
 *
 * @param db - The Firestore database instance
 * @param userId - The unique identifier for the user
 * @param collection - The name of the temporary collection to write to
 * @param value - The string value to store in the collection
 * @throws Error if the collection name is not in the allowed list
 * @throws FirebaseError if the Firestore operation fails
 */
export async function setTempCollection(
  db: Firestore,
  userId: string,
  collection: string,
  value: string
) {
  validateCollectionName(collection);
  await setDoc(doc(db, getTempCollectionDocPath(userId, collection)), {
    value,
  });
}

/**
 * Removes a user's document from a temporary collection.
 *
 * This function deletes the document associated with the user ID
 * from the specified Firestore collection. If the document doesn't
 * exist, the operation completes without error.
 *
 * @param db - The Firestore database instance
 * @param userId - The unique identifier for the user
 * @param collection - The name of the temporary collection to delete from
 * @throws Error if the collection name is not in the allowed list
 * @throws FirebaseError if the Firestore operation fails
 */
export async function removeTempCollection(
  db: Firestore,
  userId: string,
  collection: string
) {
  validateCollectionName(collection);
  await deleteDoc(doc(db, getTempCollectionDocPath(userId, collection)));
}

/**
 * Constructs the Firestore document path for a user's temporary collection.
 *
 * This utility function generates the standardized path used to store
 * temporary collection documents in Firestore. All temp collections
 * follow the pattern: users/{userId}/temp/{collectionName}
 *
 * @param userId - The unique identifier for the user
 * @param collection - The name of the temporary collection
 * @returns The complete Firestore document path string
 * @private
 */
function getTempCollectionDocPath(userId: string, collection: string) {
  return `users/${userId}/temp/${collection}`;
}

/**
 * Validates that a collection name is in the allowed list.
 *
 * This security function ensures that only predefined collection names
 * can be used with the temporary collection operations. This prevents
 * unauthorized access to other Firestore collections.
 *
 * @param name - The collection name to validate
 * @throws Error if the collection name is not in the TEMP_COLLECTIONS_NAMES whitelist
 * @private
 */
function validateCollectionName(name: string) {
  if (!TEMP_COLLECTIONS_NAMES.includes(name)) {
    console.error("Invalid server collection");
    throw new Error("Invalid server collection");
  }
}
