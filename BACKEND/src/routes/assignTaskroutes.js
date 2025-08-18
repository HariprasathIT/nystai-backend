import express from "express";
import { assignTaskToBatch, deleteAssignedTask, getAllAssignedTasks, getSingleAssignedTask, markTaskAsDone, viewAssignmentPage } from '../controllers/assignTaskcontroller.js';
import multer from 'multer';
import { AssignTaskInputValidator, handleAssignTaskValidation } from "../middleware/taskvalidator.js";
const upload = multer();

const router = express.Router();

router.post("/assign-task", upload.none(), AssignTaskInputValidator, handleAssignTaskValidation, assignTaskToBatch);
router.get("/assigned-tasks", getAllAssignedTasks);
router.get("/assigned-tasks/:task_id", getSingleAssignedTask);
router.delete("/delete-tasks/:task_id", deleteAssignedTask);
router.get("/mark-task-done/:task_id/:student_id", upload.none(), markTaskAsDone);
router.get('/assignment/:task_id', viewAssignmentPage);




export default router;
