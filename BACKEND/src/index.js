import express from 'express';
import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import './src/config/db.js';

import blobRoutes from './routes/blobRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import Nystaicoursesroutes from './routes/Nystaicoursesroutes.js';
import pricingPlanRoutes from './routes/Pricingroutes.js';

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.vercel.app"], // allow localhost & vercel
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json()); // for JSON data
app.use(express.urlencoded({ extended: true })); //for form data

app.use('/', blobRoutes);
app.use('/superadmin', authRoutes);
app.use('/Allcourses', Nystaicoursesroutes);
app.use('/pricing-plans', pricingPlanRoutes);


app.use(errorHandler)

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



