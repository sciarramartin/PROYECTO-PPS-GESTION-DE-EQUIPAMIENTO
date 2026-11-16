import { Router } from 'express';
import { EquipmentController } from '../controllers/equipmentController';

const router = Router();
const controller = new EquipmentController();

router.get('/', controller.getAll);
router.get('/buscar', controller.search);
router.get('/:id', controller.getById);

export default router;
