import { DashboardRepository } from '../repositories/dashboardRepository';
import { DashboardSummary } from '../models/types';

export class DashboardService {
  private repo = new DashboardRepository();

  getDashboardSummary(): DashboardSummary {
    return this.repo.getSummary();
  }
}
