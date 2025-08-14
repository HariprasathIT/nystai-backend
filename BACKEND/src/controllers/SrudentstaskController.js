import pool from "../config/db.js"; // DB connection

// Get students who received the task mail
export const getMailSentStudents = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const result = await pool.query(
            `SELECT s.student_id, s.name, s.last_name, s.email, e.email_status, e.sent_at
       FROM studentspersonalinformation s
       JOIN student_task_emails e ON s.student_id = e.student_id
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


// Get students who marked task as done
export const getMarkAsDoneStudents = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const result = await pool.query(
            `SELECT s.student_id, s.name AS first_name, s.last_name, s.email, sub.submitted_at
       FROM studentspersonalinformation s
       JOIN student_task_submissions sub ON s.student_id = sub.student_id
       WHERE sub.task_id = $1`,
            [taskId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `No completed submissions found for task ID ${taskId}`
            });
        }

        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.error("Error fetching completed task students:", error);
        next(error);
    }
};
