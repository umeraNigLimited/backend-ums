import db from "../dbModel/db.js";
import { io } from "../index.js";

export const getAnnouncement = async (req, res) => {
  const staff_id = req.user;

  try {
    // Fetch general announcements
    const { rows: general } = await db.query("SELECT * FROM announcements");

    // Fetch specific announcements for the staff
    // const { rows: specific } = await db.query(
    //   `SELECT * FROM announcements WHERE sent_to IS NULL OR sent_to = $1 ORDER BY sent_at DESC`,
    //   [staff_id]
    // );

    // Combine both general and specific announcements into one array
    // const combinedAnnouncements = [...general, ...specific];
    // console.log(combinedAnnouncements);
    if (general.length > 0) {
      return res.status(200).json({
        message: "Successfully acquired Announcements",
        data: general,
      });
    }

    // If no announcements exist
    res.status(404).json({ message: "No Announcements found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addAnnouncement = async (req, res) => {
  const staff_id = req.user;
  const { title, content, sent_to } = req.body;

  try {
    const announcement = await db.query(
      `INSERT INTO announcements (title, content, sent_by, sent_to) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, staff_id, sent_to]
    );

    io.emit("broadcast_announcement", announcement.rows[0]); // Notify all clients
    console.log(announcement.rows[0]);
    res.status(201).json({
      message: "Successfully Broadcasted",
      data: announcement.rows,
    });
  } catch (err) {
    console.error(err);
  }
};
