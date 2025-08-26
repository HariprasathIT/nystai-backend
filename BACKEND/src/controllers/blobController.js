import db from "../config/db.js";
import { put } from '@vercel/blob';
import asyncHandler from 'express-async-handler';
import { generateStudentRegisterNumber } from '../utils/generateStudentID.js';
import generateAndUploadQR from '../utils/generateAndUploadQR.js';
import { generateCertificateId } from "../utils/generateCertificateId.js";


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
                return res.status(400).json({
                    success: false,
                    error: `${doc} is missing`
                });
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
            success: true,
            message: 'Student inserted successfully',
            student_id: studentId,
            student_register_number: studentRegisterNumber
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Insert failed', detail: error.message
        });
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

        res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data: result.rows
        });

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
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        await client.query('DELETE FROM studentspersonalinformation WHERE student_id = $1', [id]);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Delete failed',
            detail: error.message
        });

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
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student retrieved successfully',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch student',
            detail: err.message,
        });

    } finally {
        client.release();
    }
};


// This function updates a student's details along with their proof documents
// It handles file uploads, updates personal information, course details, and generates a QR code and certificate ID if completed
export const updateStudentWithProof = async (req, res) => {
    const client = await db.connect();

    try {
        const { student_id } = req.params;
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
            tutor,
            certificate_status
        } = req.body || {};

        const files = req.files;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'No data provided for update',
                hint: 'Make sure you are using form-data in Postman and have the correct multer middleware'
            });
        }

        const studentCheck = await client.query(
            'SELECT student_id FROM studentspersonalinformation WHERE student_id = $1',
            [student_id]
        );

        if (studentCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await client.query('BEGIN');

        // Upload proof documents if provided
        const uploadedUrls = {};
        const docFields = ['passport_photo', 'pan_card', 'aadhar_card', 'sslc_marksheet'];

        if (files) {
            for (const field of docFields) {
                if (files[field]) {
                    const file = files[field][0];
                    const blob = await put(`studentproofs/${file.originalname}`, file.buffer, {
                        access: 'public',
                        token: process.env.VERCEL_BLOB_RW_TOKEN,
                        addRandomSuffix: true
                    });
                    uploadedUrls[field] = blob.url;
                }
            }
        }

        // Update personal information
        await client.query(
            `UPDATE studentspersonalinformation 
            SET name = $1, last_name = $2, dob = $3, gender = $4, email = $5, 
                phone = $6, alt_phone = $7, aadhar_number = $8, pan_number = $9, 
                address = $10, pincode = $11, state = $12, department = $13, 
                course = $14, year_of_passed = $15, experience = $16
            WHERE student_id = $17`,
            [
                name, last_name, dob, gender, email, phone, alt_phone,
                aadhar_number, pan_number, address, pincode, state,
                department, course, year_of_passed, experience, student_id
            ]
        );

        // Update course details
        await client.query(
            `UPDATE studentcoursedetails 
            SET department_stream = $1, course_duration = $2, join_date = $3, 
                end_date = $4, course_enrolled = $5, batch = $6, tutor = $7
            WHERE student_id = $8`,
            [
                department_stream, course_duration, join_date,
                end_date, course_enrolled, batch, tutor, student_id
            ]
        );

        // Update proof documents if any new files uploaded
        if (Object.keys(uploadedUrls).length > 0) {
            const updateFields = [];
            const values = [];
            let paramCount = 1;

            for (const [field, url] of Object.entries(uploadedUrls)) {
                updateFields.push(`${field}_url = $${paramCount}`);
                values.push(url);
                paramCount++;
            }

            values.push(student_id);

            await client.query(
                `UPDATE student_proof_documents 
                SET ${updateFields.join(', ')}
                WHERE student_id = $${paramCount}`,
                values
            );
        }

        // 🔹 Generate certificate + QR if status is completed
        if (certificate_status === "completed") {

            // 1️⃣ Get student register number & existing certificate
            const regResult = await client.query(
                `SELECT studentregisternumber, certificate_id 
         FROM studentsuniqueqrcode 
         LEFT JOIN studentcoursedetails scd ON scd.student_id = studentsuniqueqrcode.student_id
         WHERE studentsuniqueqrcode.student_id = $1`,
                [student_id]
            );

            let studentRegisterNumber;
            let certificateId;

            if (regResult.rows.length === 0) {
                // Student has no certificate yet
                const reg = await client.query(
                    `SELECT studentregisternumber FROM studentcoursedetails WHERE student_id = $1`,
                    [student_id]
                );
                if (reg.rows.length === 0 || !reg.rows[0].studentregisternumber) {
                    throw new Error("Student register number not found");
                }
                studentRegisterNumber = reg.rows[0].studentregisternumber;

                // Generate new certificate ID
                certificateId = await generateCertificateId(client);
            } else {
                // Student already has certificate
                studentRegisterNumber = regResult.rows[0].studentregisternumber;
                certificateId = regResult.rows[0].certificate_id;

                if (!certificateId) {
                    // No certificate ID yet, generate one
                    certificateId = await generateCertificateId(client);
                }
            }

            // 2️⃣ Generate QR
            const qrUrl = await generateAndUploadQR(studentRegisterNumber, student_id, certificateId);

            // 3️⃣ Save/update in DB
            await client.query(
                `INSERT INTO studentsuniqueqrcode (student_id, certificate_id, student_qr_url, certificate_status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id)
         DO UPDATE SET certificate_status=$4, student_qr_url=$3, certificate_id=$2`,
                [student_id, certificateId, qrUrl, "completed"]
            );
        }



        await client.query('COMMIT');

        // Fetch updated student details
        const updated = await client.query(
            `SELECT spi.*, scd.*, spd.*, suq.*
             FROM studentspersonalinformation spi
             LEFT JOIN studentcoursedetails scd ON spi.student_id = scd.student_id
             LEFT JOIN student_proof_documents spd ON spi.student_id = spd.student_id
             LEFT JOIN studentsuniqueqrcode suq ON spi.student_id = suq.student_id
             WHERE spi.student_id = $1`,
            [student_id]
        );

        const { course_id, id, qr_id, ...filteredData } = updated.rows[0] || {};

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: filteredData
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Update failed',
            detail: error.message
        });
    } finally {
        client.release();
    }
};



