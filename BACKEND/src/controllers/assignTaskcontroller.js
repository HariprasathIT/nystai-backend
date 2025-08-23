import pool from "../config/db.js";
import { sendBulkEmails } from "../utils/sendEmail.js";
import { put } from "@vercel/blob";
import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// This Function is for Creating a Task, Emailing Students, and Tracking Email Status
export const assignTaskToBatch = async (req, res, next) => {
  const { batch, course, task_title, task_description, due_date } = req.body;

  try {
    // 1️⃣ Insert Task
    const result = await pool.query(
      `INSERT INTO student_batch_tasks (batch, course, task_title, task_description, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [batch, course, task_title, task_description, due_date]
    );

    const task = result.rows[0];

    // 2️⃣ Get Students in Batch
    const emailQuery = await pool.query(
      `SELECT spi.email, spi.student_id
       FROM studentcoursedetails scd
       JOIN studentspersonalinformation spi ON spi.student_id = scd.student_id
       WHERE scd.batch = $1`,
      [batch]
    );

    const students = emailQuery.rows;

    // 3️⃣ Send Emails with unique token
    const sendPromises = students.map(async ({ email, student_id }) => {
      try {
        const token = uuidv4(); // unique token for student

        // Save token for this student (can be multiple students per task)
        await pool.query(
          `UPDATE student_batch_tasks
           SET access_token = $1
           WHERE task_id = $2`,
          [token, task.task_id]
        );

        const viewLink = `http://localhost:5173/student-assignment/${token}`;

        await sendBulkEmails(email, `📚 New Task Assigned: ${task_title}`, {
          batch,
          course,
          task_title,
          task_description,
          due_date,
          viewLink
        }, true);

        // Insert email status
        await pool.query(
          `INSERT INTO student_task_emails (task_id, student_id, email, email_status)
           VALUES ($1, $2, $3, 'sent')`,
          [task.task_id, student_id, email]
        );
      } catch (err) {
        console.error(`Failed to send email to ${email}`, err);
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
      message: "Task assigned, emails sent, and status recorded with tokens",
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



// Get students who received the task mail with profile image + course enrolled
export const getMailSentStudents = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `SELECT  
                s.name, 
                s.last_name, 
                d.passport_photo_url,  -- passport photo from documents table
                c.course_enrolled,     -- course name/enrolled
                c.batch,
                e.email_status, 
                e.sent_at,
                t.task_title
             FROM studentspersonalinformation s
             JOIN student_task_emails e 
                ON s.student_id = e.student_id
            LEFT JOIN studentcoursedetails c 
                ON s.student_id = c.student_id
            LEFT JOIN student_proof_documents d
                ON s.student_id = d.student_id
            LEFT JOIN student_batch_tasks t
                ON e.task_id = t.task_id
             WHERE e.task_id = $1`,
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No students found for task ID ${taskId}`
      });
    }

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching mail sent students:", error);
    next(error);
  }
};





// Get all submissions
export const getAllTaskSubmissions = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (sts.student_id, sts.task_id)
        sts.student_id,
        sts.task_id,
        c.course_enrolled,
        t.task_title,
        s.last_name,
        s.name,
        d.passport_photo_url,
        c.batch,
        e.sent_at
      FROM student_task_submissions_uploads sts
      JOIN studentspersonalinformation s ON sts.student_id = s.student_id
      JOIN studentcoursedetails c ON s.student_id = c.student_id
      JOIN student_batch_tasks t ON sts.task_id = t.task_id
      LEFT JOIN student_task_emails e 
        ON e.student_id = s.student_id AND e.task_id = t.task_id
      LEFT JOIN student_proof_documents d
        ON s.student_id = d.student_id
      ORDER BY sts.student_id, sts.task_id, sts.submitted_at DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching task submissions:", err);
    next(err);
  }
};



// Get submissions for a specific task
export const getTaskSubmissionsByTaskId = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (sts.student_id)
        sts.student_id,
        sts.task_id,
        c.course_enrolled,
        t.task_title,
        s.last_name,
        s.name,
        d.passport_photo_url,
        c.batch,
        e.sent_at
      FROM student_task_submissions_uploads sts
      JOIN studentspersonalinformation s ON sts.student_id = s.student_id
      JOIN studentcoursedetails c ON s.student_id = c.student_id
      JOIN student_batch_tasks t ON sts.task_id = t.task_id
      LEFT JOIN student_task_emails e 
        ON e.student_id = s.student_id AND e.task_id = t.task_id
      LEFT JOIN student_proof_documents d 
        ON s.student_id = d.student_id
      WHERE sts.task_id = $1
      ORDER BY sts.student_id, sts.submitted_at DESC
    `, [taskId]);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });

  } catch (err) {
    console.error("Error fetching task submissions:", err);
    next(err);
  }
};





