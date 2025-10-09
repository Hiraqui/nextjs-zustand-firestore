/**
 * @jest-environment node
 */

import { removeTempCollectionAction } from "./remove-temp-collection-action";
import { getServerFirestore } from "@/lib/firebase/server-app";
import { removeTempCollection } from "@/lib/firebase/firestores";

// Mock dependencies
jest.mock("@/lib/firebase/server-app", () => ({
  getServerFirestore: jest.fn(),
}));

jest.mock("@/lib/firebase/firestores", () => ({
  removeTempCollection: jest.fn(),
}));

jest.mock("@/lib/utils/temp-collections-map", () => ({
  TEMP_COLLECTIONS_MAP: {
    "valid-collection": "server-collection-name",
  },
}));

const mockGetServerFirestore = getServerFirestore as jest.MockedFunction<
  typeof getServerFirestore
>;
const mockRemoveTempCollection = removeTempCollection as jest.MockedFunction<
  typeof removeTempCollection
>;

describe("removeTempCollectionAction", () => {
  const mockDb = {} as never;
  const mockUser = { uid: "test-user-id" } as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully removes temp collection", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockRemoveTempCollection.mockResolvedValue();

    const result = await removeTempCollectionAction("valid-collection");

    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
    expect(mockRemoveTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name"
    );
  });

  it("returns error for invalid collection", async () => {
    const result = await removeTempCollectionAction("invalid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid collection");
    expect(mockGetServerFirestore).not.toHaveBeenCalled();
    expect(mockRemoveTempCollection).not.toHaveBeenCalled();
  });

  it("returns error when user not found", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: null,
    });

    const result = await removeTempCollectionAction("valid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
    expect(mockRemoveTempCollection).not.toHaveBeenCalled();
  });

  it("returns error when getServerFirestore throws", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerFirestore.mockRejectedValue(new Error("Firebase error"));

    const result = await removeTempCollectionAction("valid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to remove temp collection");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error removing temp collection:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns error when removeTempCollection throws", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockRemoveTempCollection.mockRejectedValue(new Error("Firestore error"));

    const result = await removeTempCollectionAction("valid-collection");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to remove temp collection");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error removing temp collection:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("maps collection name correctly", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockRemoveTempCollection.mockResolvedValue();

    await removeTempCollectionAction("valid-collection");

    expect(mockRemoveTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name" // Mapped from TEMP_COLLECTIONS_MAP
    );
  });
});
