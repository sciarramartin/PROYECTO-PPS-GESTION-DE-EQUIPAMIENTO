import { EquipmentRepository } from '../repositories/equipmentRepository';
import { Equipment } from '../models/types';

export class EquipmentService {
  private repo = new EquipmentRepository();

  getAllEquipment(filters?: { estado?: string; categoria?: string; deposito_id?: number }): Equipment[] {
    return this.repo.findAll(filters);
  }

  getEquipmentById(id: number): Equipment | null {
    return this.repo.findById(id);
  }

  searchEquipment(query: string): Equipment[] {
    if (!query || query.trim() === '') {
      return this.repo.findAll();
    }
    return this.repo.findByQuery(query.trim());
  }
}
