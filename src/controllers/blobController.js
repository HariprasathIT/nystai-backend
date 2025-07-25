import db from "../config/db.js";
import { put } from '@vercel/blob';
import asyncHandler from 'express-async-handler';
import { generateStudentRegisterNumber } from '../utils/generateStudentID.js';


// Insering a new student with proof documents
export const insertStudentWithProof = asyncHandler(async (req, res) => {
    const client = await db.connect();

    try {
        const {
            name,
            last_name,
            dob,
            gender,
            email,
            phone,
            alt_phone,
            aadhar_number,
            pan_number,
            address,
            pincode,
            state,
            department,
            course,
            year_of_passed,
            experience,
            department_stream,
            course_duration,
            join_date,
            end_date,
            course_enrolled,
            batch,
            tutor
        } = req.body;

        const files = req.files;
        const requiredDocs = ['passport_photo', 'pan_card', 'aadhar_card', 'sslc_marksheet'];

        //  Check required files
        for (const doc of requiredDocs) {
            if (!files[doc] || !files[doc][0]) {
                return res.status(400).json({ error: `${doc} is missing` });
            }
        }

        //  Begin transaction
        await client.query('BEGIN');

        //  Upload files in parallel
        const uploadResults = await Promise.all(
            requiredDocs.map(async (field) => {
                const file = files[field][0];

                const blob = await put(`studentproofs/${file.originalname}`, file.buffer, {
                    access: 'public',
                    token: process.env.VERCEL_BLOB_RW_TOKEN,
                    addRandomSuffix: true
                });

                return { field, url: blob.url };
            })
        );

        //  Map uploaded URLs
        const uploadedUrls = {};
        uploadResults.forEach(({ field, url }) => {
            uploadedUrls[field] = url;
        });

        //  Insert into studentspersonalinformation
        const personalResult = await client.query(
            `INSERT INTO studentspersonalinformation 
      (name, last_name, dob, gender, email, phone, alt_phone, aadhar_number, pan_number, address, pincode, state, department, course, year_of_passed, experience)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING student_id`,
            [
                name,
                last_name,
                dob,
                gender,
                email,
                phone,
                alt_phone,
                aadhar_number,
                pan_number,
                address,
                pincode,
                state,
                department,
                course,
                year_of_passed,
                experience
            ]
        );

        const studentId = personalResult.rows[0].student_id;

        //  Generate register number
        const studentRegisterNumber = await generateStudentRegisterNumber(course_enrolled, client);

        //  Insert into studentcoursedetails
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

        //  Insert into student_proof_documents
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

        //  Insert into studentsuniqueqrcode
        await client.query(
            `INSERT INTO studentsuniqueqrcode (student_id) VALUES ($1)`,
            [studentId]
        );

        //  Commit and respond
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

// Get all students with their details
// This function retrieves all students along with their personal information, course details, proof documents, and
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

// Delete student by ID
// This function deletes a student from the database by their ID
export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    const client = await db.connect();

    try {
        const check = await client.query('SELECT * FROM studentspersonalinformation WHERE student_id = $1', [id]);
        if (check.rowCount === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await client.query('DELETE FROM studentspersonalinformation WHERE student_id = $1', [id]);

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error.message);
        res.status(500).json({ error: 'Delete failed', detail: error.message });
    } finally {
        client.release();
    }
};

// Get student by ID
// This function retrieves a student's details by their ID, including personal information, course details, proof
export const getStudentById = async (req, res) => {
    const { student_id } = req.params;

    const client = await db.connect();

    try {
        const query = `
      SELECT 
        spi.*, 
        scd.*, 
        sp.*, 
        suq.*
      FROM studentspersonalinformation spi
      LEFT JOIN studentcoursedetails scd ON spi.student_id = scd.student_id
      LEFT JOIN student_proof_documents sp ON spi.student_id = sp.student_id
      LEFT JOIN studentsuniqueqrcode suq ON spi.student_id = suq.student_id
      WHERE spi.student_id = $1
    `;

        const result = await client.query(query, [student_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch student',
            detail: err.message,
        });
    } finally {
        client.release();
    }
};

