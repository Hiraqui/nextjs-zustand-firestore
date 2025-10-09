import { createServerStorage } from "./server-storage";
import { getTempCollectionAction } from "@/actions/get-temp-collection-action";
import { setTempCollectionAction } from "@/actions/set-temp-collection-action";
import { removeTempCollectionAction } from "@/actions/remove-temp-collection-action";

// Mock the actions
jest.mock("@/actions/get-temp-collection-action", () => ({
  getTempCollectionAction: jest.fn(),
}));

jest.mock("@/actions/set-temp-collection-action", () => ({
  setTempCollectionAction: jest.fn(),
}));

jest.mock("@/actions/remove-temp-collection-action", () => ({
  removeTempCollectionAction: jest.fn(),
}));

const mockGetTempCollectionAction =
  getTempCollectionAction as jest.MockedFunction<
    typeof getTempCollectionAction
  >;
const mockSetTempCollectionAction =
  setTempCollectionAction as jest.MockedFunction<
    typeof setTempCollectionAction
  >;
const mockRemoveTempCollectionAction =
  removeTempCollectionAction as jest.MockedFunction<
    typeof removeTempCollectionAction
  >;

describe("createServerStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("getItem", () => {
    it("returns data from successful action", async () => {
      const testData = "test-data";
      mockGetTempCollectionAction.mockResolvedValue({
        success: true,
        data: testData,
      });

      const storage = createServerStorage();
      const result = await storage.getItem("test-collection");

      expect(result).toBe(testData);
      expect(mockGetTempCollectionAction).toHaveBeenCalledWith(
        "test-collection"
      );
    });

    it("returns null when action fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetTempCollectionAction.mockResolvedValue({
        success: false,
        error: "Test error",
      });

      const storage = createServerStorage();
      const result = await storage.getItem("test-collection");

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to get temp collection:",
        "Test error"
      );

      consoleErrorSpy.mockRestore();
    });

    it("returns null when data is null", async () => {
      mockGetTempCollectionAction.mockResolvedValue({
        success: true,
        data: null,
      });

      const storage = createServerStorage();
      const result = await storage.getItem("test-collection");

      expect(result).toBeNull();
    });

    it("uses alternative collection name when provided", async () => {
      mockGetTempCollectionAction.mockResolvedValue({
        success: true,
        data: "test-data",
      });

      const storage = createServerStorage(() => true, {
        altCollectionName: "alt-collection",
      });
      await storage.getItem("original-collection");

      expect(mockGetTempCollectionAction).toHaveBeenCalledWith(
        "alt-collection"
      );
    });
  });

  describe("setItem", () => {
    it("sets item when write validator returns true", async () => {
      mockSetTempCollectionAction.mockResolvedValue({ success: true });
      const writeValidator = jest.fn().mockReturnValue(true);

      const storage = createServerStorage(writeValidator, { debounce: 100 });
      await storage.setItem("test-collection", "test-data");

      expect(writeValidator).toHaveBeenCalled();

      // Fast-forward through debounce
      jest.advanceTimersByTime(100);

      // Allow async operations to complete
      await Promise.resolve();

      expect(mockSetTempCollectionAction).toHaveBeenCalledWith(
        "test-collection",
        "test-data"
      );
    }, 10000);

    it("does not set item when write validator returns false", async () => {
      const writeValidator = jest.fn().mockReturnValue(false);

      const storage = createServerStorage(writeValidator);
      await storage.setItem("test-collection", "test-data");

      expect(writeValidator).toHaveBeenCalled();

      jest.advanceTimersByTime(10000); // Advance past any debounce

      expect(mockSetTempCollectionAction).not.toHaveBeenCalled();
    });

    it("uses default write validator when none provided", async () => {
      mockSetTempCollectionAction.mockResolvedValue({ success: true });

      const storage = createServerStorage();
      await storage.setItem("test-collection", "test-data");

      jest.advanceTimersByTime(5000); // Default debounce

      await Promise.resolve();

      expect(mockSetTempCollectionAction).toHaveBeenCalledWith(
        "test-collection",
        "test-data"
      );
    }, 10000);

    it("uses alternative collection name when provided", async () => {
      mockSetTempCollectionAction.mockResolvedValue({ success: true });
      const writeValidator = jest.fn().mockReturnValue(true);

      const storage = createServerStorage(writeValidator, {
        altCollectionName: "alt-collection",
        debounce: 100,
      });
      await storage.setItem("original-collection", "test-data");

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(mockSetTempCollectionAction).toHaveBeenCalledWith(
        "alt-collection",
        "test-data"
      );
    }, 10000);

    it("logs error when setTempCollectionAction fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockSetTempCollectionAction.mockResolvedValue({
        success: false,
        error: "Test error",
      });

      const storage = createServerStorage(() => true, { debounce: 100 });
      await storage.setItem("test-collection", "test-data");

      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to set temp collection:",
        "Test error"
      );

      consoleErrorSpy.mockRestore();
    }, 10000);

    it("debounces multiple rapid calls", async () => {
      mockSetTempCollectionAction.mockResolvedValue({ success: true });

      const storage = createServerStorage(() => true, { debounce: 100 });

      // Make multiple rapid calls
      await storage.setItem("test-collection", "data1");
      await storage.setItem("test-collection", "data2");
      await storage.setItem("test-collection", "data3");

      // Fast-forward through debounce
      jest.advanceTimersByTime(100);
      await Promise.resolve();

      // Should only be called once with the last value
      expect(mockSetTempCollectionAction).toHaveBeenCalledTimes(1);
      expect(mockSetTempCollectionAction).toHaveBeenCalledWith(
        "test-collection",
        "data3"
      );
    }, 10000);

    it("uses custom debounce time", async () => {
      mockSetTempCollectionAction.mockResolvedValue({ success: true });

      const storage = createServerStorage(() => true, { debounce: 500 });
      await storage.setItem("test-collection", "test-data");

      // Should not be called before debounce time
      jest.advanceTimersByTime(400);
      await Promise.resolve();
      expect(mockSetTempCollectionAction).not.toHaveBeenCalled();

      // Should be called after debounce time
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      expect(mockSetTempCollectionAction).toHaveBeenCalled();
    }, 10000);

    it("handles zero debounce time", async () => {
      mockSetTempCollectionAction.mockResolvedValue({ success: true });

      const storage = createServerStorage(() => true, { debounce: 0 });
      await storage.setItem("test-collection", "test-data");

      // Should be called immediately with zero debounce
      jest.advanceTimersByTime(0);
      await Promise.resolve();
      expect(mockSetTempCollectionAction).toHaveBeenCalledWith(
        "test-collection",
        "test-data"
      );
    }, 10000);
  });

  describe("removeItem", () => {
    it("removes item successfully", async () => {
      mockRemoveTempCollectionAction.mockResolvedValue({ success: true });

      const storage = createServerStorage();
      await storage.removeItem("test-collection");

      expect(mockRemoveTempCollectionAction).toHaveBeenCalledWith(
        "test-collection"
      );
    });

    it("logs error when removal fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockRemoveTempCollectionAction.mockResolvedValue({
        success: false,
        error: "Test error",
      });

      const storage = createServerStorage();
      await storage.removeItem("test-collection");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to remove temp collection:",
        "Test error"
      );

      consoleErrorSpy.mockRestore();
    });

    it("uses alternative collection name when provided", async () => {
      mockRemoveTempCollectionAction.mockResolvedValue({ success: true });

      const storage = createServerStorage(() => true, {
        altCollectionName: "alt-collection",
      });
      await storage.removeItem("original-collection");

      expect(mockRemoveTempCollectionAction).toHaveBeenCalledWith(
        "alt-collection"
      );
    });
  });

  describe("factory function options", () => {
    it("creates storage with default options", () => {
      const storage = createServerStorage();
      expect(storage).toBeDefined();
      expect(typeof storage.getItem).toBe("function");
      expect(typeof storage.setItem).toBe("function");
      expect(typeof storage.removeItem).toBe("function");
    });

    it("creates storage with custom write validator", async () => {
      const customValidator = jest.fn().mockReturnValue(false);
      const storage = createServerStorage(customValidator);

      await storage.setItem("test", "data");
      expect(customValidator).toHaveBeenCalled();
    });

    it("creates storage with empty options object", () => {
      const storage = createServerStorage(() => true, {});
      expect(storage).toBeDefined();
    });
  });
});
