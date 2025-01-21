import { json } from "express";
import db from "../dbModel/db.js";

const getAllTask = async (req, res) => {
  const staff_id = req.user;

  // console.log(staff_id);
  try {
    const { rows } = await db.query("SELECT * FROM tasks WHERE staff_id = $1", [
      staff_id,
    ]);
    // console.log(rows);
    res.json({ message: "up and running", data: rows });
    // console.log(rows);
  } catch (err) {
    console.log(err);
  }
};

const getOneTask = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.query("SELECT * FROM tasks WHERE task_id = $1", [id]);
  } catch (err) {
    console.log(err);
  }
};

const addTask = async (req, res) => {
  const { task_content, priority, due_date, status } = req.body;
  const staff_id = req.user;

  // if (!staffID || !content) {
  //   return res.status(400).json({ error: "All fields are required" });
  // }

  try {
    const { rows } = await db.query(
      "INSERT INTO tasks(staff_id, task_content, priority,due_date,status) VALUES ($1,$2, $3,$4,$5) RETURNING *",
      [staff_id, task_content, priority, due_date, status]
    );
    // console.log(rows);
    res.status(201).json({ message: "successful", data: rows[0] }); // Return the inserted task as the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add task" }); // Send a proper error response
  }
};

// const updateTask = async (req, res) => {
//   const staff_id = req.user;
//   const { id } = req.params;
//   const { task_content, assignee_id, priority, due_date, status } = req.body;

//   console.log(task_content, priority);
//   console.log(staff_id);
//   try {
//     const { rows } = await db.query(
//       "UPDATE tasks SET task_content = $2, assignee_id = $3, priority = $4,due_date = $5, status = $6 WHERE task_id = $1 AND staff_id = $7 RETURNING *",
//       [id, task_content, assignee_id, priority, due_date, status, staff_id]
//     );

//     if (rows.length > 0) {
//       console.log(rows);
//       return res.status(200).json({ message: "Owole my dear", data: rows[0] });
//     }
//     res
//       .status(400)
//       .json({ message: "Ogami Something went wrong and na your fault" });
//     console.log("mm");
//   } catch (err) {
//     console.log(err);
//   }
// };

const updateTask = async (req, res) => {
  const staff_id = req.user;
  const { id } = req.params; // Task ID
  const { task_content, assignee_id, priority, due_date, status } = req.body;

  try {
    // Build the update query dynamically based on provided fields
    const updates = [];
    const values = [id, staff_id]; // ID and staff_id are mandatory

    if (task_content !== undefined) {
      updates.push(`task_content = $${values.length + 1}`);
      values.push(task_content);
    }
    if (assignee_id !== undefined) {
      updates.push(`assignee_id = $${values.length + 1}`);
      values.push(assignee_id);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${values.length + 1}`);
      values.push(priority);
    }
    if (due_date !== undefined) {
      updates.push(`due_date = $${values.length + 1}`);
      values.push(due_date);
    }
    if (status !== undefined) {
      updates.push(`status = $${values.length + 1}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const query = `
      UPDATE tasks
      SET ${updates.join(", ")}
      WHERE task_id = $1 AND staff_id = $2
      RETURNING *;
    `;

    const { rows } = await db.query(query, values);

    if (rows.length > 0) {
      // console.log(rows[0]);
      return res
        .status(200)
        .json({ message: "Task updated successfully", data: rows[0] });
    }

    res.status(404).json({ message: "Task not found" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while updating the task" });
  }
};

const deleteTask = async (req, res) => {
  const staff_id = req.user;
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "DELETE FROM tasks WHERE task_id = $1 AND staff_id = $2 RETURNING *",
      [id, staff_id]
    );

    if (rows.length > 0) {
      console.log(rows[0]);
      return res
        .status(200)
        .json({ message: "Task deleted successfully", data: rows[0] });
    }

    res.status(404).json({ message: "Task not found" });
  } catch (err) {
    console.log(err);
  }
};

export { getAllTask, getOneTask, addTask, updateTask, deleteTask };
