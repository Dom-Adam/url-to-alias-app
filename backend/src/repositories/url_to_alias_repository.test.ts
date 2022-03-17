import { mockDatabase } from "../mock-lmdb";
import { repoCreate, repoFind } from "./url_to_alias_repository";

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
      await expect(repoCreate(alias, url)).resolves.toBe(true);
    });

    it("returns false if insertion failed", async () => {
      mockDatabase.put.mockResolvedValue(false);
      await expect(repoCreate(alias, url)).resolves.toBe(false);
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
