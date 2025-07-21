import QRCode from 'qrcode';
import { put } from '@vercel/blob';

const generateAndUploadQR = async (data, studentId) => {
    try {
        const qrText = JSON.stringify(data); // you can customize this
        const qrBuffer = await QRCode.toBuffer(qrText);

        const blob = await put(`qrcodes/student-${studentId}.png`, qrBuffer, {
            access: 'public',
        });

        return blob.url;
    } catch (err) {
        console.error("QR generation error:", err);
        throw new Error('QR code generation failed');
    }
};

export default generateAndUploadQR;
