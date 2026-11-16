import { db } from '../config/database';
import { Movement, CreateLoanDTO, CreateReturnDTO } from '../models/types';

export class MovementRepository {
  private baseSelect = `
    SELECT 
      m.id_movimiento,
      m.id_equipo,
      e.numero_serie,
      e.numero_sticker,
      a.nombre AS nombre_articulo,
      CASE 
        WHEN a.articulo IN (1001, 1002) THEN 'BOMBA_INFUSION'
        WHEN a.articulo IN (2001, 2002) THEN 'RESPIRADOR'
        ELSE 'OTRO'
      END AS categoria,
      m.ubicacion_origen_id,
      uo.nombre AS nombre_ubicacion_origen,
      m.ubicacion_destino_id,
      ud.nombre AS nombre_ubicacion_destino,
      ud.sector_piso AS sector_piso_destino,
      m.fecha_salida,
      m.fecha_retorno_estimada,
      m.fecha_retorno_real,
      m.desinfeccion_realizada = 1 AS desinfeccion_realizada,
      m.usuario_envia_id,
      ue.nombre AS nombre_usuario_envia,
      m.usuario_recibe_id,
      ur.nombre AS nombre_usuario_recibe,
      m.estado_movimiento,
      m.observaciones
    FROM movimientos_equipos m
    INNER JOIN equipos_biomedicos e ON m.id_equipo = e.id_equipo
    INNER JOIN articulos a ON e.articulo_id = a.articulo
    INNER JOIN ubicaciones uo ON m.ubicacion_origen_id = uo.id_ubicacion
    INNER JOIN ubicaciones ud ON m.ubicacion_destino_id = ud.id_ubicacion
    LEFT JOIN usuarios ue ON m.usuario_envia_id = ue.id_usuarios
    LEFT JOIN usuarios ur ON m.usuario_recibe_id = ur.id_usuarios
  `;

  findActiveByEquipmentId(id_equipo: number): Movement | null {
    const sql = `
      ${this.baseSelect}
      WHERE m.id_equipo = ? AND m.estado_movimiento = 'EN_CURSO'
      ORDER BY m.fecha_salida DESC
      LIMIT 1
    `;
    return db.queryOne<Movement>(sql, [id_equipo]);
  }

  findAllActive(): Movement[] {
    const sql = `
      ${this.baseSelect}
      WHERE m.estado_movimiento = 'EN_CURSO'
      ORDER BY m.fecha_salida DESC
    `;
    return db.query<Movement>(sql);
  }

  findHistory(id_equipo?: number, limit = 50): Movement[] {
    let sql = this.baseSelect;
    const params: any[] = [];

    if (id_equipo) {
      sql += ' WHERE m.id_equipo = ?';
      params.push(id_equipo);
    }

    sql += ' ORDER BY m.fecha_salida DESC LIMIT ?';
    params.push(limit);

    return db.query<Movement>(sql, params);
  }

  createLoan(dto: CreateLoanDTO): Movement {
    // 1. Obtener datos actuales del equipo
    const eq = db.queryOne<{
      id_equipo: number;
      estado_operativo: string;
      deposito_propietario_id: number;
      ubicacion_actual_id: number;
    }>('SELECT id_equipo, estado_operativo, deposito_propietario_id, ubicacion_actual_id FROM equipos_biomedicos WHERE id_equipo = ?', [dto.id_equipo]);

    if (!eq) {
      throw new Error(`Equipo con ID ${dto.id_equipo} no encontrado.`);
    }

    if (eq.estado_operativo === 'EN_USO') {
      throw new Error(`El equipo ya se encuentra registrado EN_USO.`);
    }

    if (eq.estado_operativo === 'EN_MANTENIMIENTO') {
      throw new Error(`El equipo está EN_MANTENIMIENTO y no puede ser prestado.`);
    }

    if (eq.estado_operativo === 'DE_BAJA') {
      throw new Error(`El equipo está dado de baja.`);
    }

    const origenId = eq.ubicacion_actual_id;
    const usuarioEnviaId = dto.usuario_id || 2; // Por defecto: Supervisor de Guardia
    const horasEstimadas = dto.horas_retorno_estimado || 48;

    // 2. Insertar movimiento
    const insertSql = `
      INSERT INTO movimientos_equipos (
        id_equipo,
        ubicacion_origen_id,
        ubicacion_destino_id,
        fecha_salida,
        fecha_retorno_estimada,
        desinfeccion_realizada,
        usuario_envia_id,
        estado_movimiento,
        observaciones
      ) VALUES (
        ?,
        ?,
        ?,
        datetime('now'),
        datetime('now', '+' || ? || ' hours'),
        0,
        ?,
        'EN_CURSO',
        ?
      )
    `;

    const res = db.execute(insertSql, [
      dto.id_equipo,
      origenId,
      dto.ubicacion_destino_id,
      horasEstimadas,
      usuarioEnviaId,
      dto.observaciones || 'Préstamo operativo rápido'
    ]);

    // 3. Actualizar estado y ubicación actual del equipo
    db.execute(`
      UPDATE equipos_biomedicos
      SET estado_operativo = 'EN_USO',
          ubicacion_actual_id = ?,
          actualizado_el = datetime('now')
      WHERE id_equipo = ?
    `, [dto.ubicacion_destino_id, dto.id_equipo]);

    // 4. Retornar el movimiento creado
    const movimientoCreado = db.queryOne<Movement>(`${this.baseSelect} WHERE m.id_movimiento = ?`, [res.lastInsertRowid]);
    if (!movimientoCreado) {
      throw new Error('Error al recuperar el movimiento recién registrado.');
    }
    return movimientoCreado;
  }

