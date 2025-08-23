// backend/controllers/certificateController.js
import pool from "../config/db.js";// your postgres pool

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId, aadhar, email, pan, phone } = req.body;

    if (!certificateId) {
      return res.status(400).json({ success: false, error: "CertificateId is required" });
    }

    // Find student by certificateId
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

    // Check at least 2 matches
    let matches = 0;
    if (aadhar && aadhar === student.aadhar_number) matches++;
    if (email && email === student.email) matches++;
    if (pan && pan === student.pan_number) matches++;
    if (phone && phone === student.phone) matches++;

    if (matches < 2) {
      return res.status(401).json({ success: false, error: "Verification failed" });
    }

    // ✅ Success → send certificate URL
    return res.json({
      success: true,
      certificateUrl: student.certificate_url,
      certificateId: student.certificate_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