// Get total students count
// This function retrieves the total count of students from the database
export const getStudentsCount = async (req, res, next) => {
    try {
        const result = await db.query(`
      SELECT COUNT(*) AS total_students FROM studentspersonalinformation
    `);

        res.status(200).json({
            success: true,
            message: "Students count fetched successfully",
            count: parseInt(result.rows[0].total_students, 10)
        });
    } catch (err) {
        next(err);
    }
};


// Get completed students count
// This function retrieves the count of students who have completed their courses
export const getCompletedStudentsCount = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) AS completed_students 
            FROM studentsuniqueqrcode
            WHERE certificate_status = 'completed'
        `);

        res.status(200).json({
            success: true,
            message: "Completed students count fetched successfully",
            count: parseInt(result.rows[0].completed_students, 10)
        });
    } catch (err) {
        next(err);
    }
};


// Get student count for a particular course
export const getCourseStudentCount = async (req, res, next) => {
    try {
        const { course_enrolled } = req.params; // example: /api/students/count/IOT

        const result = await db.query(
            `SELECT COUNT(*) AS student_count
       FROM studentcoursedetails
       WHERE course_enrolled = $1`,
            [course_enrolled]
        );

        const count = parseInt(result.rows[0].student_count, 10);

        if (count === 0) {
            return res.status(404).json({
                success: false,
                message: `No students found for course: ${course_enrolled}`
            });
        }

        res.status(200).json({
            success: true,
            message: "Student count fetched successfully",
            data: {
                course_enrolled,
                student_count: count
            }
        });

    } catch (err) {
        next(err);
    }
};


// Get student count grouped by course_enrolled
export const getStudentsCountByCourse = async (req, res, next) => {
    try {
        const result = await db.query(`
      SELECT course_enrolled, COUNT(*) AS student_count
      FROM studentcoursedetails
      GROUP BY course_enrolled
    `);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student counts per course fetched successfully",
            data: result.rows.map(row => ({
                course: row.course_enrolled,
                student_count: parseInt(row.student_count, 10),
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Something went wrong",
            detail: err.message,
        });
    }
};


// Get last 6 months student joining count
export const getLastSixMonthsStudentCount = async (req, res) => {
    try {
        const query = `
      SELECT TO_CHAR(DATE_TRUNC('month', join_date), 'Mon YYYY') AS month,
             COUNT(*) AS student_count
      FROM studentcoursedetails
      WHERE join_date >= (CURRENT_DATE - INTERVAL '6 months')
      GROUP BY DATE_TRUNC('month', join_date)
      ORDER BY DATE_TRUNC('month', join_date);
    `;

        const result = await db.query(query);

        return res.status(200).json({
            success: true,
            data: result.rows.map(row => ({
                month: row.month,
                student_count: parseInt(row.student_count, 10)
            }))
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Something went wrong",
            detail: err.message
        });
    }
};


// Get Single Student QR by student_id
export const getStudentQR = async (req, res, next) => {
    const { student_id } = req.params;

    try {
        const result = await db.query(
            "SELECT * FROM studentsuniqueqrcode WHERE student_id = $1",
            [student_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "QR not found for this student" });
        }

        const qrData = result.rows[0];

        if (qrData.certificate_status !== "completed") {
            return res.status(200).json({
                success: false,
                message: "Certificate not yet generated",
                certificate_status: qrData.certificate_status,
            });
        }

        res.status(200).json({
            success: true,
            data: {
                student_id: qrData.student_id,
                certificate_status: qrData.certificate_status,
                student_qr_url: qrData.student_qr_url,
                certificate_url: qrData.certificate_url,
            },
        });
    } catch (err) {
        next(err);
    }
};