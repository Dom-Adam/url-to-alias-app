import express from "express";
import { validationResult } from "express-validator";
import {
  EntryExisted,
  repoCreate,
  repoFind,
  WriteFailed,
  WriteSuccessful,
} from "../repositories/url_to_alias_repository";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

// @ts-expect-error
export async function controllerCreate(
  req: express.Request,
  res: express.Response
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const alias: string =
    typeof req.body.alias === "string" && req.body.alias !== ""
      ? req.body.alias
      : uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          length: 2,
        });
  const url: string = req.body["url"];
  const repoResponse = await repoCreate(alias, url);

  if (repoResponse == WriteSuccessful) {
    res.status(201).json({ url: url, alias: alias, msg: WriteSuccessful });
  } else if (repoResponse == EntryExisted) {
    res.json({ msg: EntryExisted });
  } else {
    res.json({ msg: WriteFailed }).sendStatus(507);
  }
}

export function controllerFind(req: express.Request, res: express.Response) {
  const repoResponse = repoFind(req.params.alias);

  if (repoResponse == undefined) {
    res.sendStatus(404);
  } else {
    res.redirect(repoResponse);
  }
}
