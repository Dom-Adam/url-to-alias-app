import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import {
  EntryExisted,
  ServerUrl,
  WriteFailed,
  WriteSuccessfull,
} from "./constants";
import App from "./App";

const server = setupServer(
  rest.post(ServerUrl as string, (req, res, ctx) => {
    return res(ctx.json({ msg: WriteSuccessfull, url: "url", alias: "alias" }));
  })
);

beforeAll(() => {
  return server.listen();
});

beforeEach(() => render(<App />));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test("checks if url is valid", async () => {
  fireEvent.change(await screen.findByLabelText("Url"), {
    target: { value: "http:/github.com" },
  });
  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent("needs to be valid url");
});

test("handles successful write", async () => {
  server.use(
    rest.post(ServerUrl, (req, res, ctx) => {
      return res(
        ctx.json({
          msg: WriteSuccessfull,
          url: "http://github.com",
          alias: "git",
        })
      );
    })
  );
  fireEvent.change(screen.getByLabelText("Url"), {
    target: { value: "http://github.com" },
  });
  await waitFor(() => screen.getByRole("img", { name: "check-circle" }));
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await waitFor(() => screen.getByRole("link"));
  expect(screen.getByRole("link")).toHaveTextContent("git");
  expect(screen.getByLabelText("Url")).toHaveValue("");
  expect(screen.getByLabelText("Alias")).toHaveValue("");
});

test("handles alias already exists", async () => {
  server.use(
    rest.post(ServerUrl, (req, res, ctx) => {
      return res(ctx.json({ msg: EntryExisted }));
    })
  );

  fireEvent.change(await screen.findByLabelText("Url"), {
    target: { value: "http://github.com" },
  });

  await waitFor(() => screen.getByRole("img", { name: "check-circle" }));

  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(EntryExisted);
});

test("handles error", async () => {
  server.use(
    rest.post(ServerUrl, (req, res, ctx) => {
      return res(ctx.json({ msg: WriteFailed }));
    })
  );

  fireEvent.change(await screen.findByLabelText("Url"), {
    target: { value: "http://github.com" },
  });
  await waitFor(() => screen.getAllByRole("img", { name: "check-circle" }));
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent("request failed");
});

test("checks if alias is valid", async () => {
  fireEvent.change(await screen.findByLabelText("Alias"), {
    target: { value: "." },
  });
  await waitFor(() => screen.getByRole("alert"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "only alphanumeric characters, dashes, and underscores are allowed"
  );
});
