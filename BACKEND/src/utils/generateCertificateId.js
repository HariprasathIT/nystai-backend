// utils/certificate.js
export const generateCertificateId = (studentRegisterNumber) => {
  const currentYear = new Date().getFullYear();

  // 🔹 Extract only the last number(s) from the register number
  const lastNumber = String(studentRegisterNumber).match(/\d+$/)?.[0] || "0";

  // Always pad to 3 digits (e.g., 1 → 001, 23 → 023)
  const padded = lastNumber.padStart(3, "0");

  return `CERT${currentYear}NYST${padded}`;
};
