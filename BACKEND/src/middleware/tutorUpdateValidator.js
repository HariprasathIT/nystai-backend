import { body } from "express-validator";
import db from "../config/db.js";

const validDomains = ["gmail.com", "yahoo.com", "outlook.com"];

export const tutorUpdateValidator = [
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
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
        .custom(async (value, { req }) => {
            const { id } = req.params;
            const result = await db.query("SELECT * FROM nystai_tutors WHERE email = $1 AND tutor_id != $2", [value, id]);
            if (result.rows.length > 0) {
                throw new Error("Email already exists");
            }
            return true;
        }),
    body("phone")
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone("en-IN").withMessage("Invalid phone number")
        .matches(/^\d{10}$/).withMessage("Phone number must be exactly 10 digits")
        .custom(async (value, { req }) => {
            const { id } = req.params;
            const result = await db.query("SELECT * FROM nystai_tutors WHERE phone = $1 AND tutor_id != $2", [value, id]);
            if (result.rows.length > 0) {
                throw new Error("Phone number already exists");
            }
            return true;
        }),
    body("expertise").notEmpty().withMessage("Expertise / Courses is required"),
    body("experience_years")
        .notEmpty().withMessage("Experience is required"),
    body("joining_date").notEmpty().withMessage("Joining date is required"),
];
