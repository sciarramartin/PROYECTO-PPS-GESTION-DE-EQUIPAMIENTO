import { Request, Response } from 'express';
import { MovementService } from '../services/movementService';

export class MovementController {
  private service = new MovementService();

  createLoan = (req: Request, res: Response): void => {
    try {
      const { id_equipo, ubicacion_destino_id, usuario_id, observaciones, horas_retorno_estimado } = req.body;

      if (!id_equipo || !ubicacion_destino_id) {
        res.status(400).json({
          success: false,
          message: 'Debe especificar el equipo y la ubicación de destino.'
        });
        return;
      }

      const movement = this.service.registerLoan({
        id_equipo: Number(id_equipo),
        ubicacion_destino_id: Number(ubicacion_destino_id),
        usuario_id: usuario_id ? Number(usuario_id) : undefined,
        observaciones: observaciones ? String(observaciones) : undefined,
        horas_retorno_estimado: horas_retorno_estimado ? Number(horas_retorno_estimado) : undefined
      });

      res.status(201).json({
        success: true,
        message: 'Préstamo de equipo registrado exitosamente.',
        data: movement
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar el préstamo del equipo.'
      });
    }
  };

  createReturn = (req: Request, res: Response): void => {
    try {
      const { id_equipo, desinfeccion_realizada, usuario_id, observaciones } = req.body;

      if (!id_equipo) {
        res.status(400).json({
          success: false,
          message: 'Debe especificar el ID de equipo a reingresar.'
        });
        return;
      }

      if (desinfeccion_realizada !== true && desinfeccion_realizada !== 1 && desinfeccion_realizada !== '1' && desinfeccion_realizada !== 'true') {
        res.status(400).json({
          success: false,
          message: 'Protocolo de Bioseguridad: Se debe certificar la desinfección con producto LT8 (5 min).'
        });
        return;
      }

      const movement = this.service.registerReturn({
        id_equipo: Number(id_equipo),
        desinfeccion_realizada: true,
        usuario_id: usuario_id ? Number(usuario_id) : undefined,
        observaciones: observaciones ? String(observaciones) : undefined
      });

      res.status(200).json({
        success: true,
        message: 'Reingreso de equipo y certificación LT8 registrados exitosamente.',
        data: movement
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar el reingreso del equipo.'
      });
    }
  };

  getActive = (_req: Request, res: Response): void => {
    try {
      const movements = this.service.getActiveMovements();
      res.json({
        success: true,
        count: movements.length,
        data: movements
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los préstamos activos.'
      });
    }
  };

  getHistory = (req: Request, res: Response): void => {
    try {
      const { id_equipo, limit } = req.query;
      const history = this.service.getHistory(
        id_equipo ? Number(id_equipo) : undefined,
        limit ? Number(limit) : 50
      );
      res.json({
        success: true,
        count: history.length,
        data: history
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el historial de movimientos.'
      });
    }
  };

  getByEquipment = (req: Request, res: Response): void => {
    try {
      const id = Number(req.params.id);
      const active = this.service.getActiveLoanByEquipment(id);
      res.json({
        success: true,
        data: active
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al consultar el préstamo activo del equipo.'
      });
    }
  };
}
