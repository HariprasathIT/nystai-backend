import express from "express";
import { assignTaskToBatch, deleteAssignedTask, getAllAssignedTasks, getMailSentStudents, getMarkAsDoneStudents, getSingleAssignedTask, getStudentSingleTaskSubmission,  getStudentTaskUploads, markTaskAsDone, submitAssignment, viewAssignmentPage } from '../controllers/assignTaskcontroller.js';
import multer from 'multer';
import { AssignTaskInputValidator, handleAssignTaskValidation } from "../middleware/taskvalidator.js";
const upload = multer();

const router = express.Router();

router.post("/assign-task", upload.none(), AssignTaskInputValidator, handleAssignTaskValidation, assignTaskToBatch);
router.get("/assigned-tasks", getAllAssignedTasks);
router.get("/assigned-tasks/:task_id", getSingleAssignedTask);
router.delete("/delete-tasks/:task_id", deleteAssignedTask);

router.get("/mark-task-done/:task_id/:student_id", upload.none(), markTaskAsDone);
router.get("/task/:taskId/done", getMarkAsDoneStudents);
router.get("/task/:taskId/student/:studentId", getStudentSingleTaskSubmission);

router.get('/assignment/:task_id', viewAssignmentPage);
router.post("/assignmentuploads/:task_id/:student_id/submit", upload.single("file"), submitAssignment);

router.get("/task/:taskId/mailsent", getMailSentStudents);
router.get("/task/:taskId/student/:studentId/uploads", getStudentTaskUploads);

export default router;
