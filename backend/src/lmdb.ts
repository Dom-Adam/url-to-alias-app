import { open } from "lmdb";

const database = open({ path: "database" });
export default database;
