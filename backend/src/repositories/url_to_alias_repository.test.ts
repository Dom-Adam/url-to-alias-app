import { mockDatabase } from "../mock-lmdb";
import {
  EntryExisted,
  repoCreate,
  repoFind,
  WriteFailed,
  WriteSuccessfull,
} from "./url_to_alias_repository";

describe("UrlToAliasRepository", () => {
  const alias = "alias";
  const url = "url";

  describe("create", () => {
    it("returns WriteFailed if insertion failed", async () => {
      mockDatabase.doesExist.mockReturnValue(false);
      mockDatabase.put.mockResolvedValue(false);
      await expect(repoCreate(alias, url)).resolves.toEqual({
        msg: WriteFailed,
        alias: alias,
      });
      expect(mockDatabase.doesExist).toHaveBeenCalledWith(alias);
      expect(mockDatabase.put).toHaveBeenCalledWith(alias, url);
    });

    it("returns WriteSuccessful if insertion succeeds", () => {
      mockDatabase.doesExist.mockReturnValue(false);
      mockDatabase.put.mockResolvedValue(true);
      expect(repoCreate(alias, url)).resolves.toEqual({
        msg: WriteSuccessfull,
        alias,
      });
      expect(mockDatabase.doesExist).toHaveBeenCalledWith(alias);
      expect(mockDatabase.put).toHaveBeenCalledWith(alias, url);
    });

    it("returns EntryExisted if alias is already in database", () => {
      mockDatabase.doesExist.mockReturnValue(true);
      mockDatabase.put.mockResolvedValue(true);
      expect(repoCreate(alias, url)).resolves.toEqual({
        msg: EntryExisted,
        alias,
      });
      expect(mockDatabase.doesExist).toHaveBeenCalledWith(alias);
      expect(mockDatabase.put).not.toBeCalled();
    });

    it("creates alias if none was specified", () => {
      mockDatabase.doesExist.mockReturnValueOnce(true);
      mockDatabase.doesExist.mockReturnValue(false);
      mockDatabase.put.mockResolvedValue(true);
    });
  });

  describe("find", () => {
    it("returns correct data", () => {
      const mock = mockDatabase.get
        .mockResolvedValue(alias)
        .mockResolvedValue(url);
      expect(repoFind(alias)).resolves.toBe(url);
      expect(mock).toHaveBeenCalledWith(alias);
    });

    it("returns undefined if alias doesn't exist", () => {
      const mock = mockDatabase.get.mockResolvedValue(undefined);
      expect(repoFind(alias)).resolves.toBe(undefined);
      expect(mock).toBeCalledWith(alias);
    });
  });
});
