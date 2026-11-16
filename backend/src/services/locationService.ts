import { LocationRepository } from '../repositories/locationRepository';
import { Location } from '../models/types';

export class LocationService {
  private repo = new LocationRepository();

  getAllLocations(filters?: { tipo?: string; sucursal_id?: number }): Location[] {
    return this.repo.findAll(filters);
  }

  getLocationById(id: number): Location | null {
    return this.repo.findById(id);
  }

  getServicesAndDeposits(): Location[] {
    return this.repo.findAll().filter(l => l.tipo_ubicacion === 'SERVICIO' || l.tipo_ubicacion === 'DEPOSITO' || l.tipo_ubicacion === 'TALLER');
  }

  getRooms(): Location[] {
    return this.repo.findAll({ tipo: 'HABITACION' });
  }
}