  createReturn(dto: CreateReturnDTO): Movement {
    if (!dto.desinfeccion_realizada) {
      throw new Error('Bioseguridad obligatoria: Se requiere certificar la desinfección con producto LT8 (Protocolo 5 min).');
    }

    // 1. Obtener datos actuales del equipo
    const eq = db.queryOne<{
      id_equipo: number;
      estado_operativo: string;
      deposito_propietario_id: number;
      ubicacion_actual_id: number;
    }>('SELECT id_equipo, estado_operativo, deposito_propietario_id, ubicacion_actual_id FROM equipos_biomedicos WHERE id_equipo = ?', [dto.id_equipo]);

    if (!eq) {
      throw new Error(`Equipo con ID ${dto.id_equipo} no encontrado.`);
    }

    // 2. Buscar movimiento activo
    const activo = this.findActiveByEquipmentId(dto.id_equipo);
    const usuarioRecibeId = dto.usuario_id || 1; // Por defecto: Alejandra o Supervisor receptor

    if (activo) {
      // Cerrar movimiento existente
      db.execute(`
        UPDATE movimientos_equipos
        SET fecha_retorno_real = datetime('now'),
            desinfeccion_realizada = 1,
            usuario_recibe_id = ?,
            estado_movimiento = 'DEVUELTO',
            observaciones = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN COALESCE(observaciones || ' | ', '') || ?
              ELSE observaciones 
            END
        WHERE id_movimiento = ?
      `, [
        usuarioRecibeId,
        dto.observaciones || null,
        dto.observaciones || null,
        `Retorno con LT8: ${dto.observaciones || 'Conforme'}`,
        activo.id_movimiento
      ]);
    } else {
      // Si por alguna razón no había movimiento registrado (ej. legacy), creamos el registro de retorno/cierre
      db.execute(`
        INSERT INTO movimientos_equipos (
          id_equipo,
          ubicacion_origen_id,
          ubicacion_destino_id,
          fecha_salida,
          fecha_retorno_real,
          desinfeccion_realizada,
          usuario_envia_id,
          usuario_recibe_id,
          estado_movimiento,
          observaciones
        ) VALUES (
          ?,
          ?,
          ?,
          datetime('now', '-1 hour'),
          datetime('now'),
          1,
          2,
          ?,
          'DEVUELTO',
          ?
        )
      `, [
        dto.id_equipo,
        eq.ubicacion_actual_id,
        eq.deposito_propietario_id,
        usuarioRecibeId,
        `Reingreso directo con desinfección LT8. ${dto.observaciones || ''}`
      ]);
    }

    // 3. Restaurar equipo a DISPONIBLE en su depósito/servicio propietario patrimonial
    db.execute(`
      UPDATE equipos_biomedicos
      SET estado_operativo = 'DISPONIBLE',
          ubicacion_actual_id = deposito_propietario_id,
          actualizado_el = datetime('now')
      WHERE id_equipo = ?
    `, [dto.id_equipo]);

    // 4. Retornar movimiento cerrado
    const movId = activo ? activo.id_movimiento : db.queryOne<{ id: number }>('SELECT last_insert_rowid() AS id')?.id;
    const movimientoActualizado = db.queryOne<Movement>(`${this.baseSelect} WHERE m.id_movimiento = ?`, [movId]);
    return movimientoActualizado!;
  }
}
