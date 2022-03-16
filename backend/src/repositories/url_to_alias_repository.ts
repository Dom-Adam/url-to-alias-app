import lmdb from "../lmdb";

class UrlToAliasRepository {
  async create(alias: string, url: string): Promise<boolean> {
    return await lmdb.put(alias, url);
  }

  find(alias: string): string {
    return lmdb.get(alias);
  }
}

export default new UrlToAliasRepository();
