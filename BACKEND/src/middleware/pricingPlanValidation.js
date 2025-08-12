import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const validateInputPricingPlan = [
  body('plan_name')
    .trim()
    .notEmpty().withMessage('Plan name is required'),

  body('price')
    .trim()
    .notEmpty().withMessage('Price is required')
    .bail()
    .isNumeric().withMessage('Price must be a valid number'),

  body('point_1')
    .trim()
    .notEmpty().withMessage('Point 1 is required'),

  body('point_2')
    .trim()
    .notEmpty().withMessage('Point 2 is required'),

  body('point_3')
    .trim()
    .notEmpty().withMessage('Point 3 is required'),

  body('point_4')
    .trim()
    .notEmpty().withMessage('Point 4 is required'),

  body('point_5')
    .trim()
    .notEmpty().withMessage('Point 5 is required'),

  body('point_6')
    .optional()
    .trim(),

  body('point_7')
    .optional()
    .trim()
];

export const handleInputPricingPlanValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // Create default success structure for all fields in req.body
  const fields = {};
  Object.keys(req.body).forEach(key => {
    fields[key] = { success: true, msg: "" };
  });

  // If validation fails, update only the failed fields
  if (!errors.isEmpty()) {
    errors.array().forEach(err => {
      if (fields.hasOwnProperty(err.path)) {
        fields[err.path] = { success: false, msg: err.msg };
      }
    });

    return res.status(400).json({
      success: false,
      fields
    });
  }

  next();
};
