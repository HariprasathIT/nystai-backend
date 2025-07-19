import multer from 'multer';

// Memory storage
const storage = multer.memoryStorage();

// File type check
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  const isVideo = file.mimetype.startsWith('video/');

  if (isVideo) {
    return cb(new Error('Video files are not allowed'));
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Unsupported file type'));
  }

  cb(null, true);
};

// Max file size 2MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB in bytes
});

export default upload.fields([
  { name: 'passport_photo', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 },
  { name: 'aadhar_card', maxCount: 1 },
  { name: 'sslc_marksheet', maxCount: 1 }
]);

