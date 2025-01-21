import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  // user: "postgres",
  // host: "127.0.0.1",
  // database: "umera-staff-dashboard",
  // password: "Umera2020@2#3$4",
  // port: "5432",
  connectionString: process.env.DATABASE_URL,
  password: String(process.env.DB_PASSWORD),
});

export default db;
