import supertest from "supertest";
import { createApp } from "../create_app";
import * as UrlToAliasRepository from "../repositories/url_to_alias_repository";

const app = createApp();

describe("UrlToAlias controller", () => {
  describe("create", () => {
    it("sends status 400 if validation failed", async () => {
      jest.spyOn(UrlToAliasRepository, "repoCreate").mockResolvedValue(true);
      const res = await supertest(app)
        .post("/api/url")
        .send({ url: "url", alias: "alias" });

      expect(res.statusCode).toBe(400);
    });

    it("normalizes url and alias", async () => {
      const alias = " Git  ";
      const url = " Https://GitHub.com/ ";
      const mock = jest
        .spyOn(UrlToAliasRepository, "repoCreate")
        .mockResolvedValue(true);
      await supertest(app).post("/api/url").send({ url: url, alias: alias });

      expect(mock).toHaveBeenCalledWith("git", "https://github.com/");
    });

    it("should create alias if not provided", async () => {
      const alias = null;
      const url = " Https://GitHub.com/ ";
      const mock = jest
        .spyOn(UrlToAliasRepository, "repoCreate")
        .mockResolvedValue(true);
      await supertest(app).post("/api/url").send({ url: url, alias: alias });

      expect(mock).toBeCalledWith(
        typeof alias === "string",
        "https://github.com/"
      );
    });
  });

  describe("find", () => {
    it("should answer with redirect if alias exists", async () => {
      const mock = jest
        .spyOn(UrlToAliasRepository, "repoFind")
        .mockReturnValue("https://github.com/");

      const res = await supertest(app).get("/git").send();

      expect(mock).toHaveBeenCalledWith("git");
      expect(res.redirect);
    });

    it("should respond with 404 if alias doesnt extists", async () => {
      const mock = jest
        .spyOn(UrlToAliasRepository, "repoFind")
        .mockReturnValue(undefined);

      const res = await supertest(app).get("/git").send();

      expect(mock).toHaveBeenCalledWith("git");
      expect(res.redirect);
    });
  });
});
