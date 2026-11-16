import { Router } from 'express';
import { MovementController } from '../controllers/movementController';

const router = Router();
const controller = new MovementController();

router.post('/prestamo', controller.createLoan);
router.post('/retorno', controller.createReturn);
router.get('/activos', controller.getActive);
router.get('/historial', controller.getHistory);
router.get('/equipo/:id', controller.getByEquipment);

export default router;
