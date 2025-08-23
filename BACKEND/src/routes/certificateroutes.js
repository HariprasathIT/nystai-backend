import express from "express";
import { generateCertificate, getCertificateByQR } from "../controllers/certificateController.js";

const router = express.Router();

// Generate/mark certificate completed
router.post("/certificate/:studentId/generate", generateCertificate);

// Scan QR → get certificate
router.get("/certificate/:studentId", getCertificateByQR);

export default router;
