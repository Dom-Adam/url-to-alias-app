import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import database from "../lmdb";

export const EntryExisted = "alias already exists";
export const WriteSuccessfull = "write was successful";
export const WriteFailed = "write failed";

export interface RepoCreateResponse {
  msg: string;
  alias?: string;
}

export async function repoCreate(
  alias: string,
  url: string
): Promise<RepoCreateResponse> {
  let writeSuccessfull: boolean;

  if (!database.doesExist(alias) || alias == "") {
    let newAlias: string =
      typeof alias === "string" && alias !== ""
        ? alias
        : uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            length: 2,
          });

    while (database.doesExist(newAlias)) {
      newAlias = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length: 2,
      });
    }
    writeSuccessfull = await database.put(newAlias, url);

    return writeSuccessfull
      ? { msg: WriteSuccessfull, alias: newAlias }
      : { msg: WriteFailed, alias: newAlias };
  }
  return { msg: EntryExisted, alias };
}

export function repoFind(alias: string): string | undefined {
  return database.get(alias);
}
