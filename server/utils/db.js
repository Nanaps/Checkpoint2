// This code is in the file server/utils/db.js
import * as pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg.default;

const pool = new Pool({
  connectionString: `checkpoint://postgres:
${process.env.PG_PASSWORD}@localhost:5432/blogpost`,
});

export { pool };
