import db from "../dbModel/db.js";

export const getReport = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT DISTINCT ON (staff.staff_id) 
      staff.other_name,
      reports.report_id,
      reports.staff_id,
      reports.content,
      reports.chalenge,
      reports.gadget,
      reports.request,
      reports.sent_at
    FROM reports
    JOIN staff ON reports.staff_id = staff.staff_id
    ORDER BY staff.staff_id, reports.sent_at DESC
    `);

    res.status(200).json({ message: "Successfully Sent", data: rows });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the reports" });
  }
};

export const addReport = async (req, res) => {
  const staff_id = req.user;
  const { content, chalenge, gadget, request } = req.body;
  console.log(content);
  console.log(chalenge);
  console.log(gadget);
  console.log(request);
  try {
    const { rows } = await db.query(
      "INSERT INTO reports (staff_id, content, chalenge,  gadget, request) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [staff_id, content, chalenge, gadget, request]
    );
    console.log("This rows", rows[0]);

    res
      .status(200)
      .json({ message: "Inserted Report Successfully", data: rows[0] });
  } catch (err) {
    console.log(err);
  }
};

export const getSingleReport = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.query("SELECT * FROM reports WHERE report_id = $1", [
      id,
    ]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.log(err);
  }
};

export const updateReport = async (req, res) => {
  const { id } = req.params; // Report ID from URL
  const { content, chalenge, gadget, request } = req.body; // New content to update
  const staff_id = req.user; // Staff ID from the token

  // console.log(staff_id);
  // console.log(id);
  // console.log(content);

  try {
    // Check if the report belongs to the staff
    const { rows } = await db.query(
      "SELECT * FROM reports WHERE report_id = $1 AND staff_id = $2",
      [id, staff_id]
    );
    console.log("Checking", rows);
    if (rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this report" });
    }

    // Update the report
    const updateResult = await db.query(
      "UPDATE reports SET content = $1, chalenge = $2, gadget = $3, request = $4, sent_at = CURRENT_TIMESTAMP WHERE report_id = $5 RETURNING *",
      [content, chalenge, gadget, request, id]
    );

    // console.log(updateResult.rows);

    const latestReport = await db.query(
      `SELECT DISTINCT ON (staff.staff_id) 
      staff.other_name,
      reports.report_id,
      reports.staff_id,
      reports.content,
      reports.chalenge,
      reports.gadget,
      reports.request,
      reports.sent_at
    FROM reports
    JOIN staff ON reports.staff_id = staff.staff_id
    ORDER BY staff.staff_id, reports.sent_at DESC`
    );

    // Return the most recent report
    res.status(200).json({
      message: "Report updated successfully",
      data: latestReport.rows,
    });
  } catch (err) {
    console.error("Error updating report:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the report" });
  }
};

export const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM reports  WHERE report_id = $1 ", [
      id,
      title,
      content,
    ]);
    res.status(200).json("Report was Deleted");
  } catch (err) {
    console.log(err);
  }
};
