import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();
const controller = new DashboardController();

router.get('/resumen', controller.getSummary);

export default router;
