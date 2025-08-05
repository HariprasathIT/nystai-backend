import pool from "../config/db.js";
import { sendBulkEmails } from "../utils/sendEmail.js";

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
