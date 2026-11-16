import { Router } from 'express';
import equipmentRoutes from './equipmentRoutes';
import locationRoutes from './locationRoutes';
import dashboardRoutes from './dashboardRoutes';
import movementRoutes from './movementRoutes';

const router = Router();

router.use('/equipos', equipmentRoutes);
router.use('/ubicaciones', locationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/movimientos', movementRoutes);

export default router;
