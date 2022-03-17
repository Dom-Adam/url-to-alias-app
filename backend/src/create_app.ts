import express from "express";
import { body, param } from "express-validator";
import {
  controllerCreate,
  controllerFind,
} from "./controllers/url_to_alias_controller";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.post(
    "/api/url",
    body("url").trim().toLowerCase().isURL(),
    body("alias").trim().toLowerCase(),
    controllerCreate
  );
  app.get(
    "/:alias",
    param("alias").trim().toLowerCase().isString(),
    controllerFind
  );

  return app;
}
