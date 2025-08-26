// Use the DB client passed from controller
export const generateCertificateId = async (client) => {
  const currentYear = new Date().getFullYear();

  // 🔹 Fetch the latest certificate_id for the current year
  const result = await client.query(
    `SELECT certificate_id 
     FROM studentsuniqueqrcode 
     WHERE certificate_id LIKE $1
     ORDER BY certificate_id DESC 
     LIMIT 1`,
    [`CERT${currentYear}NYST%`]
  );

  let nextNumber = 1;

  if (result.rows.length > 0) {
    const lastId = result.rows[0].certificate_id;
    const match = lastId.match(/(\d{3})$/); // extract last 3 digits
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }

  return `CERT${currentYear}NYST${String(nextNumber).padStart(3, "0")}`;
};
