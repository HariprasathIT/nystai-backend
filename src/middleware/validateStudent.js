import { body } from 'express-validator';
import pool from '../config/db.js';

export const validateStudent = [

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 4, max: 30 }).withMessage('Name must be between 4 and 30 characters')
        .isAlpha().withMessage('Name must contain only letters'),

    body('last_name')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 4, max: 30 }).withMessage('Last name must be between 4 and 30 characters')
        .isAlpha().withMessage('Last name must contain only letters'),

    body('dob')
        .trim()
        .notEmpty().withMessage('Date of birth is required')
        .isDate().withMessage('Date of birth must be a valid date')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            const dayDiff = today.getDate() - dob.getDate();

            const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

            if (actualAge < 21) {
                throw new Error('Student must be at least 21 years old');
            }

            return true;
        }),


    body('gender')
        .trim()
        .notEmpty().withMessage('Gender is required')
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender option')
        .notEmpty().withMessage('Gender is required'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .matches(/@(?:gmail\.com|yahoo\.com|outlook\.com|.+\.org)$/)
        .withMessage('Only gmail.com, yahoo.com, outlook.com, or .org emails are allowed')
        .custom(async (value) => {
            const { rows } = await pool.query(
                'SELECT email FROM studentspersonalinformation WHERE email = $1',
                [value]
            );
            if (rows.length > 0) {
                throw new Error('Email already registered');
            }
            return true;
        }),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number,Phone Number must be 10 digits, starting with 6-9')
        .custom(async (value) => {
            const { rows } = await pool.query(
                'SELECT phone FROM studentspersonalinformation WHERE phone = $1',
                [value]
            );
            if (rows.length > 0) {
                throw new Error('Phone number already registered');
            }
            return true;
        }),


    body('alt_phone')
        .trim()
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid alternate phone number, must be 10 digits, starting with 6-9')
        .custom(async (value) => {
            const { rows } = await pool.query(
                'SELECT alt_phone FROM studentspersonalinformation WHERE alt_phone = $1',
                [value]
            );
            if (rows.length > 0) {
                throw new Error('Alternate phone already registered');
            }
            return true;
        }),


    body('aadhar_number')
        .trim()
        .notEmpty().withMessage('Aadhar number is required')
        .matches(/^\d{12}$/).withMessage('Aadhar must contain only 12 numeric digits')
        .isLength({ min: 12, max: 12 }).withMessage('Aadhar must be 12 digits')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT aadhar_number FROM studentspersonalinformation WHERE aadhar_number = $1', [value]);
            if (rows.length > 0) {
                throw new Error('Aadhar already registered');
            }
            return true;
        }),

    body('pan_number')
        .trim()
        .notEmpty().withMessage('PAN number is required')
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage('PAN must be 10 characters')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT pan_number FROM studentspersonalinformation WHERE pan_number = $1', [value]);
            if (rows.length > 0) {
                throw new Error('PAN number already registered');
            }
            return true;
        }),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required'),

    body('pincode')
        .trim()
        .notEmpty().withMessage('Pincode is required')
        .matches(/^[1-9][0-9]{5}$/).withMessage('Pincode must be a 6-digit number starting from 1 to 9')
        .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits'),

    body('state')
        .trim()
        .notEmpty().withMessage('State is required'),

    // Course Info
    body('department')
        .trim()
        .notEmpty().withMessage('Department is required'),

    body('course')
        .trim()
        .notEmpty().withMessage('Course is required'),

    body('year_of_passed')
        .trim()
        .notEmpty().withMessage('Year of passed is required'),

    body('experience')
        .trim()
        .notEmpty().withMessage('Experience is required'),

    body('department_stream')
        .trim()
        .notEmpty().withMessage('Department stream is required'),

    body('course_duration')
        .trim()
        .notEmpty().withMessage('Course duration is required'),

    body('join_date')
        .trim()
        .notEmpty().withMessage('Join date is required'),

    body('end_date')
        .trim()
        .notEmpty().withMessage('End date is required'),

    body('course_enrolled')
        .trim()
        .notEmpty().withMessage('Course enrolled is required')
        .isIn(['IOT', 'CCTV']).withMessage('Course must be either IOT or CCTV'),

    body('batch')
        .trim()
        .notEmpty().withMessage('Batch is required'),

    body('tutor')
        .trim()
        .notEmpty().withMessage('Tutor is required'),


];
