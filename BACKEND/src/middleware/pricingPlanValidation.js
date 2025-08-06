import { body } from 'express-validator';

export const validatePricingPlan = [
  body('plan_name').trim().notEmpty().withMessage('Course name is required'),
  body('price').trim().notEmpty().withMessage('Price is required'),

  // Optional points but can be required if you want
  body('point_1').trim().notEmpty().withMessage('Minimum Five points requierd'),
  body('point_2').trim().notEmpty().withMessage('Minimum Five points requierd'),
  body('point_3').trim().notEmpty().withMessage('Minimum Five points requierd'),
  body('point_4').trim().notEmpty().withMessage('Minimum Five points requierd'),
  body('point_5').trim().notEmpty().withMessage('Minimum Five points requierd'),
  body('point_6').optional(),
  body('point_7').optional()
];
