import pool from "../config/db.js";
import { sendBulkEmails } from "../utils/sendEmail.js";


// This Function is for Creating a Task, Emailing Students, and Tracking Email Status
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

    // 2. Get Student Emails & IDs of the Batch
    const emailQuery = await pool.query(
      `SELECT spi.email, spi.student_id
       FROM studentcoursedetails scd
       JOIN studentspersonalinformation spi ON spi.student_id = scd.student_id
       WHERE scd.batch = $1`,
      [batch]
    );

    const students = emailQuery.rows;

    // 3. Send Emails and Log Status
    const sendPromises = students.map(async ({ email, student_id }) => {
      try {
        // Send Email
        await sendBulkEmails(email, `📚 New Task Assigned: ${task_title}`, {
          batch,
          course,
          task_title,
          task_description,
          due_date,
          viewLink: `https://nystai-backend.onrender.com/Students-Tasks/assignment/${task.task_id}`,
          doneLink: `https://nystai-backend.onrender.com/Students-Tasks/mark-task-done/${task.task_id}/${student_id}`
        });

        // Insert "sent" status into tracking table
        await pool.query(
          `INSERT INTO student_task_emails (task_id, student_id, email, email_status)
           VALUES ($1, $2, $3, 'sent')`,
          [task.task_id, student_id, email]
        );
      } catch (err) {
        console.error(`Failed to send email to ${email}`, err);

        // Insert "failed" status into tracking table
        await pool.query(
          `INSERT INTO student_task_emails (task_id, student_id, email, email_status)
           VALUES ($1, $2, $3, 'failed')`,
          [task.task_id, student_id, email]
        );
      }
    });

    await Promise.all(sendPromises);

    res.status(200).json({
      success: true,
      message: "Task assigned, emails sent, and status recorded",
      task
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


// This Function is for Get Api 
export const getAllAssignedTasks = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM student_batch_tasks ORDER BY assigned_at DESC");
    res.status(200).json({
      success: true,
      message: "All assigned tasks fetched successfully",
      tasks: result.rows
    });
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
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch task"
    });

  }
};



// This Function is for Deleting a Task
export const deleteAssignedTask = async (req, res, next) => {
  const { task_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM student_batch_tasks WHERE task_id = $1 RETURNING *",
      [task_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
};




// This Function is for Updating a "Assignment Status"
// Default : "pending"
// Update : "Completed"
export const markTaskAsDone = async (req, res) => {
  const { task_id, student_id } = req.params;

  try {
    // Step 1: Insert into submission table (if not already submitted)
    await pool.query(
      `INSERT INTO student_task_submissions (task_id, student_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [task_id, student_id]
    );

    // Step 2: Get the batch of the task
    const taskResult = await pool.query(
      `SELECT batch FROM student_batch_tasks WHERE task_id = $1`,
      [task_id]
    );
    if (taskResult.rowCount === 0) return res.status(404).send("Task not found");

    const batch = taskResult.rows[0].batch;

    // Step 3: Count how many students in that batch
    const studentCountRes = await pool.query(
      `SELECT COUNT(*) FROM studentcoursedetails WHERE batch = $1`,
      [batch]
    );
    const totalStudents = parseInt(studentCountRes.rows[0].count);

    // Step 4: Count submissions for this task
    const submissionCountRes = await pool.query(
      `SELECT COUNT(*) FROM student_task_submissions WHERE task_id = $1`,
      [task_id]
    );
    const submittedCount = parseInt(submissionCountRes.rows[0].count);

    // Step 5: If all submitted → update task as completed
    if (submittedCount === totalStudents) {
      await pool.query(
        `UPDATE student_batch_tasks SET mark_as_done = 'completed' WHERE task_id = $1`,
        [task_id]
      );
    }

    // Response
    res.send(`
      <h2 style="font-family: Arial; color: green;">✅ Marked as Done!</h2>
      <p>Thank you for submitting your task.</p>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
};



// controllers/StudentTaskController.js
export const viewAssignmentPage = async (req, res) => {
  const { task_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT task_title, task_description, course, batch, due_date, assigned_at
       FROM student_batch_tasks
       WHERE task_id = $1`,
      [task_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("<h2>❌ Task not found</h2>");
    }

    const task = result.rows[0];

    // Return as HTML page (just like mark as done)
    res.send(`
      <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">📚 Assignment Details</h2>
        <p><strong>Title:</strong> ${task.task_title}</p>
        <p><strong>Description:</strong> ${task.task_description || "No description provided"}</p>
        <p><strong>Course:</strong> ${task.course}</p>
        <p><strong>Batch:</strong> ${task.batch}</p>
        <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
        <p><strong>Assigned At:</strong> ${new Date(task.assigned_at).toLocaleString()}</p>
        <br/>
        <a href="https://nystai-backend.onrender.com/Students-Tasks/mark-task-done/${task_id}/STUDENT_ID"
           style="display:inline-block; padding:10px 20px; background:#27ae60; color:white; text-decoration:none; border-radius:5px;">
          ✅ Mark as Done
        </a>
      </div>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("<h2>⚠️ Something went wrong</h2>");
  }
};
