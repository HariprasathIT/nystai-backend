
import express from 'express';
import { getMailSentStudents, getMarkAsDoneStudents } from '../controllers/SrudentstaskController.js';

const router = express.Router();

router.get("/task/:taskId/mailsent", getMailSentStudents);
router.get("/task/:taskId/done", getMarkAsDoneStudents);

export default router;
