import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  password: String(process.env.DB_PASSWORD),
  connectionTimeoutMillis: 30000,
  query_timeout: 30000,
});

export default db;
