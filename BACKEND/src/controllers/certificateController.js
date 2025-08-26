// backend/controllers/certificateController.js
import pool from "../config/db.js"; // PostgreSQL pool
import { put } from "@vercel/blob";
import { generateCertificateId } from "../utils/generateCertificateId.js";

// Verify certificate with 2 random fields
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId, aadhar, email, pan, phone } = req.body;

    if (!certificateId) {
      return res.status(400).json({ success: false, error: "CertificateId is required" });
    }

    // Collect submitted fields
    const submittedFields = { aadhar, email, pan, phone };
    const filledFields = Object.entries(submittedFields).filter(([_, value]) => value);

    // Require exactly 2 fields
    if (filledFields.length !== 2) {
      return res.status(400).json({ 
        success: false, 
        error: "Exactly 2 fields must be provided", 
        hint: "Enter any 2 of Aadhar, Email, PAN, or Phone"
      });
    }

    // Fetch student by certificateId
    const result = await pool.query(
      `SELECT spi.student_id, spi.aadhar_number, spi.email, spi.pan_number, spi.phone,
              suq.certificate_id, suq.certificate_status, suq.certificate_url
       FROM studentsuniqueqrcode suq
       JOIN studentspersonalinformation spi ON suq.student_id = spi.student_id
       WHERE suq.certificate_id = $1 AND suq.certificate_status='completed'`,
      [certificateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Certificate not found or inactive" });
    }

    const student = result.rows[0];

    // Validate submitted fields
    let matches = 0;
    if (aadhar && aadhar === student.aadhar_number) matches++;
    if (email && email === student.email) matches++;
    if (pan && pan === student.pan_number) matches++;
    if (phone && phone === student.phone) matches++;

    if (matches !== 2) {
      return res.status(401).json({ success: false, error: "Verification failed: fields do not match" });
    }

    // Success → return certificate URL
    return res.json({
      success: true,
      certificateUrl: student.certificate_url,
      certificateId: student.certificate_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};

// Upload certificate for a student

export const uploadCertificateForStudent = async (req, res) => {
  try {
    const { studentId } = req.params; // ✅ get from route
    const file = req.file;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required in route" });
    }
    if (!file) {
      return res.status(400).json({ success: false, error: "Certificate file is required" });
    }

    // Check if student exists
    const studentCheck = await pool.query(
      `SELECT studentregisternumber FROM studentcoursedetails WHERE student_id = $1`,
      [studentId]
    );

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const { studentregisternumber } = studentCheck.rows[0];

    // Generate certificate ID
    const certificateId = await generateCertificateId();

    // Upload to Vercel Blob
    const blob = await put(`certificates/${file.originalname}`, file.buffer, {
      access: "public",
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      addRandomSuffix: true,
    });

    const certificateUrl = blob.url;

    // UPSERT into studentsuniqueqrcode
    await pool.query(
      `INSERT INTO studentsuniqueqrcode (student_id, certificate_id, certificate_url, certificate_status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id)
       DO UPDATE SET certificate_id = $2, certificate_url = $3, certificate_status = $4`,
      [studentId, certificateId, certificateUrl, "completed"]
    );

    res.status(200).json({
      success: true,
      message: `Certificate uploaded successfully for student ID ${studentId}`,
      certificateId,
      certificateUrl,
    });
  } catch (err) {
    console.error("Error uploading certificate:", err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};