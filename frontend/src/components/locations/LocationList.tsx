import React, { useState } from 'react';
import { Building2, Bed, Wrench, CheckCircle, Search, ArrowRight, Zap } from 'lucide-react';
import { Location } from '../../types';

interface LocationListProps {
  locations: Location[];
  onSelectLocation?: (loc: Location) => void;
  onAssignToLocation?: (loc: Location) => void;
}

export const LocationList: React.FC<LocationListProps> = ({ 
  locations,
  onSelectLocation,
  onAssignToLocation
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const countServicios = locations.filter(l => l.tipo_ubicacion === 'SERVICIO' || l.tipo_ubicacion === 'DEPOSITO').length;
  const countCamas = locations.filter(l => l.tipo_ubicacion === 'HABITACION').length;
  const countTaller = locations.filter(l => l.tipo_ubicacion === 'TALLER').length;

  const filtered = locations.filter(l => {
    const matchType = filterType === 'ALL' || l.tipo_ubicacion === filterType || (filterType === 'SERVICIO' && l.tipo_ubicacion === 'DEPOSITO');
    if (!matchType) return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase().trim();
      return l.nombre.toLowerCase().includes(q) || (l.sector_piso && l.sector_piso.toLowerCase().includes(q));
    }

    return true;
  });

  const getLocationIcon = (tipo: string) => {
    switch (tipo) {
      case 'HABITACION':
        return <Bed className="w-4 h-4 text-cpvs-cyan" />;
      case 'TALLER':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'SERVICIO':
      case 'DEPOSITO':
      default:
        return <Building2 className="w-4 h-4 text-cpvs-blue" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
      {/* Banner Orientativo de Funcionalidad Clínica */}
      <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-teal-50/60 p-3.5 sm:p-4 rounded-xl border border-blue-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-white rounded-lg border border-blue-200/80 shadow-2xs text-cpvs-blue shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800">¿Para qué sirve este Catálogo de Sectores y Camas?</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Es el mapa físico de internación y servicios de la clínica. Hacé clic en <strong className="text-cpvs-blue">"Ver Equipos"</strong> para ver qué máquinas están operando en esa sala, o en <strong className="text-emerald-700">"+ Asignar equipo aquí"</strong> para enviar una máquina disponible directamente a esa cama.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cpvs-blue" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Catálogo Unificado de Destinos y Camas
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {filtered.length} de {locations.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidación no invasiva de servicios clínicos y camas de internación general por piso.
          </p>
        </div>

        {/* Filtros de Tipo y Buscador */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar destino..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue focus:bg-white transition-all sm:w-48"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 overflow-x-auto max-w-full">
            {[
              { id: 'ALL', label: `Todas (${locations.length})` },
              { id: 'SERVICIO', label: `Servicios (${countServicios})` },
              { id: 'HABITACION', label: `Camas (${countCamas})` },
              { id: 'TALLER', label: `Taller (${countTaller})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-white text-cpvs-blue shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(loc => (
          <div
            key={loc.id_ubicacion}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-cpvs-blue/40 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200/60 shadow-2xs shrink-0">
                {getLocationIcon(loc.tipo_ubicacion)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {loc.nombre}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600 shrink-0">
                    #{loc.id_ubicacion}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="font-semibold text-cpvs-blue">{loc.sector_piso || 'Sede Central'}</span>
                  <span>•</span>
                  <span className="uppercase text-[10px] font-medium text-slate-400">
                    {loc.tipo_ubicacion}
                  </span>
                </div>

                {/* Trazabilidad con el Sistema Legado */}
                <div className="mt-2 pt-1.5 border-t border-slate-200/50 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="truncate">
                    {loc.id_deposito_legacy 
                      ? `Depósito Legado #${loc.id_deposito_legacy}` 
                      : `Hab. ${loc.nro_habitacion_legacy} - Cama ${loc.cama_legacy}`}
                  </span>
                  <span className="text-emerald-600 flex items-center gap-0.5 font-sans font-semibold shrink-0">
                    <CheckCircle className="w-3 h-3" /> Activo
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones Interactivas Directas: Ver Equipos y Asignar */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSelectLocation?.(loc)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-cpvs-blue bg-blue-50/80 hover:bg-cpvs-blue hover:text-white transition-all cursor-pointer shadow-2xs"
                title={`Ver equipos actualmente en ${loc.nombre}`}
              >
                <span>Ver Equipos</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              {loc.tipo_ubicacion !== 'TALLER' && (
                <button
                  type="button"
                  onClick={() => onAssignToLocation?.(loc)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 transition-all cursor-pointer shadow-2xs"
                  title={`Asignar un equipo a ${loc.nombre}`}
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>+ Asignar equipo aquí</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
