import database from "../lmdb";

export async function repoCreate(alias: string, url: string): Promise<boolean> {
  return await database.put(alias, url);
}

export function repoFind(alias: string): string | undefined {
  return database.get(alias);
}
