import { db } from '../config/database';
import { Equipment } from '../models/types';

export class EquipmentRepository {
  private baseSelect = `
    SELECT 
      e.id_equipo,
      e.articulo_id,
      a.nombre AS nombre_articulo,
      CASE 
        WHEN e.articulo_id IN (1001, 1002) THEN 'BOMBA_INFUSION'
        WHEN e.articulo_id IN (2001, 2002) THEN 'RESPIRADOR'
        ELSE 'OTRO'
      END AS categoria,
      e.numero_serie,
      e.numero_sticker,
      e.codigo_qr,
      e.estado_operativo,
      e.deposito_propietario_id,
      d.nombre AS nombre_servicio_propietario,
      e.ubicacion_actual_id,
      u.nombre AS nombre_ubicacion_actual,
      u.tipo_ubicacion AS tipo_ubicacion_actual,
      u.sector_piso,
      e.habilitado_ministerio = 1 AS habilitado_ministerio,
      e.es_propio = 1 AS es_propio,
      e.propietario_tercero,
      e.cuit_tercero,
      e.creado_el,
      e.actualizado_el
    FROM equipos_biomedicos e
    INNER JOIN articulos a ON e.articulo_id = a.articulo
    INNER JOIN depositos d ON e.deposito_propietario_id = d.id_depositos
    INNER JOIN ubicaciones u ON e.ubicacion_actual_id = u.id_ubicacion
  `;

  findAll(filters?: { estado?: string; categoria?: string; deposito_id?: number }): Equipment[] {
    let sql = this.baseSelect;
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.estado) {
      conditions.push('e.estado_operativo = ?');
      params.push(filters.estado);
    }

    if (filters?.categoria === 'BOMBA_INFUSION') {
      conditions.push('e.articulo_id IN (1001, 1002)');
    } else if (filters?.categoria === 'RESPIRADOR') {
      conditions.push('e.articulo_id IN (2001, 2002)');
    }

    if (filters?.deposito_id) {
      conditions.push('e.deposito_propietario_id = ?');
      params.push(filters.deposito_id);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY CAST(e.numero_sticker AS INTEGER) ASC, e.id_equipo ASC';

    return db.query<Equipment>(sql, params);
  }

  findById(id: number): Equipment | null {
    const sql = `${this.baseSelect} WHERE e.id_equipo = ?`;
    return db.queryOne<Equipment>(sql, [id]);
  }

  findByQuery(term: string): Equipment[] {
    const cleanTerm = term.trim();
    const sql = `
      ${this.baseSelect}
      WHERE e.numero_sticker = ?
         OR e.numero_serie LIKE ?
         OR e.codigo_qr = ?
      ORDER BY e.numero_sticker ASC
    `;
    return db.query<Equipment>(sql, [cleanTerm, `%${cleanTerm}%`, cleanTerm]);
  }
}
