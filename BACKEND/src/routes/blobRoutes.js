import express from 'express';
import { uploadFields } from '../middleware/uploadMiddleware.js';
import { deleteStudent, getAllStudents, getStudentById, insertStudentWithProof, updateStudentWithProof } from '../controllers/blobController.js';
import { handleValidationstudentInsert, validateStudent } from '../middleware/validateStudent.js';


const router = express.Router();

//  Insert student route with multiple file uploads
router.post('/insert-student',
    uploadFields,
    validateStudent,        
    handleValidationstudentInsert,
    insertStudentWithProof  
);

//  Get all students
router.get('/get-all-students', getAllStudents);

//  Update student with file uploads
router.put('/update-student/:student_id', uploadFields, updateStudentWithProof);

// Delete student route
router.delete('/students/:id', deleteStudent);

// Get student by ID
router.get('/single-student/:student_id', getStudentById);

export default router;
