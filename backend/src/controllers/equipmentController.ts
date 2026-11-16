import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipmentService';

export class EquipmentController {
  private service = new EquipmentService();

  getAll = (req: Request, res: Response): void => {
    try {
      const { estado, categoria, deposito_id } = req.query;
      const filters = {
        estado: estado as string | undefined,
        categoria: categoria as string | undefined,
        deposito_id: deposito_id ? Number(deposito_id) : undefined,
      };
      const equipment = this.service.getAllEquipment(filters);
      res.json({ success: true, count: equipment.length, data: equipment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = (req: Request, res: Response): void => {
    try {
      const id = Number(req.params.id);
      const item = this.service.getEquipmentById(id);
      if (!item) {
        res.status(404).json({ success: false, message: 'Equipo biomédico no encontrado' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  search = (req: Request, res: Response): void => {
    try {
      const query = (req.query.q as string) || '';
      const results = this.service.searchEquipment(query);
      res.json({ success: true, count: results.length, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
