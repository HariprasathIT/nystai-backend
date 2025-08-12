import { body } from "express-validator";
import db from "../config/db.js";
import { validationResult } from "express-validator";
import multer from 'multer';

const validDomains = ["gmail.com", "yahoo.com", "outlook.com"];

export const tutorUpdateValidator = [

    body("first_name").notEmpty().withMessage("First name is required")
        .isLength({ min: 4, max: 30 }).withMessage('First name must be between 4 and 30 characters')
        .isAlpha().withMessage('Name must contain only letters'),

    body("last_name")
        .notEmpty().withMessage("Last name is required")
        .isLength({ max: 4 }).withMessage("Last name must be at most 4 characters long")
        .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only in letters"),

    body("dob")
        .notEmpty().withMessage("Date of birth is required")
        .isISO8601().withMessage("Date of birth must be a valid date")
        .custom((value) => {
            const inputDate = new Date(value);
            const today = new Date();
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (inputDate > today) {
                throw new Error("Date of birth cannot be in the future");
            }
            return true;
        }),


    body("gender").notEmpty().withMessage("Gender is required"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom((value, { req }) => {
            const domain = value.split("@")[1];
            if (!validDomains.includes(domain)) {
                throw new Error("Only Gmail, Yahoo, and Outlook emails are allowed");
            }
            return true;
        })
    // .custom(async (value, { req }) => {
    //     const { id } = req.params;
    //     const result = await db.query("SELECT * FROM nystai_tutors WHERE email = $1 AND tutor_id != $2", [value, id]);
    //     if (result.rows.length > 0) {
    //         throw new Error("Email already exists");
    //     }
    //     return true;
    // })
    ,
    body("phone")
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone("en-IN").withMessage("Invalid phone number")
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number, Phone number must be 10 digits, starting with 6-9')
    // .custom(async (value, { req }) => {
    //     const { id } = req.params;
    //     const result = await db.query("SELECT * FROM nystai_tutors WHERE phone = $1 AND tutor_id != $2", [value, id]);
    //     if (result.rows.length > 0) {
    //         throw new Error("Phone number already exists");
    //     }
    //     return true;
    // })
    ,

    body("expertise").notEmpty().withMessage("Expertise / Courses is required"),

    body("experience_years")
        .notEmpty().withMessage("Experience is required"),

    body("joining_date")
        .notEmpty().withMessage("Joining date is required")
        // .custom((value) => {
        //     const inputDate = new Date(value);
        //     const today = new Date();

        //     // Remove time to compare only date
        //     inputDate.setHours(0, 0, 0, 0);
        //     today.setHours(0, 0, 0, 0);

        //     if (inputDate.getTime() !== today.getTime()) {
        //         throw new Error("Joining date must be today");
        //     }

        //     return true;
        // })

];


export const handleUpdateTutorValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// This is for Uploading Tutor Image Validation

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, png, webp, gif, jpg)'));
    }
};

export const uploadImageTutor = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});


export const checkTutorImageRequired = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Tutor image is required" });
    }
    next();
};