import express from 'express';
import { addPricingPlan, deletePricingPlan, getAllPricingPlans, updatePricingPlan } from '../controllers/pricingPlanController.js';
import { validatePricingPlan } from '../middleware/pricingPlanValidation.js';
import multer from 'multer';
const upload = multer();


const router = express.Router();

router.post('/add-pricing-plan',
    upload.none(),
    validatePricingPlan,
    addPricingPlan
);

router.get('/all-pricing-plans', getAllPricingPlans);

router.put('/update-pricing-plan/:id', upload.none(), updatePricingPlan);

router.delete('/delete-pricing-plan/:id', deletePricingPlan);

export default router;
