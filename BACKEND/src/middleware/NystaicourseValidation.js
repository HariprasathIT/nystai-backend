import { body, validationResult } from 'express-validator';
import multer from 'multer';

export const validateInsertCourseInput = [
  body('course_name')
    .trim()
    .notEmpty().withMessage('Course name is required').bail()
    .matches(/^[A-Za-z\s]+$/).withMessage('Course name must contain only letters'),

  body('course_duration')
    .trim()
    .notEmpty().withMessage('Course duration is required').bail()
    .isInt({ min: 1, max: 365 }).withMessage('Course duration must be a number between 1 and 365'),

  body('card_overview')
    .trim()
    .notEmpty().withMessage('Card overview is required').bail()
    .custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 150) {
        throw new Error('Card overview must not exceed 150 words');
      }
      return true;
    })
];



export const handleInsertValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Build response like first example
    const fields = {};

    // Initialize all fields as success:true by default
    ['course_name', 'course_duration', 'card_overview'].forEach((field) => {
      fields[field] = { success: true, msg: '' };
    });

    // Set failed validations
    errors.array().forEach(err => {
      fields[err.path] = {
        success: false,
        msg: err.msg
      };
    });

    return res.status(400).json({
      success: false,
      fields
    });
  }

  next();
};



// Storage not needed since we're using buffer (not disk)
const storage = multer.memoryStorage();

// File type check
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, webp, gif, jpg)'));
  }
};

// Max file size: 2MB = 2 * 1024 * 1024
export const NystaiCourseuploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});