import { body } from 'express-validator';

export const validatePricingPlan = [
  body('course_name').trim().notEmpty().withMessage('Course name is required'),
  body('short_description').trim().notEmpty().withMessage('Short description is required'),
  body('price').trim().notEmpty().withMessage('Price is required'),

  // Optional points but can be required if you want
  body('point_1').optional(),
  body('point_2').optional(),
  body('point_3').optional(),
  body('point_4').optional(),
  body('point_5').optional(),
  body('point_6').optional(),
  body('point_7').optional()
];
