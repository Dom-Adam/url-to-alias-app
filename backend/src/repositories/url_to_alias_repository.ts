import database from "../lmdb";

export const EntryExisted = "alias already exists";
export const WriteSuccessful = "write was successful";
export const WriteFailed = "write failed";

export async function repoCreate(alias: string, url: string): Promise<string> {
  let writeSuccessfull: boolean;
  if (!database.doesExist(alias)) {
    writeSuccessfull = await database.put(alias, url);

    return writeSuccessfull ? WriteSuccessful : WriteFailed;
  }
  return EntryExisted;
}

export function repoFind(alias: string): string | undefined {
  return database.get(alias);
}
