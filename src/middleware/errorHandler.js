const errorHandler = (err, req, res, next) => {
  // Handle file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File size should be below 2MB' });
  }

  // Handle video file block or unsupported type
  if (err.message === 'Video files are not allowed') {
    return res.status(400).json({ error: 'Video files are not allowed' });
  }

  if (err.message === 'Unsupported file type') {
    return res.status(415).json({ error: 'Unsupported file type. Allowed: jpg, png, webp, pdf' });
  }

  // Default fallback
  res.status(500).json({
    error: 'Something went wrong',
    detail: err.message
  });
};

export default errorHandler;
