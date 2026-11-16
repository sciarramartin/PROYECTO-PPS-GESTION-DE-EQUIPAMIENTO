import { db } from '../config/database';
import { Location } from '../models/types';

export class LocationRepository {
  findAll(filters?: { tipo?: string; sucursal_id?: number }): Location[] {
    let sql = `
      SELECT 
        u.id_ubicacion,
        u.id_sucursal,
        s.nombre AS nombre_sucursal,
        u.nombre,
        u.tipo_ubicacion,
        u.sector_piso,
        u.id_deposito_legacy,
        u.nro_habitacion_legacy,
        u.cama_legacy,
        u.sector_legacy,
        u.activo = 1 AS activo
      FROM ubicaciones u
      INNER JOIN sucursales s ON u.id_sucursal = s.id_sucursal
      WHERE u.activo = 1
    `;
    const params: any[] = [];

    if (filters?.tipo) {
      sql += ' AND u.tipo_ubicacion = ?';
      params.push(filters.tipo);
    }

    if (filters?.sucursal_id) {
      sql += ' AND u.id_sucursal = ?';
      params.push(filters.sucursal_id);
    }

    sql += ' ORDER BY u.tipo_ubicacion DESC, u.nombre ASC';

    return db.query<Location>(sql, params);
  }

  findById(id: number): Location | null {
    const sql = `
      SELECT 
        u.id_ubicacion,
        u.id_sucursal,
        s.nombre AS nombre_sucursal,
        u.nombre,
        u.tipo_ubicacion,
        u.sector_piso,
        u.id_deposito_legacy,
        u.nro_habitacion_legacy,
        u.cama_legacy,
        u.sector_legacy,
        u.activo = 1 AS activo
      FROM ubicaciones u
      INNER JOIN sucursales s ON u.id_sucursal = s.id_sucursal
      WHERE u.id_ubicacion = ?
    `;
    return db.queryOne<Location>(sql, [id]);
  }
}
