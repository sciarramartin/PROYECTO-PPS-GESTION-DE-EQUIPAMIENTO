import { db } from '../config/database';
import { DashboardSummary, ServiceStockBreakdown, CategorySummary } from '../models/types';

export class DashboardRepository {
  getSummary(): DashboardSummary {
    // 1. Resumen Dinámico de Categorías (Extensible a cualquier familia de equipos)
    const catSql = `
      SELECT 
        CASE 
          WHEN a.nombre LIKE '%Bomba%' THEN 'BOMBA_INFUSION'
          WHEN a.nombre LIKE '%Respirador%' THEN 'RESPIRADOR'
          WHEN a.nombre LIKE '%Monitor%' THEN 'MONITOR'
          WHEN a.nombre LIKE '%Desfibrilador%' THEN 'DESFIBRILADOR'
          ELSE 'OTRO'
        END AS categoria,
        CASE 
          WHEN a.nombre LIKE '%Bomba%' THEN 'Bombas de Infusión'
          WHEN a.nombre LIKE '%Respirador%' THEN 'Respiradores Volumétricos'
          WHEN a.nombre LIKE '%Monitor%' THEN 'Monitores Multiparamétricos'
          WHEN a.nombre LIKE '%Desfibrilador%' THEN 'Desfibriladores'
          ELSE a.nombre
        END AS nombre_display,
        COUNT(*) AS total,
        SUM(CASE WHEN e.estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS disponibles,
        SUM(CASE WHEN e.estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS en_uso,
        SUM(CASE WHEN e.estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS en_mantenimiento
      FROM equipos_biomedicos e
      INNER JOIN articulos a ON e.articulo_id = a.articulo
      GROUP BY categoria, nombre_display
      ORDER BY total DESC
    `;
    const catRows = db.query<any>(catSql);
    const categorias: CategorySummary[] = catRows.map(c => ({
      categoria: c.categoria,
      nombre_display: c.nombre_display.trim(),
      total: Number(c.total || 0),
      disponibles: Number(c.disponibles || 0),
      en_uso: Number(c.en_uso || 0),
      en_mantenimiento: Number(c.en_mantenimiento || 0),
    }));

    // 2. Resumen clásico de Bombas (para compatibilidad)
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

    // 3. Resumen clásico de Respiradores
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

    // 4. Totales Globales del Hospital
    const totSql = `
      SELECT 
        COUNT(*) AS total_equipos,
        SUM(CASE WHEN estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS disponibles,
        SUM(CASE WHEN estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS en_uso,
        SUM(CASE WHEN estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS en_mantenimiento
      FROM equipos_biomedicos
    `;
    const totRaw = db.queryOne<{ total_equipos: number; disponibles: number; en_uso: number; en_mantenimiento: number }>(totSql);

    // 5. Desglose enriquecido por Servicio Clínico
    const serviciosSql = `
      SELECT 
        d.id_depositos AS deposito_id,
        d.nombre AS nombre_servicio,
        COUNT(e.id_equipo) AS total_equipos,
        SUM(CASE WHEN e.estado_operativo = 'DISPONIBLE' THEN 1 ELSE 0 END) AS disponibles,
        SUM(CASE WHEN e.estado_operativo = 'EN_USO' THEN 1 ELSE 0 END) AS en_uso,
        SUM(CASE WHEN e.estado_operativo = 'EN_MANTENIMIENTO' THEN 1 ELSE 0 END) AS en_mantenimiento,
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
      ORDER BY total_equipos DESC, d.id_depositos ASC
    `;
    const desglose = db.query<any>(serviciosSql);

    const getPisoSector = (nombre: string): string => {
      const n = nombre.toLowerCase();
      if (n.includes('uti adultos') || n.includes('terapia intensiva')) return 'Piso 1 - Área Crítica';
      if (n.includes('pediátrica') || n.includes('utip')) return 'Piso 2 - Pediatría';
      if (n.includes('neo') || n.includes('utin')) return 'Piso 2 - Neonatología';
      if (n.includes('quirófano') || n.includes('quirofano')) return 'Piso 1 - Centro Quirúrgico';
      if (n.includes('guardia') || n.includes('shockroom')) return 'Planta Baja - Urgencias';
      if (n.includes('taller') || n.includes('mantenimiento')) return 'Subsuelo - Bioingeniería';
      if (n.includes('oncolog') || n.includes('quimio')) return 'Piso 3 - Tratamientos Especiales';
      return 'Sede Central';
    };

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
      categorias,
      bombas,
      respiradores,
      totales_globales: {
        total_equipos: Number(totRaw?.total_equipos || (bombas.total + respiradores.total)),
        disponibles: Number(totRaw?.disponibles || (bombas.disponibles + respiradores.disponibles)),
        en_uso: Number(totRaw?.en_uso || (bombas.en_uso + respiradores.en_uso)),
        en_mantenimiento: Number(totRaw?.en_mantenimiento || (bombas.en_mantenimiento + respiradores.en_mantenimiento)),
      },
      desglose_por_servicio: desglose.map((d: any) => ({
        deposito_id: Number(d.deposito_id),
        nombre_servicio: d.nombre_servicio.trim(),
        piso_sector: getPisoSector(d.nombre_servicio),
        total_equipos: Number(d.total_equipos || 0),
        disponibles: Number(d.disponibles || 0),
        en_uso: Number(d.en_uso || 0),
        en_mantenimiento: Number(d.en_mantenimiento || 0),
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
