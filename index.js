import express from 'express';
import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import './src/config/db.js';

import blobRoutes from './src/routes/blobRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import Nystaicoursesroutes from './src/routes/Nystaicoursesroutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', blobRoutes);
app.use('/superadmin', authRoutes);
app.use('/Allcourses', Nystaicoursesroutes);


app.use(errorHandler)

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

