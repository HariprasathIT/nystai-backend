import { body, validationResult } from 'express-validator';


export const validateUpdateCourseInput = [
    body('course_name')
        .trim()
        .notEmpty().withMessage('Course name is required')
        .matches(/^[A-Za-z\s]+$/).withMessage('Course name must contain only letters'),

    body('course_duration')
        .trim()
        .notEmpty().withMessage('Course duration is required')
        .isInt({ min: 1, max: 12 }).withMessage('Course duration must be a number between 1 and 12'),

    body('card_overview')
        .trim()
        .notEmpty().withMessage('Card overview is required')
        .custom((value) => {
            const wordCount = value.trim().split(/\s+/).length;
            if (wordCount > 150) {
                throw new Error('Card overview must not exceed 150 words');
            }
            return true;
        })
];

export const handleUpdateValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};