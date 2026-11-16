import { MovementRepository } from '../repositories/movementRepository';
import { Movement, CreateLoanDTO, CreateReturnDTO } from '../models/types';

export class MovementService {
  private repository = new MovementRepository();

  registerLoan(dto: CreateLoanDTO): Movement {
    if (!dto.id_equipo) {
      throw new Error('El ID de equipo es obligatorio.');
    }
    if (!dto.ubicacion_destino_id) {
      throw new Error('La ubicación de destino es obligatoria.');
    }

    return this.repository.createLoan(dto);
  }

  registerReturn(dto: CreateReturnDTO): Movement {
    if (!dto.id_equipo) {
      throw new Error('El ID de equipo es obligatorio.');
    }
    if (!dto.desinfeccion_realizada) {
      throw new Error('Es obligatorio certificar la desinfección con producto LT8 (Protocolo 5 min).');
    }

    return this.repository.createReturn(dto);
  }

  getActiveMovements(): Movement[] {
    return this.repository.findAllActive();
  }

  getHistory(id_equipo?: number, limit = 50): Movement[] {
    return this.repository.findHistory(id_equipo, limit);
  }

  getActiveLoanByEquipment(id_equipo: number): Movement | null {
    return this.repository.findActiveByEquipmentId(id_equipo);
  }
}
