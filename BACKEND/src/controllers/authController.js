import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SUPER_ADMIN = {
  email: 'nystaiinstitute@gmail.com',
  password: 'nystai@2024'
};

export const superAdminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email !== SUPER_ADMIN.email || password !== SUPER_ADMIN.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'superadmin', email }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.status(200).json({
    message: 'Login successful',
    token
  });
};
