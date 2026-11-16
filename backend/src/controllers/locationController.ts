import { Request, Response } from 'express';
import { LocationService } from '../services/locationService';

export class LocationController {
  private service = new LocationService();

  getAll = (req: Request, res: Response): void => {
    try {
      const { tipo, sucursal_id } = req.query;
      const locations = this.service.getAllLocations({
        tipo: tipo as string | undefined,
        sucursal_id: sucursal_id ? Number(sucursal_id) : undefined,
      });
      res.json({ success: true, count: locations.length, data: locations });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = (req: Request, res: Response): void => {
    try {
      const id = Number(req.params.id);
      const item = this.service.getLocationById(id);
      if (!item) {
        res.status(404).json({ success: false, message: 'Ubicación no encontrada' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
