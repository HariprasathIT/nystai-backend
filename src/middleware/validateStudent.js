import { body } from 'express-validator';
import pool from '../config/db.js';

export const validateStudent = [
    // Personal Info
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('dob').notEmpty().withMessage('Date of birth is required'),
    body('gender').notEmpty().withMessage('Gender is required'),

    body('email')
        .isEmail().withMessage('Invalid email address')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT email FROM studentspersonalinformation WHERE email = $1', [value]);
            if (rows.length > 0) {
                throw new Error('Email already registered');
            }
            return true;
        }),

    body('phone')
        .isMobilePhone().withMessage('Invalid phone number')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT phone FROM studentspersonalinformation WHERE phone = $1', [value]);
            if (rows.length > 0) {
                throw new Error('Phone number already registered');
            }
            return true;
        }),

    body('alt_phone')
        .optional()
        .isMobilePhone().withMessage('Invalid alternate phone number')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT alt_phone FROM studentspersonalinformation WHERE alt_phone = $1', [value]);
            if (rows.length > 0) {
                throw new Error('Alternate phone already registered');
            }
            return true;
        }),

    body('aadhar_number')
        .isLength({ min: 12, max: 12 }).withMessage('Aadhar must be 12 digits')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT aadhar_number FROM studentspersonalinformation WHERE aadhar_number = $1', [value]);
            if (rows.length > 0) {
                throw new Error('Aadhar already registered');
            }
            return true;
        }),

    body('pan_number')
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage('PAN must be 10 characters')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT pan_number FROM studentspersonalinformation WHERE pan_number = $1', [value]);
            if (rows.length > 0) {
                throw new Error('PAN number already registered');
            }
            return true;
        }),

    body('address').trim().notEmpty().withMessage('Address is required'),
    body('pincode').isPostalCode('IN').withMessage('Invalid pincode'),
    body('state').trim().notEmpty().withMessage('State is required'),

    // Course Info
    body('department').notEmpty().withMessage('Department is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('year_of_passed').notEmpty().withMessage('Year of passed is required'),
    body('experience').notEmpty().withMessage('Experience is required'),
    body('department_stream').notEmpty().withMessage('Department stream is required'),
    body('course_duration').notEmpty().withMessage('Course duration is required'),
    body('join_date').notEmpty().withMessage('Join date is required'),
    body('end_date').notEmpty().withMessage('End date is required'),

    body('course_enrolled')
        .notEmpty().withMessage('Course enrolled is required')
        .isIn(['IOT', 'CCTV']).withMessage('Course must be either IOT or CCTV'),

    body('batch').notEmpty().withMessage('Batch is required'),
    body('tutor').notEmpty().withMessage('Tutor is required'),


];
