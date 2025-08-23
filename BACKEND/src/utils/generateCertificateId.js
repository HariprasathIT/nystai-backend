export const generateCertificateId = (studentRegisterNumber) => {
  const currentYear = new Date().getFullYear();

  // Ensure last 2 digits padded (e.g., 7 -> 07)
  const lastDigits = String(studentRegisterNumber).padStart(2, "0");

  return `CERT${currentYear}NYST${lastDigits}`;
};
