import { mock, MockProxy, mockReset } from "jest-mock-extended";
import lmdb from "lmdb";
import database from "./lmdb";

jest.mock("./lmdb", () => ({
  __esModule: true,
  default: mock<lmdb.RootDatabase<any, lmdb.Key>>(),
}));

beforeEach(() => {
  mockReset(mockDatabase);
});

export const mockDatabase = database as unknown as MockProxy<
  lmdb.RootDatabase<any, lmdb.Key>
>;
