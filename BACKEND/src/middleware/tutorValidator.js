import { body } from "express-validator";
import db from "../config/db.js";

const tutorValidator = [
    body("dob").notEmpty().withMessage("Date of birth is required"),

    body("gender").notEmpty().withMessage("Gender is required"),

    body("first_name").notEmpty().withMessage("First name is required"),

    body("last_name").notEmpty().withMessage("Last name is required"),

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
        .notEmpty()
        .withMessage("Phone number is required")
        .bail()
        .isMobilePhone("en-IN") // Adjust locale if needed
        .withMessage("Invalid phone number")
        .bail()
        .matches(/^\d{10}$/)
        .withMessage("Phone number must be exactly 10 digits")
        .bail()
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

    body("joining_date").notEmpty().withMessage("Joining date is required"),
];

export default tutorValidator;
