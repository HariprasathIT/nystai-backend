// backend/routes/certificateRoutes.js
import express from "express";
import multer from "multer";
import { deleteCertificateImageForStudent, getCertificateForStudent, updateCertificateForStudent, uploadCertificateForStudent, verifyCertificate } from "../controllers/certificateController.js";

const router = express.Router();
const upload = multer(); // memory storage for single file

// Verify certificate (login page)
router.post("/verify", upload.none(), verifyCertificate);

// studentId from route param instead of body
router.post("/:studentId/upload", upload.single("certificate"), uploadCertificateForStudent);

// GET certificate for a student
router.get("/:studentId", getCertificateForStudent);

// Update certificate for a student
router.put("/:studentId", upload.single("certificate"), updateCertificateForStudent);

// Delete certificate for a student
router.delete("/:studentId", deleteCertificateImageForStudent);


export default router;
