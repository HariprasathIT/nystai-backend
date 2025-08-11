import express from 'express';
import { Addingcourses, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from '../controllers/Nystaiallcourses.js';
import multer from 'multer';
import { handleInsertValidationErrors, NystaiCourseuploadImage, validateInsertCourseInput } from '../middleware/NystaicourseValidation.js';
import { handleUpdateValidationErrors, validateUpdateCourseInput } from '../middleware/NystaiUpdatevalidation.js';

const storage = multer.memoryStorage();

const router = express.Router();

router.post(
    '/add',
    NystaiCourseuploadImage.single('image_url'),
    validateInsertCourseInput,
    handleInsertValidationErrors,
    Addingcourses
);

router.get('/get-all-courses', getAllCourses);
router.delete('/delete-course/:id', deleteCourse);
router.put('/update-courses/:id', NystaiCourseuploadImage.single('image_url'), validateUpdateCourseInput, handleUpdateValidationErrors, updateCourse);
router.get('/get-course/:id', getSingleCourse);

export default router;
    