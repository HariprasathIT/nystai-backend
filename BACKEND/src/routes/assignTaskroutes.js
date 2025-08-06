import express from "express";
import { assignTaskToBatch, getAllAssignedTasks, getSingleAssignedTask } from '../controllers/assignTaskcontroller.js';
import multer from 'multer';
const upload = multer();

const router = express.Router();

router.post("/assign-task", upload.none(), assignTaskToBatch);
router.get("/assigned-tasks", getAllAssignedTasks);
router.get("/assigned-tasks/:task_id", getSingleAssignedTask);


export default router;
