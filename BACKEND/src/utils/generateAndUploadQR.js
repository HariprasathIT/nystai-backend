import QRCode from "qrcode";
import { put } from "@vercel/blob";

const generateAndUploadQR = async (studentRegisterNumber, studentId, certificateId) => {
  try {
    console.log("Starting QR generation for student:", studentId);
    console.log("Register Number for QR:", studentRegisterNumber);

    // ✅ Create a verification link instead of JSON
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?certificateId=${certificateId}`;

    // Generate QR image with the link
    const qrBuffer = await QRCode.toBuffer(verificationUrl, { type: "png" });

    // Upload to Vercel Blob
    const blob = await put(`studentqrs/${studentId}-${certificateId}.png`, qrBuffer, {
      access: "public",
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      allowOverwrite: true, // ✅ overwrite if re-generated
    });

    console.log("QR uploaded to:", blob.url);
    return blob.url;
  } catch (err) {
    console.error("QR generation failed:", err.message);
    throw new Error(`QR code generation failed: ${err.message}`);
  }
};

export default generateAndUploadQR;
