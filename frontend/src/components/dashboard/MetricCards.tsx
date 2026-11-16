import React from 'react';
import { Syringe, Wind, Activity, CheckCircle2, BedDouble, Wrench, ChevronRight, Layers } from 'lucide-react';
import { DashboardSummary, CategorySummary } from '../../types';

interface MetricCardsProps {
  summary: DashboardSummary | null;
  onFilterCategory?: (cat: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary, onFilterCategory }) => {
  if (!summary) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-36 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-44 bg-slate-200 rounded-xl"></div>
          <div className="h-44 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const { totales_globales } = summary;
  const pctLibres = totales_globales.total_equipos > 0 
    ? Math.round((totales_globales.disponibles / totales_globales.total_equipos) * 100) 
    : 0;
  const pctUso = totales_globales.total_equipos > 0 
    ? Math.round((totales_globales.en_uso / totales_globales.total_equipos) * 100) 
    : 0;
  const pctTaller = totales_globales.total_equipos > 0 
    ? Math.round((totales_globales.en_mantenimiento / totales_globales.total_equipos) * 100) 
    : 0;

  // Lista dinámica de categorías desde el backend o fallback estructurado
  const categorias: CategorySummary[] = summary.categorias && summary.categorias.length > 0 
    ? summary.categorias 
    : [
        {
          categoria: 'BOMBA_INFUSION',
          nombre_display: 'Bombas de Infusión',
          total: summary.bombas.total,
          disponibles: summary.bombas.disponibles,
          en_uso: summary.bombas.en_uso,
          en_mantenimiento: summary.bombas.en_mantenimiento
        },
        {
          categoria: 'RESPIRADOR',
          nombre_display: 'Respiradores Volumétricos',
          total: summary.respiradores.total,
          disponibles: summary.respiradores.disponibles,
          en_uso: summary.respiradores.en_uso,
          en_mantenimiento: summary.respiradores.en_mantenimiento
        }
      ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'BOMBA_INFUSION':
        return <Syringe className="w-5 h-5 text-cpvs-blue" />;
      case 'RESPIRADOR':
        return <Wind className="w-5 h-5 text-cpvs-cyan" />;
      default:
        return <Activity className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. HERO DISPONIBILIDAD GLOBAL (Estilo Enterprise / SaaS) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Anillo de Progreso + Títulos */}
          <div className="flex items-center gap-5">
            {/* SVG Ring Progress */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${pctLibres}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tight font-mono">
                  {pctLibres}%
                </span>
                <span className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">
                  Libres
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Disponibilidad de Parque Biomédico
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-md">
                Estado operativo consolidado en tiempo real. Discriminación entre equipos listos para intubación/infusión, en sala y bajo servicio técnico.
              </p>
            </div>
          </div>

          {/* Cuatro Métricas Globales Integradas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3">
              <span className="text-[11px] font-medium text-slate-500 block">Total Parque</span>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {totales_globales.total_equipos}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">unidades auditadas</span>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-semibold text-emerald-800">Libres</span>
              </div>
              <span className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                {totales_globales.disponibles}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Listos para asignar</span>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-[11px] font-semibold text-blue-800">En Paciente</span>
              </div>
              <span className="text-2xl font-black text-blue-700 font-mono tracking-tight">
                {totales_globales.en_uso}
              </span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Uso activo en sala</span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="text-[11px] font-semibold text-amber-800">En Taller</span>
              </div>
              <span className="text-2xl font-black text-amber-700 font-mono tracking-tight">
                {totales_globales.en_mantenimiento}
              </span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Mantenimiento</span>
            </div>
          </div>
        </div>

        {/* Barra de Distribución Proporcional Segmentada */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Distribución Proporcional de la Flota</span>
            <span className="font-mono text-slate-700">
              {pctLibres}% Libres • {pctUso}% En Paciente • {pctTaller}% En Taller
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${pctLibres}%` }}
              title={`Libres: ${totales_globales.disponibles} (${pctLibres}%)`}
            />
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${pctUso}%` }}
              title={`En Paciente: ${totales_globales.en_uso} (${pctUso}%)`}
            />
            <div 
              className="bg-amber-500 h-full transition-all duration-500" 
              style={{ width: `${pctTaller}%` }}
              title={`En Taller: ${totales_globales.en_mantenimiento} (${pctTaller}%)`}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CATÁLOGO DINÁMICO DE FAMILIAS DE EQUIPOS              */}
      {/*    (Extensible: soporta N categorías sin romper el UI)    */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cpvs-blue" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Familias de Equipamiento Biomédico
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {categorias.length} Familias Activas
            </span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Hacé clic en cualquier tarjeta para filtrar el inventario
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => {
            const ratioLibres = cat.total > 0 ? Math.round((cat.disponibles / cat.total) * 100) : 0;
            const ratioUso = cat.total > 0 ? Math.round((cat.en_uso / cat.total) * 100) : 0;
            const ratioTaller = cat.total > 0 ? Math.round((cat.en_mantenimiento / cat.total) * 100) : 0;

            return (
              <div
                key={cat.categoria}
                onClick={() => onFilterCategory?.(cat.categoria)}
                className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md hover:border-cpvs-blue/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Encabezado de la Categoría */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        {getCategoryIcon(cat.categoria)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-cpvs-blue transition-colors">
                          {cat.nombre_display}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {cat.total} unidades registradas
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {ratioLibres}% libre
                    </span>
                  </div>

                  {/* Barra de progreso de la categoría */}
                  <div className="mt-3.5 space-y-1">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${ratioLibres}%` }} />
                      <div className="bg-blue-500 h-full" style={{ width: `${ratioUso}%` }} />
                      <div className="bg-amber-500 h-full" style={{ width: `${ratioTaller}%` }} />
                    </div>
                  </div>
                </div>

                {/* Submétricas limpias con puntos de color */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600 font-medium">Libres:</span>
                    <span className="font-bold text-slate-900 font-mono">{cat.disponibles}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-slate-600 font-medium">En Uso:</span>
                    <span className="font-bold text-slate-900 font-mono">{cat.en_uso}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-slate-600 font-medium">Taller:</span>
                    <span className="font-bold text-slate-900 font-mono">{cat.en_mantenimiento}</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cpvs-blue group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
