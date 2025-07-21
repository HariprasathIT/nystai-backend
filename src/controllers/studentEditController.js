import db from '../config/db.js';
import { put } from '@vercel/blob';
import generateAndUploadQR from '../utils/generateAndUploadQR.js';


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
            certificate_status // ✅ New field expected
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

        // ✅ QR CODE: Only generate if certificate is "completed"
        if (certificate_status === 'completed') {
            // Get register number
            const regResult = await client.query(
                'SELECT studentregisternumber FROM studentcoursedetails WHERE student_id = $1',
                [student_id]
            );

            const studentRegisterNumber = regResult.rows[0]?.studentregisternumber;

            if (studentRegisterNumber) {
                const qrUrl = await generateAndUploadQR(studentRegisterNumber, student_id);

                // Update QR URL
                await client.query(
                    `UPDATE studentsuniqueqrcode SET qrcode_url = $1 WHERE student_id = $2`,
                    [qrUrl, student_id]
                );
            }
        }

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Student updated successfully',
            student_id: student_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Update failed', detail: error.message });
    } finally {
        client.release();
    }
};


