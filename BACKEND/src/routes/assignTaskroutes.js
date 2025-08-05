import express from "express";
import { assignTaskToBatch } from '../controllers/assignTaskcontroller.js';
import multer from 'multer';
const upload = multer();

const router = express.Router();

router.post("/assign-task", upload.none(), assignTaskToBatch);

export default router;
