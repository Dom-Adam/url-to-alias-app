import { mockDatabase } from "../mock-lmdb";
import {
  EntryExisted,
  repoCreate,
  repoFind,
  WriteFailed,
  WriteSuccessful,
} from "./url_to_alias_repository";

describe("UrlToAliasRepository", () => {
  const alias = "alias";
  const url = "url";

  describe("create", () => {
    it("calls the database with correct arguments", () => {
      mockDatabase.put.mockResolvedValue(true);
      repoCreate(alias, url);
      expect(mockDatabase.put).toBeCalledWith(alias, url);
    });

    it("returns correct data", async () => {
      mockDatabase.put.mockResolvedValue(true);
      await expect(repoCreate(alias, url)).resolves.toBe(WriteSuccessful);
    });

    it("returns WriteFailed if insertion failed", async () => {
      mockDatabase.doesExist.mockReturnValue(false);
      mockDatabase.put.mockResolvedValue(false);
      await expect(repoCreate(alias, url)).resolves.toBe(WriteFailed);
      expect(mockDatabase.doesExist).toHaveBeenCalledWith(alias);
      expect(mockDatabase.put).toHaveBeenCalledWith(alias, url);
    });

    it("returns WriteSuccessful if insertion succeeds", () => {
      mockDatabase.doesExist.mockReturnValue(false);
      mockDatabase.put.mockResolvedValue(true);
      expect(repoCreate(alias, url)).resolves.toBe(WriteSuccessful);
      expect(mockDatabase.doesExist).toHaveBeenCalledWith(alias);
      expect(mockDatabase.put).toHaveBeenCalledWith(alias, url);
    });

    it("returns EntryExisted if alias is already in database", () => {
      mockDatabase.doesExist.mockReturnValue(true);
      mockDatabase.put.mockResolvedValue(true);
      expect(repoCreate(alias, url)).resolves.toBe(EntryExisted);
      expect(mockDatabase.doesExist).toHaveBeenCalledWith(alias);
      expect(mockDatabase.put).not.toBeCalled();
    });
  });

  describe("find", () => {
    it("calls the database with the correct arguments", () => {
      mockDatabase.get.mockResolvedValue(url);
      repoFind(alias);
      expect(mockDatabase.get).toBeCalledWith(alias);
    });

    it("returns correct data", () => {
      mockDatabase.get.mockResolvedValue(alias).mockResolvedValue(url);
      expect(repoFind(alias)).resolves.toBe(url);
    });

    it("returns undefined if alias doesn't exist", () => {
      mockDatabase.get.mockResolvedValue(undefined);
      expect(repoFind(alias)).resolves.toBe(undefined);
    });
  });
});
