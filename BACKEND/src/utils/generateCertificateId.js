export const generateCertificateId = (courseEnrolled, studentRegisterNumber) => {
  const year = new Date().getFullYear();
  return `NYST-${year}-${courseEnrolled}-${studentRegisterNumber}`;
};
