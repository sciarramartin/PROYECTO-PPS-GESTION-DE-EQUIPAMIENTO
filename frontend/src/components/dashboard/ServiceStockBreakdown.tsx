import React from 'react';
import { Building, Syringe, Wind } from 'lucide-react';
import { ServiceStockBreakdown } from '../../types';

interface ServiceStockBreakdownProps {
  services: ServiceStockBreakdown[];
  onSelectService?: (depositoId: number) => void;
}

export const ServiceStockBreakdownView: React.FC<ServiceStockBreakdownProps> = ({
  services,
  onSelectService
}) => {
  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-cpvs">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-cpvs-blue" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
            Distribución por Servicio Base Propietario
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {services.length} Servicios Clínicos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((svc) => {
          const totalBombas = svc.bombas_totales;
          const totalResp = svc.respiradores_totales;
          const hayEquipos = totalBombas > 0 || totalResp > 0;

          return (
            <div
              key={svc.deposito_id}
              onClick={() => onSelectService?.(svc.deposito_id)}
              className={`p-3.5 rounded border transition-all cursor-pointer ${
                hayEquipos
                  ? 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-cpvs-cyan hover:shadow-sm'
                  : 'border-dashed border-slate-200 bg-white opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-cpvs-blue truncate" title={svc.nombre_servicio}>
                  {svc.nombre_servicio}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  Dep #{svc.deposito_id}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {/* Bombas del servicio */}
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Syringe className="w-3 h-3 text-cpvs-blue" />
                    Bombas Infusión:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{totalBombas}</span>
                    {totalBombas > 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded">
                        {svc.bombas_disponibles} libres
                      </span>
                    )}
                  </div>
                </div>

                {/* Respiradores del servicio */}
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wind className="w-3 h-3 text-cpvs-cyan" />
                    Respiradores:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{totalResp}</span>
                    {totalResp > 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded">
                        {svc.respiradores_disponibles} libres
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Barra de Progreso de Disponibilidad */}
              {hayEquipos && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full" 
                      style={{ 
                        width: `${Math.round(((svc.bombas_disponibles + svc.respiradores_disponibles) / (totalBombas + totalResp)) * 100)}%` 
                      }}
                      title="Disponibles"
                    />
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ 
                        width: `${Math.round(((svc.bombas_en_uso + svc.respiradores_en_uso) / (totalBombas + totalResp)) * 100)}%` 
                      }}
                      title="En Uso"
                    />
                    <div 
                      className="bg-amber-500 h-full" 
                      style={{ 
                        width: `${Math.round(((svc.bombas_taller + svc.respiradores_taller) / (totalBombas + totalResp)) * 100)}%` 
                      }}
                      title="En Mantenimiento"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
