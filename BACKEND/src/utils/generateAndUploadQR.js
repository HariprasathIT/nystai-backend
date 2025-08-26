import QRCode from "qrcode";
import { put } from "@vercel/blob";

const generateAndUploadQR = async (studentRegisterNumber, studentId, certificateId) => {
  try {
    console.log("🚀 Starting QR generation");
    console.log("Student ID:", studentId);
    console.log("Certificate ID:", certificateId);
    console.log("Register Number:", studentRegisterNumber);

    if (!certificateId) {
      throw new Error("❌ certificateId is missing!");
    }
    if (!process.env.FRONTEND_URL) {
      throw new Error("❌ FRONTEND_URL is missing in .env");
    }
    if (!process.env.VERCEL_BLOB_RW_TOKEN) {
      throw new Error("❌ VERCEL_BLOB_RW_TOKEN is missing in .env");
    }

    // ✅ Create verification link
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?certificateId=${certificateId}`;
    console.log("🔗 Verification URL:", verificationUrl);

    // ✅ Generate QR image
    const qrBuffer = await QRCode.toBuffer(verificationUrl, { type: "png" });
    console.log("✅ QR Buffer generated, size:", qrBuffer.length);

    // ✅ Upload to Vercel Blob
    const fileName = `studentqrs/${studentId}-${certificateId}.png`;
    console.log("📤 Uploading file:", fileName);

    const blob = await put(fileName, qrBuffer, {
      access: "public",
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      allowOverwrite: true,
    });

    console.log("✅ QR uploaded successfully:", blob.url);
    return blob.url;
  } catch (err) {
    console.error("❌ QR generation failed:", err);
    throw new Error(`QR code generation failed: ${err.message}`);
  }
};

export default generateAndUploadQR;
