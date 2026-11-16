import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  private service = new DashboardService();

  getSummary = (_req: Request, res: Response): void => {
    try {
      const summary = this.service.getDashboardSummary();
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
