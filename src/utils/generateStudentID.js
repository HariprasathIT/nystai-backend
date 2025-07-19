import db from "../config/db.js";

export const generateStudentRegisterNumber = async (course) => {
  const courseCode = course.toUpperCase(); // IOT or CCTV
  const currentYear = new Date().getFullYear(); // 2025

  const prefix = `NYST${currentYear}${courseCode}`;

  const result = await db.query(
    `SELECT COUNT(*) FROM studentcoursedetails WHERE studentregisternumber = $1`,
    [course]
  );

  const count = parseInt(result.rows[0].count || 0) + 1;

  const serial = String(count).padStart(3, "0");

  return `${prefix}${serial}`; 
};
