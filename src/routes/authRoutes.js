import express from 'express';
import { superAdminLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', superAdminLogin);

export default router;
