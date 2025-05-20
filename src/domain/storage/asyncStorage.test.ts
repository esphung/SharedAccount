import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "./asyncStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("asyncStorage", () => {
  const key = "test-key";
  const value = { foo: "bar" };
  const stringifiedValue = JSON.stringify(value);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getItem", () => {
    it("should return parsed value when item exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stringifiedValue);
      const result = await asyncStorage.getItem<typeof value>(key);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it("should return null when item does not exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await asyncStorage.getItem<typeof value>(key);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe("setItem", () => {
    it("should stringify and save the value", async () => {
      await asyncStorage.setItem(key, value);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, stringifiedValue);
    });
  });

  describe("removeItem", () => {
    it("should remove the item", async () => {
      await asyncStorage.removeItem(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe("clear", () => {
    it("should clear all items", async () => {
      await asyncStorage.clear();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
});
