import express from 'express';
import { superAdminLogin } from '../controllers/authController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/login', upload.none(), superAdminLogin);

export default router;
