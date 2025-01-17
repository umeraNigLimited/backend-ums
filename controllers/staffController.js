export const getDashboardData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);

    // Now that we know the token is valid, fetch the data for the staff
    const { staff_id } = decoded;

    const dashboardData = await db.query(
      `SELECT
          (SELECT json_agg(tasks) FROM tasks WHERE staff_id = $1) AS tasks,
          (SELECT json_agg(leaves) FROM leaves WHERE staff_id = $1) AS leaves,
          (SELECT json_agg(queries) FROM queries WHERE staff_id = $1) AS queries,
          (SELECT json_agg(reports) FROM reports WHERE staff_id = $1) AS reports,
          (SELECT json_agg(productivity) FROM productivity WHERE staff_id = $1) AS productivity,
          (SELECT json_agg(documents) FROM documents WHERE staff_id = $1) AS documents`,
      [staff_id]
    );

    res.json(dashboardData.rows[0]); // Send dashboard data as JSON
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
