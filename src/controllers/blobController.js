import db from "../config/db.js";
import { put } from '@vercel/blob';
import asyncHandler from 'express-async-handler';
import { generateStudentRegisterNumber } from '../utils/generateStudentID.js';

export const insertStudentWithProof = asyncHandler(async (req, res) => {
    const client = await db.connect();

    try {
        const {
            name, last_name, dob, gender, email, phone, alt_phone,
            aadhar_number, pan_number, address, pincode, state,
            department, course, year_of_passed, experience,
            department_stream, course_duration, join_date,
            end_date, course_enrolled, batch, tutor
        } = req.body;

        const files = req.files;

        const requiredDocs = ['passport_photo', 'pan_card', 'aadhar_card', 'sslc_marksheet'];
        for (const doc of requiredDocs) {
            if (!files[doc]) {
                return res.status(400).json({ error: `${doc} is missing` });
            }
        }

        await client.query('BEGIN');

        const uploadedUrls = {};
        for (const field of requiredDocs) {
            const file = files[field][0];
            const blob = await put(`studentproofs/${file.originalname}`, file.buffer, {
                access: 'public',
                token: process.env.VERCEL_BLOB_RW_TOKEN,
                addRandomSuffix: true
            });
            uploadedUrls[field] = blob.url;
        }

        // 1. Insert into studentspersonalinformation
        const personalResult = await client.query(
            `INSERT INTO studentspersonalinformation 
            (name, last_name, dob, gender, email, phone, alt_phone, aadhar_number, pan_number, address, pincode, state, department, course, year_of_passed, experience)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
            RETURNING student_id`,
            [
                name, last_name, dob, gender, email, phone, alt_phone,
                aadhar_number, pan_number, address, pincode, state,
                department, course, year_of_passed, experience
            ]
        );
        const studentId = personalResult.rows[0].student_id;


        const studentRegisterNumber = await generateStudentRegisterNumber(course_enrolled, client);


        // 2. Insert into studentcoursedetails
        await client.query(
            `INSERT INTO studentcoursedetails 
            (student_id, department_stream, course_duration, join_date, end_date, course_enrolled, batch, tutor, studentregisternumber)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                studentId,
                department_stream,
                course_duration,
                join_date,
                end_date,
                course_enrolled,
                batch,
                tutor,
                studentRegisterNumber
            ]
        );

        // 3. Insert into student_proof_documents
        await client.query(
            `INSERT INTO student_proof_documents 
            (student_id, passport_photo_url, pan_card_url, aadhar_card_url, sslc_marksheet_url)
            VALUES ($1, $2, $3, $4, $5)`,
            [
                studentId,
                uploadedUrls.passport_photo,
                uploadedUrls.pan_card,
                uploadedUrls.aadhar_card,
                uploadedUrls.sslc_marksheet
            ]
        );

        // 4. Insert into studentsuniqueqrcode
        await client.query(
            `INSERT INTO studentsuniqueqrcode (student_id) VALUES ($1)`,
            [studentId]
        );

        await client.query('COMMIT');
        res.status(201).json({
            message: 'Student inserted successfully',
            student_id: studentId,
            student_register_number: studentRegisterNumber
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Insert failed', detail: error.message });
    } finally {
        client.release();
    }
});


export const getAllStudents = async (req, res, next) => {
    try {
        const result = await db.query(`
    SELECT 
    spi.*,
    scd.department_stream,
    scd.course_duration,
    scd.join_date,
    scd.end_date,
    scd.course_enrolled,
    scd.batch,
    scd.tutor,
    scd.studentregisternumber,
    spd.passport_photo_url,
    spd.pan_card_url,
    spd.aadhar_card_url,
    spd.sslc_marksheet_url,
    suq.certificate_status,
    suq.student_qr_url
      FROM studentspersonalinformation spi
      LEFT JOIN studentcoursedetails scd ON spi.student_id = scd.student_id
      LEFT JOIN student_proof_documents spd ON spi.student_id = spd.student_id
      LEFT JOIN studentsuniqueqrcode suq ON spi.student_id = suq.student_id;
    `);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
};