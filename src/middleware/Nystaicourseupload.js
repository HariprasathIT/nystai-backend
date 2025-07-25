import multer from 'multer';

// Storage not needed since we're using buffer (not disk)
const storage = multer.memoryStorage();

// File type check
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, webp, gif, jpg)'));
  }
};

// Max file size: 2MB = 2 * 1024 * 1024
export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});
