import { validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map((err) => err.msg);
    return res.status(400).json({ errors: errorMsgs });
  }
  next();
};

export default handleValidation;
