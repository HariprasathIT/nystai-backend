import express from 'express';
import { Addingcourses, deleteCourse, getAllCourses, updateCourse } from '../controllers/Nystaiallcourses.js';
import multer from 'multer';
import { uploadImage } from '../middleware/Nystaicourseupload.js';
import { validateCourseInput } from '../middleware/NystaicourseValidation.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/add', uploadImage.single('image_url'),validateCourseInput, Addingcourses);
router.get('/get-all-courses', getAllCourses);
router.delete('/delete-course/:id', deleteCourse);
router.put('/update-courses/:id', uploadImage.single('image_url'), updateCourse);
    
export default router;
