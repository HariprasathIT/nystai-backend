// backend/routes/certificateRoutes.js
import express from "express";
import multer from "multer";
import { uploadCertificateForStudent, verifyCertificate } from "../controllers/certificateController.js";

const router = express.Router();
const upload = multer(); // memory storage for single file

// Verify certificate (login page)
router.post("/verify", upload.none(), verifyCertificate);

// Upload certificate for student
router.post("/upload", upload.single("certificate"), uploadCertificateForStudent);

export default router;
