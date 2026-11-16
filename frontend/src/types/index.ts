export type EstadoOperativo = 'DISPONIBLE' | 'EN_USO' | 'EN_MANTENIMIENTO' | 'DE_BAJA';
export type TipoUbicacion = 'HABITACION' | 'DEPOSITO' | 'SERVICIO' | 'TALLER';

export interface Equipment {
  id_equipo: number;
  articulo_id: number;
  nombre_articulo: string;
  categoria: 'BOMBA_INFUSION' | 'RESPIRADOR' | 'OTRO';
  numero_serie: string;
  numero_sticker: string | null;
  codigo_qr: string;
  estado_operativo: EstadoOperativo;
  deposito_propietario_id: number;
  nombre_servicio_propietario: string;
  ubicacion_actual_id: number;
  nombre_ubicacion_actual: string;
  tipo_ubicacion_actual: TipoUbicacion;
  sector_piso: string | null;
  habilitado_ministerio: boolean;
  es_propio: boolean;
  propietario_tercero?: string | null;
  cuit_tercero?: string | null;
  creado_el: string;
  actualizado_el: string;
}

export interface Location {
  id_ubicacion: number;
  id_sucursal: number;
  nombre_sucursal?: string;
  nombre: string;
  tipo_ubicacion: TipoUbicacion;
  sector_piso: string | null;
  id_deposito_legacy?: number | null;
  nro_habitacion_legacy?: number | null;
  cama_legacy?: string | null;
  sector_legacy?: number | null;
  activo: boolean;
}

export interface CategorySummary {
  categoria: string;
  nombre_display: string;
  total: number;
  disponibles: number;
  en_uso: number;
  en_mantenimiento: number;
}

export interface ServiceStockBreakdown {
  deposito_id: number;
  nombre_servicio: string;
  piso_sector?: string;
  total_equipos: number;
  disponibles: number;
  en_uso: number;
  en_mantenimiento: number;
  bombas_totales: number;
  bombas_disponibles: number;
  bombas_en_uso: number;
  bombas_taller: number;
  respiradores_totales: number;
  respiradores_disponibles: number;
  respiradores_en_uso: number;
  respiradores_taller: number;
}

export interface DashboardSummary {
  categorias?: CategorySummary[];
  bombas: {
    total: number;
    disponibles: number;
    en_uso: number;
    en_mantenimiento: number;
  };
  respiradores: {
    total: number;
    disponibles: number;
    en_uso: number;
    en_mantenimiento: number;
  };
  totales_globales: {
    total_equipos: number;
    disponibles: number;
    en_uso: number;
    en_mantenimiento: number;
  };
  desglose_por_servicio: ServiceStockBreakdown[];
}
