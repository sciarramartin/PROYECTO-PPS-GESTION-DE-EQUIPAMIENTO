import { db } from '../config/database';
import { DashboardSummary, ServiceStockBreakdown } from '../models/types';

export class DashboardRepository {
  getSummary(): DashboardSummary {
    // 1. Resumen de Bombas
    const bombasSql = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS disponibles,
        SUM(CASE WHEN estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS en_uso,
        SUM(CASE WHEN estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS en_mantenimiento
      FROM equipos_biomedicos
      WHERE articulo_id IN (1001, 1002)
    `;
    const bombasRaw = db.queryOne<{ total: number; disponibles: number; en_uso: number; en_mantenimiento: number }>(bombasSql);

    // 2. Resumen de Respiradores
    const respSql = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS disponibles,
        SUM(CASE WHEN estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS en_uso,
        SUM(CASE WHEN estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS en_mantenimiento
      FROM equipos_biomedicos
      WHERE articulo_id IN (2001, 2002)
    `;
    const respRaw = db.queryOne<{ total: number; disponibles: number; en_uso: number; en_mantenimiento: number }>(respSql);

    // 3. Desglose por Servicio
    const serviciosSql = `
      SELECT 
        d.id_depositos AS deposito_id,
        d.nombre AS nombre_servicio,
        SUM(CASE WHEN e.articulo_id IN (1001, 1002) THEN 1 ELSE 0 END) AS bombas_totales,
        SUM(CASE WHEN e.articulo_id IN (1001, 1002) AND e.estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS bombas_disponibles,
        SUM(CASE WHEN e.articulo_id IN (1001, 1002) AND e.estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS bombas_en_uso,
        SUM(CASE WHEN e.articulo_id IN (1001, 1002) AND e.estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS bombas_taller,
        SUM(CASE WHEN e.articulo_id IN (2001, 2002) THEN 1 ELSE 0 END) AS respiradores_totales,
        SUM(CASE WHEN e.articulo_id IN (2001, 2002) AND e.estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS respiradores_disponibles,
        SUM(CASE WHEN e.articulo_id IN (2001, 2002) AND e.estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS respiradores_en_uso,
        SUM(CASE WHEN e.articulo_id IN (2001, 2002) AND e.estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS respiradores_taller
      FROM depositos d
      LEFT JOIN equipos_biomedicos e ON e.deposito_propietario_id = d.id_depositos
      GROUP BY d.id_depositos, d.nombre
      ORDER BY d.id_depositos ASC
    `;
    const desglose = db.query<ServiceStockBreakdown>(serviciosSql);

    const bombas = {
      total: Number(bombasRaw?.total || 0),
      disponibles: Number(bombasRaw?.disponibles || 0),
      en_uso: Number(bombasRaw?.en_uso || 0),
      en_mantenimiento: Number(bombasRaw?.en_mantenimiento || 0),
    };

    const respiradores = {
      total: Number(respRaw?.total || 0),
      disponibles: Number(respRaw?.disponibles || 0),
      en_uso: Number(respRaw?.en_uso || 0),
      en_mantenimiento: Number(respRaw?.en_mantenimiento || 0),
    };

    return {
      bombas,
      respiradores,
      totales_globales: {
        total_equipos: bombas.total + respiradores.total,
        disponibles: bombas.disponibles + respiradores.disponibles,
        en_uso: bombas.en_uso + respiradores.en_uso,
        en_mantenimiento: bombas.en_mantenimiento + respiradores.en_mantenimiento,
      },
      desglose_por_servicio: desglose.map(d => ({
        deposito_id: Number(d.deposito_id),
        nombre_servicio: d.nombre_servicio.trim(),
        bombas_totales: Number(d.bombas_totales || 0),
        bombas_disponibles: Number(d.bombas_disponibles || 0),
        bombas_en_uso: Number(d.bombas_en_uso || 0),
        bombas_taller: Number(d.bombas_taller || 0),
        respiradores_totales: Number(d.respiradores_totales || 0),
        respiradores_disponibles: Number(d.respiradores_disponibles || 0),
        respiradores_en_uso: Number(d.respiradores_en_uso || 0),
        respiradores_taller: Number(d.respiradores_taller || 0),
      }))
    };
  }
}
