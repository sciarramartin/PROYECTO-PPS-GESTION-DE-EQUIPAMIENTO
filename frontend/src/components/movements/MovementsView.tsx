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

  // Calcular tiempo transcurrido amigable
  const getTimeElapsed = (fechaSalida: string) => {
    const salida = new Date(fechaSalida).getTime();
    const ahora = Date.now();
    const diffMs = ahora - salida;
    const diffHs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHs < 1) return 'Menos de 1 hora';
    if (diffHs === 1) return 'Hace 1 hora';
    if (diffHs < 24) return `Hace ${diffHs} horas`;
    const dias = Math.floor(diffHs / 24);
    const restoHs = diffHs % 24;
    return `${dias}d ${restoHs}h en sala`;
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cpvs-blue" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Control de Traslados y Préstamos a Salas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Monitoreo en vivo de equipos operando en camas de pacientes e historial inmutable de devoluciones.
          </p>
        </div>

        {/* Botón Nuevo Traslado */}
        <button
          onClick={() => onOpenLoanModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cpvs-blue to-cpvs-cyan hover:from-blue-700 hover:to-teal-600 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>+ Asignar Equipo a Sala</span>
        </button>
      </div>

      {/* Selector de Solapas (Segmented Control) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-200/70 p-1 border border-slate-200 shadow-inner">
          <button
            onClick={() => setSubTab('activos')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
        <div className="relative">
          <input
            type="text"
            placeholder={subTab === 'activos' ? 'Buscar por equipo, sala...' : 'Buscar en historial...'}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue transition-all w-full sm:w-64 shadow-2xs"
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
              Cargando préstamos activos...
            </div>
          ) : filteredActive.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No hay traslados activos coincidentes</p>
              <p className="text-xs text-slate-500">Todos los equipos están en sus depósitos base o no coinciden con la búsqueda.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredActive.map((mov) => (
                <div 
                  key={mov.id_movimiento}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Bloque 1: Equipo */}
                  <div className="flex items-start gap-3 min-w-[260px]">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-lg shadow-2xs shrink-0 text-center min-w-[48px]">
                      #{mov.numero_sticker || '—'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {mov.nombre_articulo}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                        SN: {mov.numero_serie}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>Base: {mov.nombre_ubicacion_origen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bloque 2: Destino Actual en Sala */}
                  <div className="min-w-[220px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ubicación Actual en Cama
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cpvs-blue mt-0.5">
                      <MapPin className="w-4 h-4 text-cpvs-cyan shrink-0" />
                      <span>{mov.nombre_ubicacion_destino}</span>
                    </div>
                    {mov.sector_piso_destino && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {mov.sector_piso_destino}
                      </span>
                    )}
                  </div>

                  {/* Bloque 3: Auditoría de Salida y Tiempo */}
                  <div className="min-w-[190px] text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tiempo Conectado
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{getTimeElapsed(mov.fecha_salida)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[170px]">{mov.nombre_usuario_envia || 'Supervisor Guardia'}</span>
                    </div>
                  </div>

                  {/* Bloque 4: Botón de Retorno con LT8 */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleReturnClick(mov)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cpvs-blue hover:bg-blue-700 shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Reingreso (LT8)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SOLAPA 2: HISTORIAL DE DEVOLUCIONES Y SANITIZACIONES     */}
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
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 text-center w-20">N° Equipo</th>
                    <th className="py-3 px-4">Equipo Biomédico</th>
                    <th className="py-3 px-4">Retornó Desde</th>
                    <th className="py-3 px-4">Servicio Restituido</th>
                    <th className="py-3 px-4">Fecha y Hora Retorno</th>
                    <th className="py-3 px-4 text-center">Sanitización LT8</th>
                    <th className="py-3 px-4">Recibió</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((mov) => (
                    <tr key={mov.id_movimiento} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 text-slate-800">
                          #{mov.numero_sticker || '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {mov.nombre_articulo}
                        <span className="block font-mono text-[10px] text-slate-400 font-normal">
                          SN: {mov.numero_serie}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {mov.nombre_ubicacion_destino}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {mov.nombre_ubicacion_origen}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {mov.fecha_retorno_real || '—'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {mov.desinfeccion_realizada ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>LT8 Conforme (5m)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
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
