import express from 'express';
import { addPricingPlan, deletePricingPlan, getAllPricingPlans, getsingleplan, updatePricingPlan } from '../controllers/pricingPlanController.js';
import { handleInputPricingPlanValidationErrors, validateInputPricingPlan } from '../middleware/pricingPlanValidation.js';
import multer from 'multer';
import { handleUpdatePricingPlanValidationErrors, validateUpdatePricingPlan } from '../middleware/pricingplanupdatevalidation.js';
const upload = multer();


const router = express.Router();

router.post('/add-pricing-plan',
    upload.none(),
    validateInputPricingPlan,
    handleInputPricingPlanValidationErrors,
    addPricingPlan
);

router.get('/all-pricing-plans', getAllPricingPlans);

router.put('/update-pricing-plan/:id', upload.none(), validateUpdatePricingPlan, handleUpdatePricingPlanValidationErrors, updatePricingPlan);

router.delete('/delete-pricing-plan/:id', deletePricingPlan);

router.get("/single-plan/:id", getsingleplan);


export default router;
