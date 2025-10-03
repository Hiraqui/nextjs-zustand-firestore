/**
 * Server-side storage implementation for Zustand stores.
 *
 * This module provides a server-side storage adapter that persists Zustand store state
 * to Firebase Firestore temporary collections. It implements debounced writes to reduce
 * database operations and includes validation to prevent unnecessary writes.
 */

import { getTempCollectionAction } from "@/actions/get-temp-collection-action";
import { removeTempCollectionAction } from "@/actions/remove-temp-collection-action";
import { setTempCollectionAction } from "@/actions/set-temp-collection-action";

import type { StateStorage } from "zustand/middleware";

/** Default debounce delay in milliseconds for write operations */
const DEFAULT_DEBOUNCE = 5000;

/**
 * Function type for validating whether write operations should be performed.
 *
 * @returns `true` if writes should be allowed, `false` to skip writes
 */
type WriteValidatorFn = () => boolean;

/**
 * Configuration options for ServerStorage instance.
 */
interface ServerStorageOptions {
  /**
   * Alternative collection name to use instead of the store name.
   * Useful for namespacing or organizing different stores.
   */
  altCollectionName?: string;

  /**
   * Debounce delay in milliseconds for write operations.
   * Set to 0 to disable debouncing and write immediately.
   *
   * @default 5000
   */
  debounce?: number;
}
/**
 * Server-side storage implementation for Zustand stores.
 *
 * This class implements the Zustand StateStorage interface to provide
 * server-side persistence using Firebase Firestore temporary collections.
 * It includes debounced writes to optimize database operations and
 * validation to prevent unauthorized or unnecessary writes.
 *
 * @implements {StateStorage}
 */
class ServerStorage implements StateStorage {
  /** Timeout handle for debounced write operations */
  private timeout?: ReturnType<typeof setTimeout>;

  /**
   * Creates a new ServerStorage instance.
   *
   * @param writeValidator - Function to validate whether writes should be performed
   * @param options - Configuration options for the storage instance
   */
  constructor(
    private writeValidator: WriteValidatorFn,
    private options: ServerStorageOptions
  ) {}

  /**
   * Debounced write operation to prevent excessive database writes.
   *
   * This method cancels any pending write operation and schedules a new one
   * after the configured debounce delay. This is particularly useful for
   * frequently updated stores to avoid overwhelming the database.
   *
   * @param name - Collection name to write to
   * @param value - Serialized state value to store
   * @private
   */
  private debouncedSetItem = (name: string, value: string): void => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      const result = await setTempCollectionAction(name, value);
      if (!result.success) {
        console.error("Failed to set temp collection:", result.error);
      }
    }, this.options.debounce ?? DEFAULT_DEBOUNCE);
  };

  /**
   * Retrieves stored state data from the server.
   *
   * This method fetches the serialized state from Firebase Firestore
   * temporary collections. It uses the alternative collection name if
   * configured, otherwise falls back to the provided name.
   *
   * @param name - The store name to retrieve data for
   * @returns Promise resolving to the stored state string, or null if not found or error occurred
   */
  async getItem(name: string) {
    const result = await getTempCollectionAction(
      this.options.altCollectionName || name
    );
    if (!result.success) {
      console.error("Failed to get temp collection:", result.error);
      return null;
    }
    return result.data || null;
  }

  /**
   * Stores state data to the server with validation and debouncing.
   *
   * This method first validates whether the write operation should proceed
   * using the configured write validator. If validation passes, it performs
   * a debounced write to avoid excessive database operations.
   *
   * @param name - The store name to save data for
   * @param value - Serialized state data to store
   */
  async setItem(name: string, value: string) {
    if (this.writeValidator())
      this.debouncedSetItem(this.options.altCollectionName || name, value);
  }

  /**
   * Removes stored state data from the server.
   *
   * This method deletes the stored state from Firebase Firestore temporary
   * collections. It uses the alternative collection name if configured.
   *
   * @param name - The store name to remove data for
   */
  async removeItem(name: string) {
    const result = await removeTempCollectionAction(
      this.options.altCollectionName || name
    );
    if (!result.success) {
      console.error("Failed to remove temp collection:", result.error);
    }
  }
}

/**
 * Factory function to create a ServerStorage instance.
 *
 * This is the recommended way to create server storage for Zustand stores.
 * It provides sensible defaults while allowing full customization.
 *
 * @param writeValidator - Function to validate write operations (defaults to always allow)
 * @param options - Configuration options for the storage instance
 * @returns A configured ServerStorage instance
 */
export function createServerStorage(
  writeValidator: WriteValidatorFn = () => true,
  options: ServerStorageOptions = {}
) {
  const storage = new ServerStorage(writeValidator, options);

  return storage;
}
