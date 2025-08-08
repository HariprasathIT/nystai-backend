import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const validateUpdatePricingPlan = [
  body('plan_name')
    .trim()
    .notEmpty().withMessage('Plan name is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Plan name must only contain letters'),

  body('price')
    .trim()
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a valid number'),

  body('point_1')
    .trim()
    .notEmpty().withMessage('Point 1 is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Plan name must only contain letters'),
  body('point_2')
    .trim()
    .notEmpty().withMessage('Point 2 is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Plan name must only contain letters'),
  body('point_3')
    .trim()
    .notEmpty().withMessage('Point 3 is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Plan name must only contain letters'),
  body('point_4')
    .trim()
    .notEmpty().withMessage('Point 4 is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Plan name must only contain letters'),
  body('point_5')
    .trim()
    .notEmpty().withMessage('Point 5 is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Plan name must only contain letters'),

  body('point_6')
    .optional()
    .trim(),
  body('point_7')
    .optional()
    .trim()
];

export const handleUpdatePricingPlanValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

