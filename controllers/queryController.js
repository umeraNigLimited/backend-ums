import db from "../dbModel/db.js";

export const getQuery = async (req, res) => {
  const staff_id = req.user;
  try {
    const { rows } = await db.query(
      "SELECT * FROM queries WHERE staff_id = $1",
      [staff_id]
    );

    if (rows.length > 0) {
      res.status(200).json({ message: "", data: rows });
    } else {
      res.status(400).json({ message: "No Query of the Staff" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addQuery = async (req, res) => {
  const { staff_id, query_content, document_id } = req.body;
  const issued_by = req.user.staff_id;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can issue queries." });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO queries (staff_id, issued_by, query_content, document_id)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
      [staff_id, issued_by, query_content, document_id]
    );
    res
      .status(201)
      .json({ message: "Query issued successfully", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to issue query" });
  }
};

export const updateQuery = async (req, res) => {
  const { staff_id } = req.params;
  const { query_date, query_content, response } = req.body;

  try {
    const { rows } = await db.query(
      `
            UPDATE queries
            SET 
              query_date = $1,
              query_content = $2,
              updated_at = CURRENT_TIMESTAMP
            WHERE leave_id = $3
            RETURNING *;
            `,
      [query_date, query_content, response, staff_id]
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

export const respondToQuery = async (req, res) => {
  const { query_id } = req.params;
  const { response } = req.body;
  const staff_id = req.user.staff_id; // Extract staff ID from JWT (decoded token)

  try {
    // Check if the query exists and belongs to the staff
    const { rows } = await db.query(
      `UPDATE queries 
           SET response = $1, resolved = TRUE, response_date = NOW()
           WHERE query_id = $2 AND staff_id = $3
           RETURNING *`,
      [response, query_id, staff_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Query not found or unauthorized." });
    }

    res
      .status(200)
      .json({ message: "Response submitted successfully", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit response" });
  }
};
