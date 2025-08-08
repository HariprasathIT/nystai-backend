import express from "express";
import { addtutor, deletetutor, getalltutors, getsingletutor, updatetutor } from "../controllers/tutorController.js";
import multer from 'multer';
import {tutorInputValidator, handleInputTutorValidation } from "../middleware/tutorValidator.js";

import { handleUpdateTutorValidation, tutorUpdateValidator } from "../middleware/tutorUpdateValidator.js";

const upload = multer();

const router = express.Router();

// POST 
router.post("/addtutor", upload.none(), tutorInputValidator, handleInputTutorValidation, addtutor);

// Update single tutor
router.put("/updatetutor/:id", upload.none(), tutorUpdateValidator, handleUpdateTutorValidation, updatetutor);

// Get all tutors
router.get("/getalltutors", getalltutors);

// Get single Student
router.get("/gettutor/:id", getsingletutor);

// This is for Delete a Single Tutor
router.delete("/deletetutor/:id", deletetutor);


export default router;
