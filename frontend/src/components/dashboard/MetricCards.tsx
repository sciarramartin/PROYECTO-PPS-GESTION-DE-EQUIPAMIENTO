import React from 'react';
import { Syringe, Wind, CheckCircle2, BedDouble, Wrench } from 'lucide-react';
import { DashboardSummary } from '../../types';

interface MetricCardsProps {
  summary: DashboardSummary | null;
  onFilterCategory?: (cat: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary, onFilterCategory }) => {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  const { bombas, respiradores, totales_globales } = summary;

  return (
    <div className="space-y-4">
      {/* Tarjetas Principales de Bombas y Respiradores (US-01) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta Bombas de Infusión (Cuello de Botella Crítico: 42 Unidades) */}
        <div 
          onClick={() => onFilterCategory?.('BOMBA_INFUSION')}
          className="bg-white rounded-lg p-5 border-l-4 border-l-cpvs-blue shadow-cpvs hover:shadow-cpvs-lg transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-50 text-cpvs-blue">
                <Syringe className="w-3.5 h-3.5 text-cpvs-blue" />
                Bombas de Infusión Continua
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {bombas.total}
                </span>
                <span className="text-xs text-slate-500 font-medium">unidades auditadas</span>
              </div>
            </div>
            <div className="p-2.5 bg-blue-50 text-cpvs-blue rounded-lg">
              <Syringe className="w-6 h-6" />
            </div>
          </div>

          {/* Métricas de Estado */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50/70 p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-emerald-700 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Libres</span>
              </div>
              <p className="text-lg font-bold text-emerald-800">{bombas.disponibles}</p>
            </div>
            <div className="bg-blue-50/70 p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-blue-700 text-[11px] font-semibold">
                <BedDouble className="w-3 h-3" />
                <span>En Paciente</span>
              </div>
              <p className="text-lg font-bold text-blue-800">{bombas.en_uso}</p>
            </div>
            <div className="bg-amber-50/70 p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-amber-700 text-[11px] font-semibold">
                <Wrench className="w-3 h-3" />
                <span>En Taller</span>
              </div>
              <p className="text-lg font-bold text-amber-800">{bombas.en_mantenimiento}</p>
            </div>
          </div>
        </div>

        {/* Tarjeta Respiradores Volumétricos (Soporte Vital: 22 Unidades) */}
        <div 
          onClick={() => onFilterCategory?.('RESPIRADOR')}
          className="bg-white rounded-lg p-5 border-l-4 border-l-cpvs-cyan shadow-cpvs hover:shadow-cpvs-lg transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cpvs-cyan">
                <Wind className="w-3.5 h-3.5 text-cpvs-cyan" />
                Respiradores Volumétricos
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {respiradores.total}
                </span>
                <span className="text-xs text-slate-500 font-medium">unidades auditadas</span>
              </div>
            </div>
            <div className="p-2.5 bg-cyan-50 text-cpvs-cyan rounded-lg">
              <Wind className="w-6 h-6" />
            </div>
          </div>

          {/* Métricas de Estado */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50/70 p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-emerald-700 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Libres</span>
              </div>
              <p className="text-lg font-bold text-emerald-800">{respiradores.disponibles}</p>
            </div>
            <div className="bg-blue-50/70 p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-blue-700 text-[11px] font-semibold">
                <BedDouble className="w-3 h-3" />
                <span>En Paciente</span>
              </div>
              <p className="text-lg font-bold text-blue-800">{respiradores.en_uso}</p>
            </div>
            <div className="bg-amber-50/70 p-2 rounded">
              <div className="flex items-center justify-center gap-1 text-amber-700 text-[11px] font-semibold">
                <Wrench className="w-3 h-3" />
                <span>En Taller</span>
              </div>
              <p className="text-lg font-bold text-amber-800">{respiradores.en_mantenimiento}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Franja de Métricas Operativas Globales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-slate-200 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-slate-500 block">Total Parque Biomédico</span>
            <span className="text-xl font-bold text-slate-800">{totales_globales.total_equipos}</span>
          </div>
          <span className="text-slate-400 font-semibold text-[11px]">100%</span>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-emerald-700 block">Disponibilidad Inmediata</span>
            <span className="text-xl font-bold text-emerald-700">{totales_globales.disponibles}</span>
          </div>
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
            {Math.round((totales_globales.disponibles / totales_globales.total_equipos) * 100)}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-blue-700 block">En Tratamiento Activo</span>
            <span className="text-xl font-bold text-blue-700">{totales_globales.en_uso}</span>
          </div>
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
            {Math.round((totales_globales.en_uso / totales_globales.total_equipos) * 100)}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-amber-700 block">En Taller Técnico</span>
            <span className="text-xl font-bold text-amber-700">{totales_globales.en_mantenimiento}</span>
          </div>
          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
            {Math.round((totales_globales.en_mantenimiento / totales_globales.total_equipos) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
