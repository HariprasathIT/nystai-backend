import express from "express";
import { addtutor, deletetutor, getalltutors, getsingletutor, updatetutor } from "../controllers/tutorController.js";
import multer from 'multer';
import tutorValidator from "../middleware/tutorValidator.js";
import handleValidation from "../middleware/handleValidation.js";
import { tutorUpdateValidator } from "../middleware/tutorUpdateValidator.js";

const upload = multer();

const router = express.Router();

// POST 
router.post("/addtutor", upload.none(), tutorValidator, handleValidation, addtutor);

// Update single tutor
router.put("/updatetutor/:id", upload.none(), tutorUpdateValidator, handleValidation, updatetutor);

// Get all tutors
router.get("/getalltutors", getalltutors);

// Get single Student
router.get("/gettutor/:id", getsingletutor);

// This is for Delete a Single Tutor
router.delete("/deletetutor/:id", deletetutor);


export default router;
