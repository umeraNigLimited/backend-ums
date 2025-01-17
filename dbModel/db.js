import pg from "pg"

const db = new pg.Client(
{
    user:"postgres",
    host:"localhost",
    database : "umera-staff-dashboard",
    password:"Umera2020@2#3$4",
    port:"5432"
}
)

export default db