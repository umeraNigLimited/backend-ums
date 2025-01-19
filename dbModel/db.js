import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "umera-staff-dashboard",
  password: "Umera2020@2#3$4",
  port: "5432",
});

export default db;
