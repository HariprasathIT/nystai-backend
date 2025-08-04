import express from 'express';
import { uploadFields, validateUploadedFiles } from '../middleware/uploadMiddleware.js';
import { deleteStudent, getAllStudents, getStudentById, insertStudentWithProof } from '../controllers/blobController.js';
import { validateStudent } from '../middleware/validateStudent.js';
import { validationResult } from 'express-validator';
import { updateStudentWithProof } from '../controllers/studentEditController.js';
import { validateUpdateStudentCourse } from '../middleware/updatestudentmiddleware.js';

const router = express.Router();

//  Insert student route with multiple file uploads
router.post('/insert-student',
    uploadFields,           //  handle passport_photo, pan_card, aadhar_card, sslc_marksheet
    validateStudent,        //  express-validator middlewares
    validateUploadedFiles, //  custom middleware to check required files
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    insertStudentWithProof   //  Final controller to save student and upload files
);

//  Get all students
router.get('/get-all-students', getAllStudents);

//  Update student with file uploads
router.put('/update-student/:student_id', uploadFields, validateUpdateStudentCourse, updateStudentWithProof);

// Delete student route
router.delete('/students/:id', deleteStudent);

// Get student by ID
router.get('/single-student/:student_id', getStudentById);

export default router;
