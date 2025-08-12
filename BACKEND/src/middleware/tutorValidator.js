import { body } from "express-validator";
import db from "../config/db.js";
import { validationResult } from "express-validator";


export const tutorInputValidator = [

    body("first_name").notEmpty().withMessage("First name is required")
        .isLength({ min: 4, max: 50 }).withMessage('First name must be between 4 and 50 characters')
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
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom((value) => {
            const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
            const domain = value.split("@")[1]?.toLowerCase();
            if (!allowedDomains.includes(domain)) {
                throw new Error("Only gmail.com, yahoo.com, or outlook.com emails are allowed");
            }
            return true;
        })
        .bail()
        .custom(async (value) => {
            const existing = await db.query("SELECT * FROM nystai_tutors WHERE email = $1", [value]);
            if (existing.rows.length > 0) {
                throw new Error("Email already exists");
            }
            return true;
        }),

    body("phone")
        .notEmpty().withMessage("Phone number is required")
        .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits")
        .matches(/^[6-9]\d{9}$/).withMessage("Invalid phone number: must start with 6–9 and contain only digits")
        .custom(async (value) => {
            const existing = await db.query("SELECT * FROM nystai_tutors WHERE phone = $1", [value]);
            if (existing.rows.length > 0) {
                throw new Error("Phone number already exists");
            }
            return true;
        }),

    body("expertise").notEmpty().withMessage("Expertise / Courses is required"),

    body("experience_years")
        .notEmpty().withMessage("Experience is required")
        .isNumeric().withMessage("Experience must be a number"),

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


export const handleInputTutorValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};



