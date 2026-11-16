import React, { useState } from 'react';
import { Building2, Bed, Wrench, CheckCircle } from 'lucide-react';
import { Location } from '../../types';

interface LocationListProps {
  locations: Location[];
}

export const LocationList: React.FC<LocationListProps> = ({ locations }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = locations.filter(l => {
    if (filterType === 'ALL') return true;
    return l.tipo_ubicacion === filterType;
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
    <div className="bg-white rounded-lg border border-slate-200 shadow-cpvs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-cpvs-blue uppercase tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cpvs-cyan" />
            <span>Catálogo de Ubicaciones Unificadas (US-04)</span>
            <span className="text-xs normal-case bg-blue-100 text-cpvs-blue px-2 py-0.5 rounded-full font-semibold">
              {filtered.length} destinos
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Integración de Servicios Clínicos de <code className="text-cpvs-blue font-mono font-bold">scriptstock.sql</code> y Camas de <code className="text-cpvs-blue font-mono font-bold">scripthabitaciones.sql</code>
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todas (17)' },
            { id: 'SERVICIO', label: 'Servicios Base (6)' },
            { id: 'HABITACION', label: 'Camas Piso (10)' },
            { id: 'TALLER', label: 'Taller (1)' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                filterType === f.id
                  ? 'bg-cpvs-blue text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(loc => (
          <div
            key={loc.id_ubicacion}
            className="p-3 rounded border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-cpvs-cyan hover:shadow-xs transition-all flex items-start gap-3"
          >
            <div className="p-2 bg-white rounded border border-slate-200 shadow-xs shrink-0">
              {getLocationIcon(loc.tipo_ubicacion)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-xs text-slate-900 truncate">
                  {loc.nombre}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600">
                  ID #{loc.id_ubicacion}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span className="font-medium text-cpvs-blue">{loc.sector_piso || 'Sede Central'}</span>
                <span>•</span>
                <span className="uppercase text-[10px] font-semibold text-slate-400">
                  {loc.tipo_ubicacion}
                </span>
              </div>

              {/* Puntero al Sistema Legado */}
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>
                  {loc.id_deposito_legacy 
                    ? `Legacy Depósito #${loc.id_deposito_legacy}` 
                    : `Cama (${loc.nro_habitacion_legacy}, '${loc.cama_legacy}', Sec ${loc.sector_legacy})`}
                </span>
                <span className="text-emerald-600 flex items-center gap-0.5 font-sans font-medium">
                  <CheckCircle className="w-3 h-3" /> Activa
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
