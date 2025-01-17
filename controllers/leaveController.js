import db from "../dbModel/db.js";

export const getLeave = async (req, res) => {
  const staff_id = req.user;
  try {
    const { rows } = await db.query(
      "SELECT leave_id, staff_id, leave_type, start_date, end_date, status FROM staff_leave WHERE staff_id = $1 AND status = 'approved'",
      [staff_id]
    );

    if (rows.length > 0) {
      res.status(200).json({ message: "", data: rows });
    } else {
      res.status(400).json({ message: "No Leave of the Staff" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addLeave = async (req, res) => {
  const staff_id = req.user;
  try {
    const { rows } = await db.query(
      "INSERT INTO staff_leave(staff_id, leave_type, start_date, end_date, reason, status,document_id) VALUES($1,$2,$3,$4,$5,$6) WHERE staff_id = $1",
      [staff_id]
    );

    if (rows.length > 0) {
      res.status(200).json({ message: "", data: rows });
    } else {
      res.status(400).json({ message: "No Leave of the Staff" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateLeave = async (req, res) => {
  const { id } = req.params;
  const { leave_type, reason } = req.body;

  try {
    const { rows } = await db.query(
      `
        UPDATE staff_leave
        SET 
          leave_type = $1,
          reason = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE leave_id = $3
        RETURNING *;
        `,
      [leave_type, reason, staff_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Leave record not found" });
    }

    res.status(200).json({
      message: "Leave record updated successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Error updating leave record:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
