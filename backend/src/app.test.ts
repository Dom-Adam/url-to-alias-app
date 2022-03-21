import supertest from "supertest";
import { createApp } from "./create_app";
import database from "./lmdb";
import { WriteSuccessfull } from "./repositories/url_to_alias_repository";

const app = createApp();

beforeEach(() => {
  database.clearSync();
});

describe("UrlToAlias controller", () => {
  describe("create", () => {
    it("sends status 400 if validation failed", async () => {
      const res = await supertest(app)
        .post("/api/url")
        .send({ url: "url", alias: "alias" });

      expect(res.statusCode).toBe(400);
    });

    it("normalizes url and alias", async () => {
      const alias = " Git  ";
      const url = " Https://GitHub.com/ ";
      const res = await supertest(app)
        .post("/api/url")
        .send({ url: url, alias: alias });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        alias: "git",
        url: "https://github.com/",
        msg: "write was successful",
      });
    });

    it("should create alias if not provided", async () => {
      const alias = null;
      const url = "https://github.com";
      const res = await supertest(app)
        .post("/api/url")
        .send({ url: url, alias: alias });

      expect(res.statusCode).toBe(201);
      expect(res.body.msg).toBe(WriteSuccessfull);
      expect(res.body.url).toBe("https://github.com");
      expect(res.body.alias).toBeTruthy();
    });
  });

  describe("find", () => {
    it("should answer with redirect if alias exists", async () => {
      await database.put("git", "https://github.com");
      const res = await supertest(app).get("/git").send();

      expect(res.redirect);
    });

    it("should respond with 404 if alias doesnt extists", async () => {
      const res = await supertest(app).get("/git").send();

      expect(res.notFound);
    });
  });
});
