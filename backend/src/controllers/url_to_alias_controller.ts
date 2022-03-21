import express from "express";
import { validationResult } from "express-validator";
import {
  EntryExisted,
  repoCreate,
  repoFind,
  WriteFailed,
  WriteSuccessfull,
} from "../repositories/url_to_alias_repository";

// @ts-expect-error
export async function controllerCreate(
  req: express.Request,
  res: express.Response
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const alias: string = req.body.alias;
  const url: string = req.body.url;
  const repoResponse = await repoCreate(alias, url);

  if (repoResponse.msg == WriteSuccessfull) {
    res
      .status(201)
      .json({ url: url, alias: repoResponse.alias, msg: WriteSuccessfull });
  } else if (repoResponse.msg == EntryExisted) {
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
