// import QRCode from 'qrcode';
// import { put } from '@vercel/blob';

// const generateAndUploadQR = async (data, studentId) => {
//     try {
//         console.log("Starting QR generation for student:", studentId);
//         console.log("Data for QR:", data);

//         const qrText = JSON.stringify({
//             studentRegisterNumber: data,
//             issuedAt: new Date().toISOString()
//         });

//         const qrBuffer = await QRCode.toBuffer(qrText);

//         const blob = await put(`studentproofs/${studentId}.png`, qrBuffer, {
//             access: 'public',
//             token: process.env.VERCEL_BLOB_RW_TOKEN, //  Just to be safe
//         });

//         console.log("QR uploaded to:", blob.url);
//         return blob.url;
//     } catch (err) {
//         console.error("QR generation error:", err);
//         throw new Error('QR code generation failed');
//     }``
// };

// export default generateAndUploadQR;

// utils/generateAndUploadQR.js
import QRCode from 'qrcode';
import { put } from '@vercel/blob';

const generateAndUploadQR = async (studentRegisterNumber, studentId) => {
    try {
        console.log("Starting QR generation for student:", studentId);
        console.log("Register Number for QR:", studentRegisterNumber);

        const qrText = JSON.stringify({
            studentRegisterNumber,
            issuedAt: new Date().toISOString()
        });

        const qrBuffer = await QRCode.toBuffer(qrText);

        const blob = await put(`studentproofs/${studentId}.png`, qrBuffer, {
            access: 'public',
            token: process.env.VERCEL_BLOB_RW_TOKEN,
            allowOverwrite: true // ✅ This solves your upload problem!
        });

        console.log("QR uploaded to:", blob.url);
        return blob.url;

    } catch (err) {
        console.error("QR generation failed:", err.message);
        throw new Error(`QR code generation failed: ${err.message}`);
    }
};

export default generateAndUploadQR;

