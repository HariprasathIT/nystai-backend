import pool from "../config/db.js";
import { sendBulkEmails } from "../utils/sendEmail.js";


// This Function is for Create Task
export const assignTaskToBatch = async (req, res, next) => {
  const { batch, course, task_title, task_description, due_date } = req.body;

  try {
    // 1. Insert Task into DB
    const result = await pool.query(
      `INSERT INTO student_batch_tasks (batch, course, task_title, task_description, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [batch, course, task_title, task_description, due_date]
    );

    const task = result.rows[0];

    // 2. Get Student Emails of the Batch
    const emailQuery = await pool.query(
      `SELECT spi.email
       FROM studentcoursedetails scd
       JOIN studentspersonalinformation spi ON spi.student_id = scd.student_id
       WHERE scd.batch = $1`,
      [batch]
    );

    const emails = emailQuery.rows.map(row => row.email);

    // 3. Send Emails
    await sendBulkEmails(emails, `📚 New Task Assigned: ${task_title}`, {
      batch,
      course,
      task_title,
      task_description,
      due_date,
      viewLink: `https://yourdomain.com/assignment/${task.task_id}`, // optional
      doneLink: `https://yourdomain.com/assignment/${task.task_id}/done` // optional
    });

    res.status(200).json({ message: "Task assigned and emails sent", task });
  } catch (err) {
    next(err);
  }
};


// This Function is for Get Api 
export const getAllAssignedTasks = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM student_batch_tasks ORDER BY assigned_at DESC");
    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


// This Function is for Get Single task
export const getSingleAssignedTask = async (req, res, next) => {
  const { task_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM student_batch_tasks WHERE task_id = $1",
      [task_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task: result.rows[0] });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};