
// import express from 'express';
// import upload from '../middleware/uploadMiddleware.js';
// import { uploadImage } from '../controllers/blobController.js';

// const router = express.Router();

// router.post('/upload', upload, uploadImage);


// export default router;




// src/routes/blobRoutes.js
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { insertStudentWithProof } from '../controllers/blobController.js';
import { validateStudent } from '../middleware/validateStudent.js'; // ✅ Import your validation middleware
import { validationResult } from 'express-validator';

const router = express.Router();


// router.post('/insert-student', validateStudent, upload, insertStudentWithProof);
router.post('/insert-student', upload, validateStudent,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    insertStudentWithProof
);

export default router;





