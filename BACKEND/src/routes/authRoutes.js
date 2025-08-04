import express from 'express';
import { login } from '../controllers/authController.js';
import multer from 'multer';
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt";


const router = express.Router();
const upload = multer();


// router.post('/login', upload.none(), superAdminLogin);
router.post("/login", upload.none(), login);

// Protected route example
router.get("/admin/dashboard", authenticate, authorizeRoles("superadmin"), (req, res) => {
    res.json({ message: "Welcome Superadmin" });
});

router.get("/tutor/dashboard", authenticate, authorizeRoles("tutor", "superadmin"), (req, res) => {
    res.json({ message: "Welcome Tutor" });
});

router.get("/hash-password/:plain", async (req, res) => {
    try {
        const plainPassword = req.params.plain;
        const hashed = await bcrypt.hash(plainPassword, 10);
        res.json({ hashedPassword: hashed });
    } catch (err) {
        res.status(500).json({ message: "Error hashing password", error: err.message });
    }
});



export default router;
