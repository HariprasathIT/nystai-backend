import express from "express";
import { uploadCertificateForStudent, verifyCertificate } from "../controllers/certificateController.js";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/verify", upload.none(), verifyCertificate);

// Upload certificate for a single student
router.post("/upload", upload.single("certificate"), uploadCertificateForStudent);

export default router;
