import pool from "../config/db.js";

// Verify Certificate
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId, aadhar, email, pan, phone } = req.body;

    // 1. Find student by certificateId
    const certResult = await pool.query(
      `SELECT spi.student_id, spi.aadhar_number, spi.email, spi.pan_number, spi.phone
       FROM studentsuniqueqrcode suq
       JOIN studentspersonalinformation spi 
       ON suq.student_id = spi.student_id
       WHERE suq.certificate_id = $1 AND suq.certificate_status = 'completed'`,
      [certificateId]
    );

    if (certResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Certificate not found or not active" });
    }

    const student = certResult.rows[0];

    // 2. Check if at least 2 fields match
    let matches = 0;
    if (aadhar && aadhar === student.aadhar_number) matches++;
    if (email && email === student.email) matches++;
    if (pan && pan === student.pan_number) matches++;
    if (phone && phone === student.phone) matches++;

    if (matches < 2) {
      return res.status(401).json({ success: false, error: "Verification failed" });
    }

    // 3. Success → return student + certificate data
    res.json({
      success: true,
      message: "Verification successful",
      certificate: {
        certificateId,
        studentId: student.student_id,
        // you can include more details for certificate rendering
      }
    });

  } catch (err) {
    next(err);
  }
};
