import express from "express";
import multer from "multer";
import {
    addRemarkToSubmission,
    assignTaskToBatch,
    deleteAssignedTask,
    getAllAssignedTasks,
    getAllTaskSubmissions,
    getMailSentStudents,
    getSingleAssignedTask,
    getStudentTaskUploads,
    getTaskSubmissionsByTaskId,
    markTaskAsCompleted,
    submitAssignment,
    submitAssignmentByToken,
    verifyTaskToken,
    viewAssignmentPageWithToken
} from '../controllers/assignTaskcontroller.js';
import { AssignTaskInputValidator, handleAssignTaskValidation } from "../middleware/taskvalidator.js";

const upload = multer();
const router = express.Router();

// Task Assigning with email notification
router.post("/assign-task", upload.none(), AssignTaskInputValidator, handleAssignTaskValidation, assignTaskToBatch);

// Task viewing & management
router.get("/assigned-tasks", getAllAssignedTasks);
router.get("/assigned-tasks/:task_id", getSingleAssignedTask);
router.delete("/delete-tasks/:task_id", deleteAssignedTask);

// Student accesses their assignment via a token link
router.get('/assignment/:token', viewAssignmentPageWithToken);

// Task submissions Single student 
router.post("/assignmentuploads/:task_id/:student_id/submit", upload.single("file"), submitAssignment);

// Emails sent list
router.get("/task/:taskId/mailsent", getMailSentStudents);

// Task submissions list
router.get("/all-tasks-submissions", getAllTaskSubmissions);

// Get submissions for a specific task
router.get("/task/:taskId/submissions", getTaskSubmissionsByTaskId);


// Single student submission
router.get("/task/:taskId/student/:studentId/uploads", getStudentTaskUploads);

// Remarks
router.put("/tasks/:taskId/:studentId/remark", upload.none(), addRemarkToSubmission);

// Task completion email
router.post("/task/:taskId/student/:studentId/completed", markTaskAsCompleted);




// Verify token endpoint
router.get("/assignment/verify/:token", verifyTaskToken);

// Submit assignment via token
router.post("/assignment/submit/:token", upload.single("file"), submitAssignmentByToken);








export default router;
