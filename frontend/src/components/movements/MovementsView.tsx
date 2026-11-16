import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Search, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Activity,
  Calendar
} from 'lucide-react';
import { Movement, Equipment } from '../../types';
import { api } from '../../services/api';

interface MovementsViewProps {
  onOpenLoanModal: (eq?: Equipment) => void;
  onOpenReturnModal: (eq: Equipment) => void;
  equipmentList: Equipment[];
}

export const MovementsView: React.FC<MovementsViewProps> = ({
  onOpenLoanModal,
  onOpenReturnModal,
  equipmentList
}) => {
  const [subTab, setSubTab] = useState<'activos' | 'historial'>('activos');
  const [activeMovements, setActiveMovements] = useState<Movement[]>([]);
  const [historyMovements, setHistoryMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const loadMovements = async () => {
    try {
      setLoading(true);
      const [activos, historial] = await Promise.all([
        api.getActiveMovements(),
        api.getMovementHistory()
      ]);
      setActiveMovements(activos);
      setHistoryMovements(historial);
    } catch (e) {
      console.error('Error cargando movimientos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, [equipmentList]);

  // Filtrado reactivo de movimientos activos
  const filteredActive = useMemo(() => {
    if (!searchFilter.trim()) return activeMovements;
    const term = searchFilter.toLowerCase().trim();
    return activeMovements.filter(m => 
      m.numero_sticker?.toLowerCase().includes(term) ||
      m.numero_serie?.toLowerCase().includes(term) ||
      m.nombre_articulo?.toLowerCase().includes(term) ||
      m.nombre_ubicacion_destino?.toLowerCase().includes(term) ||
      m.nombre_ubicacion_origen?.toLowerCase().includes(term)
    );
  }, [activeMovements, searchFilter]);

  // Filtrado reactivo del historial
  const filteredHistory = useMemo(() => {
    if (!searchFilter.trim()) return historyMovements;
    const term = searchFilter.toLowerCase().trim();
    return historyMovements.filter(m => 
      m.numero_sticker?.toLowerCase().includes(term) ||
      m.numero_serie?.toLowerCase().includes(term) ||
      m.nombre_articulo?.toLowerCase().includes(term) ||
      m.nombre_ubicacion_destino?.toLowerCase().includes(term) ||
      m.nombre_usuario_recibe?.toLowerCase().includes(term)
    );
  }, [historyMovements, searchFilter]);

  // Calcular horas de uso en sala
  const getUsageHours = (fechaSalida: string) => {
    const salida = new Date(fechaSalida).getTime();
    const ahora = Date.now();
    const diffMs = ahora - salida;
    const diffHs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHs < 1) return '< 1 hora de uso';
    if (diffHs === 1) return '1 hora de uso';
    if (diffHs < 24) return `${diffHs} hs de uso`;
    const dias = Math.floor(diffHs / 24);
    const restoHs = diffHs % 24;
    return `${dias}d ${restoHs}hs en sala`;
  };

  const handleReturnClick = (mov: Movement) => {
    const eq = equipmentList.find(e => e.id_equipo === mov.id_equipo);
    if (eq) {
      onOpenReturnModal(eq);
    }
  };

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* ENCABEZADO Y SELECTOR DE SOLAPAS                         */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cpvs-blue" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Control de Traslados a Salas y Devoluciones
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Equipos actualmente en uso con pacientes y registro de devoluciones con bioseguridad LT8.
          </p>
        </div>

        {/* Botón Principal Destacado */}
        <button
          onClick={() => onOpenLoanModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cpvs-blue to-cpvs-cyan hover:from-blue-700 hover:to-teal-600 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full md:w-auto"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>+ Asignar Equipo a Sala</span>
        </button>
      </div>

      {/* Selector de Solapas y Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-200/70 p-1 border border-slate-200 shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setSubTab('activos')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'activos'
                ? 'bg-white text-cpvs-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Equipos en Sala (Préstamos Activos)</span>
            <span className={`px-2 py-0.2 rounded-full font-mono text-[11px] ${
              subTab === 'activos' ? 'bg-blue-100 text-cpvs-blue' : 'bg-slate-300 text-slate-700'
            }`}>
              {activeMovements.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('historial')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'historial'
                ? 'bg-white text-cpvs-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial de Devoluciones</span>
          </button>
        </div>

        {/* Buscador de Movimientos */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={subTab === 'activos' ? 'Buscar por equipo, sala...' : 'Buscar en historial...'}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* SOLAPA 1: EQUIPOS EN SALA (PRÉSTAMOS ACTIVOS)            */}
      {/* ======================================================== */}
      {subTab === 'activos' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Cargando equipos en sala...
            </div>
          ) : filteredActive.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No hay traslados activos coincidentes</p>
              <p className="text-xs text-slate-500">Todos los equipos están libres en sus depósitos base.</p>
            </div>
          ) : (
            <>
              {/* VISTA DESKTOP: TABLA CON ENCABEZADOS CLAROS (No repite etiquetas) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                      <th className="py-3 px-4 text-center w-24">N° Equipo</th>
                      <th className="py-3 px-4">Equipo Biomédico</th>
                      <th className="py-3 px-4">Cama / Habitación Asignada</th>
                      <th className="py-3 px-4">Servicio Base (Origen)</th>
                      <th className="py-3 px-4">Horas de Uso en Sala</th>
                      <th className="py-3 px-4">Enviado Por</th>
                      <th className="py-3 px-4 text-center w-36">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredActive.map((mov) => (
                      <tr key={mov.id_movimiento} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-black text-sm bg-slate-900 text-white shadow-2xs">
                            #{mov.numero_sticker || '—'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{mov.nombre_articulo}</span>
                          <span className="font-mono text-[10px] text-slate-500">SN: {mov.numero_serie}</span>
                        </td>

                        <td className="py-3 px-4 font-semibold text-cpvs-blue whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                            <span>{mov.nombre_ubicacion_destino}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{mov.nombre_ubicacion_origen}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-[11px]">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{getUsageHours(mov.fecha_salida)}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[11px]">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{mov.nombre_usuario_envia || 'Supervisor Guardia'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleReturnClick(mov)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-cpvs-blue hover:bg-blue-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Reingreso (LT8)</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* VISTA MOBILE: TARJETAS TÁCTILES LIMPIAS */}
              <div className="lg:hidden p-3 sm:p-4 space-y-3 bg-slate-50/50">
                {filteredActive.map((mov) => (
                  <div 
                    key={mov.id_movimiento}
                    className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-2.5"
                  >
                    {/* Fila 1: N° Equipo + Nombre */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-black text-sm bg-slate-900 text-white shadow-2xs shrink-0">
                          #{mov.numero_sticker || '—'}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {mov.nombre_articulo}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            SN: {mov.numero_serie}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200/60 whitespace-nowrap">
                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                        {getUsageHours(mov.fecha_salida)}
                      </span>
                    </div>

                    {/* Fila 2: Cama Asignada */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                        <span className="truncate">Cama: <strong>{mov.nombre_ubicacion_destino}</strong></span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        Base: {mov.nombre_ubicacion_origen}
                      </span>
                    </div>

                    {/* Fila 3: Botón Grande Táctil de Reingreso */}
                    <button
                      onClick={() => handleReturnClick(mov)}
                      className="w-full py-2.5 px-3 rounded-lg bg-cpvs-blue hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Reingreso Sanitario con LT8</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SOLAPA 2: HISTORIAL DE DEVOLUCIONES                      */}
      {/* ======================================================== */}
      {subTab === 'historial' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Cargando historial de devoluciones...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No hay registros de devoluciones en el historial.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                    <th className="py-3 px-4 text-center w-20">N° Equipo</th>
                    <th className="py-3 px-4">Equipo Biomédico</th>
                    <th className="py-3 px-4">Habitación de donde volvió</th>
                    <th className="py-3 px-4">Devuelto a (Servicio Base)</th>
                    <th className="py-3 px-4">Fecha de Devolución</th>
                    <th className="py-3 px-4 text-center">Protocolo LT8</th>
                    <th className="py-3 px-4">Recibido por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((mov) => (
                    <tr key={mov.id_movimiento} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 text-slate-800">
                          #{mov.numero_sticker || '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{mov.nombre_articulo}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          SN: {mov.numero_serie}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{mov.nombre_ubicacion_destino}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{mov.nombre_ubicacion_origen}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {mov.fecha_retorno_real || '—'}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {mov.desinfeccion_realizada ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>LT8 Conforme (5 min)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {mov.nombre_usuario_recibe || 'Alejandra'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
