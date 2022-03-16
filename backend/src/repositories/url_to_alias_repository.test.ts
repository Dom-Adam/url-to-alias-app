import { mockDatabase } from "../mock-lmdb";
import UrlToAliasRepository from "./url_to_alias_repository";

describe("UrlToAliasRepository", () => {
  let urlToAliasRepository: typeof UrlToAliasRepository;
  const alias = "alias";
  const url = "url";

  beforeEach(() => {
    urlToAliasRepository = UrlToAliasRepository;
  });

  describe("create", () => {
    it("calls the database with correct arguments", () => {
      mockDatabase.put.mockResolvedValue(true);
      urlToAliasRepository.create(alias, url);
      expect(mockDatabase.put).toBeCalledWith(alias, url);
    });

    it("returns correct data", async () => {
      mockDatabase.put.mockResolvedValue(true);
      await expect(urlToAliasRepository.create(alias, url)).resolves.toBe(true);
    });
  });

  describe("find", () => {
    it("calls the database with the correct arguments", () => {
      mockDatabase.get.mockResolvedValue(url);
      urlToAliasRepository.find(alias);
      expect(mockDatabase.get).toBeCalledWith(alias);
    });

    it("returns correct data", () => {
      mockDatabase.get.mockResolvedValue(alias).mockResolvedValue(url);
      expect(urlToAliasRepository.find(alias)).resolves.toBe(url);
    });
  });
});
