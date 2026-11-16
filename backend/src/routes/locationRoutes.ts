import { Router } from 'express';
import { LocationController } from '../controllers/locationController';

const router = Router();
const controller = new LocationController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;
