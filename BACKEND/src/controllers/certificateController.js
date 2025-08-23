import pool from "../config/db.js";

// Generate certificate (mark completed + store cert URL)
export const generateCertificate = async (req, res, next) => {
  const { studentId } = req.params;
  const { certificate_url } = req.body; // frontend or utils will pass a PDF/image URL

  try {
    const updateQuery = `
      UPDATE studentsuniqueqrcode
      SET certificate_status = 'completed', certificate_url = $1
      WHERE student_id = $2
      RETURNING *;
    `;

    const { rows } = await pool.query(updateQuery, [certificate_url, studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Certificate generated", data: rows[0] });
  } catch (err) {
    console.error("❌ Error generating certificate:", err);
    next(err);
  }
};

// Scan QR → Get Certificate
export const getCertificateByQR = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const query = `
      SELECT spi.student_id, spi.name, spi.last_name, spi.email, spi.phone,
             scd.course_enrolled, scd.batch, scd.tutor,
             spd.passport_photo_url,
             suq.certificate_status, suq.student_qr_url, suq.certificate_url
      FROM studentspersonalinformation spi
      JOIN studentcoursedetails scd ON spi.student_id = scd.student_id
      JOIN student_proof_documents spd ON spi.student_id = spd.student_id
      JOIN studentsuniqueqrcode suq ON spi.student_id = suq.student_id
      WHERE spi.student_id = $1;
    `;

    const { rows } = await pool.query(query, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.json({ success: true, certificate: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching certificate:", err);
    next(err);
  }
};
