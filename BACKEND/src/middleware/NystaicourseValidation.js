import { body, validationResult } from 'express-validator';

export const validateCourseInput = [
    body('course_name')
        .trim()
        .notEmpty()
        .withMessage('course_name is required'),

    body('course_duration')
        .trim()
        .notEmpty()
        .withMessage('course_duration is required'),

    body('card_overview')
        .trim()
        .notEmpty()
        .withMessage('card_overview is required'),

    // Optional: Add length limit
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            }));
            return res.status(400).json({ errors: formattedErrors });
        }
        next();
    }
];
