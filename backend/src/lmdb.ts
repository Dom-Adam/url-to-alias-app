import { open } from "lmdb";

const database = open({ path: `database_${process.env.NODE_ENV}` });
export default database;
