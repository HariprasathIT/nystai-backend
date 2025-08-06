import express from "express";
import { assignTaskToBatch, getAllAssignedTasks, getSingleAssignedTask, markTaskAsDone } from '../controllers/assignTaskcontroller.js';
import multer from 'multer';
const upload = multer();

const router = express.Router();

router.post("/assign-task", upload.none(), assignTaskToBatch);
router.get("/assigned-tasks", getAllAssignedTasks);
router.get("/assigned-tasks/:task_id", getSingleAssignedTask);
router.put("/mark-task-done/:task_id/:student_id", upload.none(), markTaskAsDone);



export default router;
