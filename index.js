import express from "express";
import cron from "node-cron";
import moment from "moment-timezone";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import db from "./dbModel/db.js";
import { staffRoute } from "./routes/auth.js";
import { taskRoute } from "./routes/task.js";
// import { sendMessage } from "./controllers/messageController.js";
import { reportRoute } from "./routes/report.js";
import { leaveRoute } from "./routes/leave.js";
import { queryRoute } from "./routes/query.js";
import { announcementRoute } from "./routes/announcement.js";
import { emailToDirectors } from "./utlities/emails/emails.js";
// import { imageRoute } from "./routes/images.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

// initialize the Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.112.233:5173",
      "https://umera-staff-dashboard.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});
//MiddeleWare
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.112.233:5173",
      "https://umera-staff-dashboard.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

db.connect();

//Routes
app.use("/api/staff", staffRoute);
app.use("/api/task", taskRoute);
app.use("/api/report", reportRoute);
app.use("/api/leave", leaveRoute);
app.use("/api/query", queryRoute);
// app.use("/api/image", imageRoute);
app.use("/api/announcement", announcementRoute);

// app.use("/keepAppAlive", (req, res) => {
//   console.log("Keeping Server Alive");
//   res.send("App is Alive");
// });

// app.use("/", (req, res) => {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Odunsi Oluwabukola</title>
//       </head>
//       <body>
//         <h1>This is an App for UMéRA Dashboard by Odunsi Oluwabukola</h1>
//         <p>All the thing wey i write for top na perspe, Make i no lie , Coding Hard die!</p>
//       </body>
//     </html>
//   `;
//   res.send(html);
// });

export { io };

// io.on("connection", (socket) => {
//   console.log(process.env.PASS);
//   console.log("User connected:", socket.id);
//     io.emit("userId", socket);
//   socket.on("sendMessage", (msg) => {
//     console.log("Message received:", msg);
//     sendMessage(msg);
//     let data = { message: msg, uid: socket.id };

//   });
//     socket.on("sendMessage", ({ msg, uid }) => {
//       console.log("Message received:", msg, uid);
//       sendMessage(msg, uid);
//       // Broadcast to recipient
//       io.emit("receiveMessage", msg, uid);
//     });
//     socket.emit("userId", socket.id);
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Emit new announcements
//   socket.on("new_announcement", (announcement) => {
//     io.emit("broadcast_announcement", announcement);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// cron.schedule(
//   "*/5 * * * *",
//   async () => {
//     console.log("Keeping App Live Every 5 min");
//     await axios
//       .get("https://backend-ums.onrender.com/keepAppAlive")
//       .then((res) => console.log("This ran after 5 mins"))
//       .catch((err) => console.log(err));
//   },
//   { scheduled: true }
// );

cron.schedule(
  "40 11 * * 6",
  async () => {
    const now = moment().tz("Africa/Lagos");
    console.log(
      `[CRON] Email Schedule started to run at ${now.format(
        "YYYY-MM-DD HH:mm:ss"
      )}`
    );

    try {
      const { rows } = await db.query(
        `SELECT DISTINCT ON (staff.staff_id) 
          staff.other_name,
          reports.report_id,
          reports.staff_id,
          reports.content,
          reports.chalenge,
          reports.workinprogress,
          reports.objectives,
          reports.recommendations,
          reports.gadget,
          reports.request,
          reports.sent_at
        FROM reports
        JOIN staff ON reports.staff_id = staff.staff_id
        ORDER BY staff.staff_id, reports.sent_at DESC`
      );

      for (const report of rows) {
        const {
          other_name,
          content,
          chalenge,
          workinprogress,
          objectives,
          recommendations,
          gadget,
          request,
          sent_at,
        } = report;

        // Send email with delay
        await emailToDirectors({
          name: other_name,
          content,
          chalenge,
          workinprogress,
          objectives,
          recommendations,
          gadget,
          request,
          sent_at: new Date(sent_at),
        });

        console.log(`Email sent to: ${other_name}`);
        await new Promise((resolve) => setTimeout(resolve, 50000)); // 10 seconds delay
      }

      console.log("[CRON] All emails sent successfully.");
    } catch (err) {
      console.error("[CRON] Error in scheduled task:", err);
    }
  },
  { scheduled: true, timezone: "Africa/Lagos" }
);

server.listen(port, () => {
  console.log("App is listening on port " + port);
});
