import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

export default db;
