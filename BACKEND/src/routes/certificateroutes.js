import express from "express";
import { verifyCertificate } from "../controllers/certificateController.js";

const router = express.Router();

router.post("/verify", verifyCertificate);

export default router;
