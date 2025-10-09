/**
 * @jest-environment node
 */

import { getTempCollectionAction } from "./get-temp-collection-action";
import { getServerFirestore } from "@/lib/firebase/server-app";
import { getTempCollection } from "@/lib/firebase/firestores";

// Mock dependencies
jest.mock("@/lib/firebase/server-app", () => ({
  getServerFirestore: jest.fn(),
}));

jest.mock("@/lib/firebase/firestores", () => ({
  getTempCollection: jest.fn(),
}));

jest.mock("@/lib/utils/temp-collections-map", () => ({
  TEMP_COLLECTIONS_MAP: {
    "valid-collection": "server-collection-name",
  },
}));

const mockGetServerFirestore = getServerFirestore as jest.MockedFunction<
  typeof getServerFirestore
>;
const mockGetTempCollection = getTempCollection as jest.MockedFunction<
  typeof getTempCollection
>;

describe("getTempCollectionAction", () => {
  const mockDb = {} as never;
  const mockUser = { uid: "test-user-id" } as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully gets temp collection with valid data", async () => {
    const testData = "test-collection-data";

    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockGetTempCollection.mockResolvedValue(testData);

    const result = await getTempCollectionAction("valid-collection");

    expect(result.success).toBe(true);
    expect(result.data).toBe(testData);
    expect(mockGetTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name"
    );
  });

  it("successfully gets null when no data exists", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockGetTempCollection.mockResolvedValue(null);

    const result = await getTempCollectionAction("valid-collection");

    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it("returns error for invalid collection", async () => {
    const result = await getTempCollectionAction("invalid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid collection");
    expect(mockGetServerFirestore).not.toHaveBeenCalled();
    expect(mockGetTempCollection).not.toHaveBeenCalled();
  });

  it("returns error when user not found", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: null,
    });

    const result = await getTempCollectionAction("valid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
    expect(mockGetTempCollection).not.toHaveBeenCalled();
  });

  it("returns error when getServerFirestore throws", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerFirestore.mockRejectedValue(new Error("Firebase error"));

    const result = await getTempCollectionAction("valid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to get temp collection");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting temp collection:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns error when getTempCollection throws", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockGetTempCollection.mockRejectedValue(new Error("Firestore error"));

    const result = await getTempCollectionAction("valid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to get temp collection");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting temp collection:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("maps collection name correctly", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockGetTempCollection.mockResolvedValue("data");

    await getTempCollectionAction("valid-collection");

    expect(mockGetTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name" // Mapped from TEMP_COLLECTIONS_MAP
    );
  });

  it("handles empty string data", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockGetTempCollection.mockResolvedValue("");

    const result = await getTempCollectionAction("valid-collection");

    expect(result.success).toBe(true);
    expect(result.data).toBe("");
  });
});