// Get a student's uploaded submissions for a specific task
export const getStudentTaskUploads = async (req, res) => {
  const { taskId, studentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          s.name,
          s.last_name,
          c.batch,
          c.course_enrolled,
          t.task_title,
          u.submitted_at,
          t.due_date,
          u.file_url
       FROM student_task_submissions_uploads u
       INNER JOIN studentspersonalinformation s 
          ON s.student_id = u.student_id
       INNER JOIN studentcoursedetails c 
          ON c.student_id = s.student_id
       INNER JOIN student_batch_tasks t 
          ON t.task_id = u.task_id
       WHERE u.task_id = $1 AND u.student_id = $2
       ORDER BY u.submitted_at DESC
       LIMIT 1`,
      [taskId, studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No uploads found for student ID ${studentId} on task ID ${taskId}`,
      });
    }

    res.status(200).json({
      success: true,
      count: result.rowCount,
      uploads: result.rows,
    });
  } catch (error) {
    console.error("Error fetching student uploads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch uploads",
    });
  }
};


export const markTaskAsCompleted = async (req, res, next) => {
  const { taskId, studentId } = req.params;

  try {
    // 1. Update task as completed in DB
    const updateResult = await pool.query(
      `UPDATE student_task_submissions_uploads
       SET completed = TRUE
       WHERE task_id = $1 AND student_id = $2
       RETURNING *`,
      [taskId, studentId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No submission found for student ${studentId} on task ${taskId}`,
      });
    }

    const submission = updateResult.rows[0];

    // 2. Fetch student email and task info
    const studentRes = await pool.query(
      `SELECT 
      spi.email, 
      spi.name, 
      spi.last_name, 
      t.task_title, 
      t.course, 
      t.due_date,
      t.task_description
   FROM studentspersonalinformation spi
   JOIN student_task_submissions_uploads sts
       ON sts.student_id = spi.student_id
   JOIN student_batch_tasks t
       ON t.task_id = sts.task_id
   WHERE sts.task_id = $1 AND sts.student_id = $2`,
      [taskId, studentId]
    );



    if (studentRes.rowCount > 0) {
      const { email, name, last_name, task_title, course, due_date, task_description } = studentRes.rows[0];

      const formattedDueDate = new Date(due_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      // 3. Send completed email
      await sendBulkEmails(
        email,
        `✅ Task Completed: ${task_title}`,
        {
          studentName: `${name} ${last_name}`,
          task_title,
          course,
          due_date: formattedDueDate,
          task_description
        },
        false, // hide Mark as Done button
        "✅ Task Completed Successfully! Thank you for submitting your assignment."
      );

    }

    res.status(200).json({
      success: true,
      message: "Task marked as completed and email sent successfully",
      // submission
    });

  } catch (error) {
    console.error("Error marking task as completed:", error);
    next(error);
  }
};



// This Function is for Viewing Assignment Page
export const viewAssignmentPageWithToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    // Fetch task using token
    const result = await pool.query(
      `SELECT task_id, task_title, task_description, course, batch, due_date, assigned_at
       FROM student_batch_tasks
       WHERE access_token = $1`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Invalid or expired token" });
    }

    const task = result.rows[0];

    // Return JSON for frontend
    res.status(200).json({
      success: true,
      task: {
        task_id: task.task_id,         // Keep task_id for DB operations
        title: task.task_title,
        description: task.task_description,
        course: task.course,
        batch: task.batch,
        due_date: task.due_date,
        assigned_at: task.assigned_at,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};





// This Function is for Submitting Assignment
export const submitAssignment = async (req, res, next) => {
  try {
    // read from URL params instead of body
    const { student_id, task_id } = req.params;
    const file = req.file; // comes from multer

    let fileUrl = null;

    if (file) {
      // Upload file to Vercel Blob
      const blob = await put(
        `Assignments_Students_uploads/${student_id}_${task_id}_${file.originalname}`,
        file.buffer,
        {
          access: "public",
          token: process.env.VERCEL_BLOB_RW_TOKEN,
          addRandomSuffix: true,
        }
      );

      fileUrl = blob.url;
    }

    // Save fileUrl in DB with assignment submission
    await db.query(
      `INSERT INTO student_task_submissions_uploads (student_id, task_id, file_url, submitted_at) 
       VALUES ($1, $2, $3, NOW())`,
      [student_id, task_id, fileUrl]
    );

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      fileUrl,
    });

  } catch (error) {
    next(error);
  }
};



// Add/Update remark for a student's submission and send email notification
export const addRemarkToSubmission = async (req, res, next) => {
  try {
    const { taskId, studentId } = req.params;
    const { remark } = req.body;

    // 1. Update remark in DB
    const result = await pool.query(
      `UPDATE student_task_submissions_uploads
       SET remark = $1
       WHERE task_id = $2 AND student_id = $3
       RETURNING *`,
      [remark, taskId, studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No submission found for student ${studentId} on task ${taskId}`,
      });
    }

    const updatedSubmission = result.rows[0];

    // 2. Get student email + task details ( added task_description)
    const studentRes = await pool.query(
      `SELECT spi.email,
              spi.name,
              spi.last_name,
              t.task_title,
              t.task_description,  
              t.due_date,
              t.course
       FROM studentspersonalinformation spi
       JOIN student_task_submissions_uploads s 
            ON s.student_id = spi.student_id
       JOIN student_batch_tasks t 
            ON t.task_id = s.task_id
       WHERE s.task_id = $1 AND s.student_id = $2`,
      [taskId, studentId]
    );

    if (studentRes.rowCount > 0) {
      const { email, name, last_name, task_title, task_description, course, due_date } =
        studentRes.rows[0];

      const formattedDueDate = new Date(due_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      // 3. Send remark email
      await sendBulkEmails(
        email,
        `📝 Remark for your Task: ${task_title}`,
        {
          studentName: `${name} ${last_name}`,
          task_title,
          course,
          due_date: formattedDueDate,
          task_description,
          remark,
          viewLink: `https://nystai-backend.onrender.com/Students-Tasks/assignment/${taskId}`,
        },
        true // <-- show Mark as Done button
      );
    }

    res.json({
      success: true,
      message: "Remark Sended Successfully",
      remark: result.rows[0].remark
    });

  } catch (error) {
    console.error("Error adding remark:", error);
    next(error);
  }
};










export const verifyTaskToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const result = await pool.query(
      `SELECT task_id, batch, course, task_title, task_description, due_date
       FROM student_batch_tasks
       WHERE access_token = $1`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    res.json({
      success: true,
      task: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


export const submitAssignmentByToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    // Get task_id and student_id via token
    const result = await pool.query(
      `SELECT task_id, student_id
       FROM student_batch_tasks
       WHERE access_token = $1`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.params.task_id = result.rows[0].task_id;
    req.params.student_id = result.rows[0].student_id;

    await submitAssignment(req, res); // reuse existing submission logic
  } catch (err) {
    console.error(err);
    next(err);
  }
};
