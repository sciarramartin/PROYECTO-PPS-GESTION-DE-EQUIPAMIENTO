import React, { useState } from 'react';
import { Building, MapPin, ArrowRight, Search } from 'lucide-react';
import { ServiceStockBreakdown } from '../../types';

interface ServiceStockBreakdownProps {
  services: ServiceStockBreakdown[];
  onSelectService?: (depositoId: number) => void;
}

export const ServiceStockBreakdownView: React.FC<ServiceStockBreakdownProps> = ({
  services,
  onSelectService
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredServices = services.filter(s => 
    s.nombre_servicio.toLowerCase().includes(filterText.toLowerCase()) ||
    (s.piso_sector && s.piso_sector.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header del Directorio de Servicios */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-cpvs-blue" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Equipos por Sector / Servicio
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Cantidad y ubicación de equipos asignados a cada área médica.
          </p>
        </div>

        {/* Buscador de Servicio */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar sector (ej. UTI, Quirófano)..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue focus:bg-white transition-all w-48 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60 whitespace-nowrap">
            {services.length} Sectores
          </span>
        </div>
      </div>

      {/* Lista / Tabla de Servicios */}
      <div className="divide-y divide-slate-100">
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No se encontraron sectores clínicos con el término ingresado.
          </div>
        ) : (
          filteredServices.map((svc) => {
            const total = svc.total_equipos > 0 ? svc.total_equipos : (svc.bombas_totales + svc.respiradores_totales);
            const libres = svc.disponibles !== undefined ? svc.disponibles : (svc.bombas_disponibles + svc.respiradores_disponibles);
            const enUso = svc.en_uso !== undefined ? svc.en_uso : (svc.bombas_en_uso + svc.respiradores_en_uso);
            const enTaller = svc.en_mantenimiento !== undefined ? svc.en_mantenimiento : (svc.bombas_taller + svc.respiradores_taller);

            const ratioLibres = total > 0 ? Math.round((libres / total) * 100) : 0;
            const ratioUso = total > 0 ? Math.round((enUso / total) * 100) : 0;
            const ratioTaller = total > 0 ? Math.round((enTaller / total) * 100) : 0;

            const hayEquipos = total > 0;

            return (
              <div
                key={svc.deposito_id}
                onClick={() => hayEquipos && onSelectService?.(svc.deposito_id)}
                className={`p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  hayEquipos 
                    ? 'hover:bg-slate-50/80 cursor-pointer group' 
                    : 'bg-slate-50/40 opacity-60 cursor-default'
                }`}
              >
                {/* Columna 1: Nombre de Servicio y Ubicación Real */}
                <div className="min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-cpvs-blue transition-colors">
                      {svc.nombre_servicio}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                    <span>{svc.piso_sector || 'Sede Central'}</span>
                  </div>
                </div>

                {/* Columna 2: Barra Proporcional de Disponibilidad */}
                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Disponibilidad</span>
                    <span className="font-mono font-bold text-slate-700">
                      {hayEquipos ? `${ratioLibres}% libre` : 'Sin equipos'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    {hayEquipos ? (
                      <>
                        <div className="bg-emerald-500 h-full" style={{ width: `${ratioLibres}%` }} title={`Libres: ${libres}`} />
                        <div className="bg-blue-500 h-full" style={{ width: `${ratioUso}%` }} title={`En Paciente: ${enUso}`} />
                        <div className="bg-amber-500 h-full" style={{ width: `${ratioTaller}%` }} title={`En Taller: ${enTaller}`} />
                      </>
                    ) : (
                      <div className="bg-slate-200 h-full w-full" />
                    )}
                  </div>
                </div>

                {/* Columna 3: Conteo Desglosado */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-left min-w-[70px]">
                    <span className="text-[10px] text-slate-400 block font-sans">Total</span>
                    <span className="text-base font-bold text-slate-900">{total}</span>
                  </div>

                  <div className="text-left min-w-[65px]">
                    <span className="text-[10px] text-emerald-600 block font-sans font-medium">Libres</span>
                    <span className="text-base font-bold text-emerald-700">{libres}</span>
                  </div>

                  <div className="text-left min-w-[65px]">
                    <span className="text-[10px] text-blue-600 block font-sans font-medium">En Sala</span>
                    <span className="text-base font-bold text-blue-700">{enUso}</span>
                  </div>

                  <div className="text-left min-w-[65px]">
                    <span className="text-[10px] text-amber-600 block font-sans font-medium">Taller</span>
                    <span className="text-base font-bold text-amber-700">{enTaller}</span>
                  </div>
                </div>

                {/* Columna 4: Botón de Acción */}
                <div className="flex items-center justify-end">
                  {hayEquipos ? (
                    <button 
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cpvs-blue bg-blue-50/80 hover:bg-cpvs-blue hover:text-white transition-all shadow-2xs"
                    >
                      <span>Ver Equipos</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Sin equipos
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
