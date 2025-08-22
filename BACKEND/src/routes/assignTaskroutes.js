import express from "express";
import { addRemarkToSubmission, assignTaskToBatch, deleteAssignedTask, getAllAssignedTasks, getAllTaskSubmissions, getMailSentStudents, getMarkAsDoneStudents, getSingleAssignedTask, getStudentSingleTaskSubmission, getStudentTaskSubmissions, getStudentTaskUploads, markTaskAsCompleted, markTaskAsDone, submitAssignment, viewAssignmentPage } from '../controllers/assignTaskcontroller.js';
import multer from 'multer';
import { AssignTaskInputValidator, handleAssignTaskValidation } from "../middleware/taskvalidator.js";
const upload = multer();

const router = express.Router();

// Task Assigning with email notification
router.post("/assign-task", upload.none(), AssignTaskInputValidator, handleAssignTaskValidation, assignTaskToBatch);

// Getting All Tasks
router.get("/assigned-tasks", getAllAssignedTasks);

// Getting Single Task
router.get("/assigned-tasks/:task_id", getSingleAssignedTask);

// Delete Assigned Task
router.delete("/delete-tasks/:task_id", deleteAssignedTask);

router.get("/mark-task-done/:task_id/:student_id", upload.none(), markTaskAsDone);
router.get("/task/:taskId/done", getMarkAsDoneStudents);


router.get('/assignment/:task_id', viewAssignmentPage);
router.post("/assignmentuploads/:task_id/:student_id/submit", upload.single("file"), submitAssignment);

// Task Received Students Mail List
router.get("/task/:taskId/mailsent", getMailSentStudents);

// Task Submitted Students Mail List
router.get("/all-tasks-submissions", getAllTaskSubmissions);

router.get("/:studentId/submissions", getStudentTaskSubmissions);

// Task Submitted Single Student Mail List
router.get("/task/:taskId/student/:studentId", getStudentSingleTaskSubmission);
router.get("/task/:taskId/student/:studentId/uploads", getStudentTaskUploads);

// Remark mail after submission
router.put("/tasks/:taskId/:studentId/remark", upload.none(), addRemarkToSubmission);

// Successful Mail after marking task as completed
router.post("/task/:taskId/student/:studentId/completed", markTaskAsCompleted);

export default router;
