/**
 * @jest-environment node
 */

import { setTempCollectionAction } from "./set-temp-collection-action";
import { getServerFirestore } from "@/lib/firebase/server-app";
import { setTempCollection } from "@/lib/firebase/firestores";

// Mock dependencies
jest.mock("@/lib/firebase/server-app", () => ({
  getServerFirestore: jest.fn(),
}));

jest.mock("@/lib/firebase/firestores", () => ({
  setTempCollection: jest.fn(),
}));

jest.mock("@/lib/utils/temp-collections-map", () => ({
  TEMP_COLLECTIONS_MAP: {
    "valid-collection": "server-collection-name",
  },
}));

const mockGetServerFirestore = getServerFirestore as jest.MockedFunction<
  typeof getServerFirestore
>;
const mockSetTempCollection = setTempCollection as jest.MockedFunction<
  typeof setTempCollection
>;

describe("setTempCollectionAction", () => {
  const mockDb = {} as never;
  const mockUser = { uid: "test-user-id" } as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully sets temp collection with valid data", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockSetTempCollection.mockResolvedValue();

    const result = await setTempCollectionAction(
      "valid-collection",
      "test-data"
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
    expect(mockSetTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name",
      "test-data"
    );
  });

  it("returns error for invalid collection", async () => {
    const result = await setTempCollectionAction(
      "invalid-collection",
      "test-data"
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid collection");
    expect(mockGetServerFirestore).not.toHaveBeenCalled();
    expect(mockSetTempCollection).not.toHaveBeenCalled();
  });

  it("returns error when user not found", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: null,
    });

    const result = await setTempCollectionAction(
      "valid-collection",
      "test-data"
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
    expect(mockSetTempCollection).not.toHaveBeenCalled();
  });

  it("returns error when getServerFirestore throws", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerFirestore.mockRejectedValue(new Error("Firebase error"));

    const result = await setTempCollectionAction(
      "valid-collection",
      "test-data"
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to set temp collection");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error setting temp collection:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns error when setTempCollection throws", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockSetTempCollection.mockRejectedValue(new Error("Firestore error"));

    const result = await setTempCollectionAction(
      "valid-collection",
      "test-data"
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to set temp collection");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error setting temp collection:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("maps collection name correctly", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockSetTempCollection.mockResolvedValue();

    await setTempCollectionAction("valid-collection", "test-data");

    expect(mockSetTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name", // Mapped from TEMP_COLLECTIONS_MAP
      "test-data"
    );
  });

  it("handles empty value", async () => {
    mockGetServerFirestore.mockResolvedValue({
      db: mockDb,
      currentUser: mockUser,
    });
    mockSetTempCollection.mockResolvedValue();

    const result = await setTempCollectionAction("valid-collection", "");

    expect(result.success).toBe(true);
    expect(mockSetTempCollection).toHaveBeenCalledWith(
      mockDb,
      "test-user-id",
      "server-collection-name",
      ""
    );
  });
});
