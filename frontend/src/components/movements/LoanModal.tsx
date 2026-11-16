import React, { useState, useEffect, useMemo } from 'react';
import { X, Zap, MapPin, Building, Clock, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { Equipment, Location } from '../../types';
import { api } from '../../services/api';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  locationList: Location[];
  preselectedEquipment?: Equipment | null;
  onSuccess: (message: string) => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  locationList,
  preselectedEquipment,
  onSuccess
}) => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar estado al abrir el modal
  useEffect(() => {
    if (isOpen) {
      if (preselectedEquipment) {
        setSelectedEquipmentId(preselectedEquipment.id_equipo);
      } else {
        setSelectedEquipmentId(null);
      }
      setSelectedLocationId(null);
      setSearchTerm('');
      setObservaciones('');
      setError(null);
    }
  }, [isOpen, preselectedEquipment]);

  // Manejar tecla ESC para cerrar (Heurística 3: Control y libertad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Equipos disponibles para préstamo
  const availableEquipment = useMemo(() => {
    return equipmentList.filter(eq => eq.estado_operativo === 'DISPONIBLE');
  }, [equipmentList]);

  // Equipo actualmente seleccionado
  const currentEquipment = useMemo(() => {
    return equipmentList.find(eq => eq.id_equipo === selectedEquipmentId) || null;
  }, [equipmentList, selectedEquipmentId]);

  // Ubicaciones agrupadas por sector o tipo
  const groupedLocations = useMemo(() => {
    const habitaciones = locationList.filter(l => l.tipo_ubicacion === 'HABITACION' && l.activo);
    const servicios = locationList.filter(l => l.tipo_ubicacion !== 'HABITACION' && l.tipo_ubicacion !== 'TALLER' && l.activo);
    return { habitaciones, servicios };
  }, [locationList]);

  // Filtrado de equipos por término de búsqueda (Sticker o Serie)
  const filteredAvailableEquipment = useMemo(() => {
    if (!searchTerm.trim()) return availableEquipment;
    const term = searchTerm.toLowerCase().trim();
    return availableEquipment.filter(eq => 
      eq.numero_sticker?.toLowerCase().includes(term) ||
      eq.numero_serie.toLowerCase().includes(term) ||
      eq.nombre_articulo.toLowerCase().includes(term)
    );
  }, [availableEquipment, searchTerm]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentId || !selectedLocationId) {
      setError('Por favor selecciona el equipo biomédico y la ubicación de destino.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.createLoan({
        id_equipo: selectedEquipmentId,
        ubicacion_destino_id: selectedLocationId,
        observaciones: observaciones.trim() || 'Préstamo rápido operativo'
      });

      onSuccess(`Préstamo registrado exitosamente: ${res.data.nombre_articulo} (#${res.data.numero_sticker}) asignado a ${res.data.nombre_ubicacion_destino}.`);
      onClose();
    } catch (err: any) {
      console.error('Error al registrar préstamo:', err);
      setError(err.message || 'No se pudo registrar el préstamo. Verifica la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-cpvs-navy via-cpvs-blue to-cpvs-teal p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Flujo Rápido (3 Clics)</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Registrar Préstamo de Equipo
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* PASO 1: Selección de Equipo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>1. Equipo Biomédico a Trasladar</span>
              <span className="text-[11px] font-normal text-emerald-600 font-medium">
                {availableEquipment.length} equipos libres
              </span>
            </label>

            {/* Si ya viene preseleccionado, mostramos ficha directa */}
            {preselectedEquipment ? (
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cpvs-blue text-white font-mono font-bold text-xs">
                      #{preselectedEquipment.numero_sticker || '—'}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{preselectedEquipment.nombre_articulo}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">SN: {preselectedEquipment.numero_serie}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEquipmentId(null)}
                  className="text-xs text-cpvs-blue hover:underline font-semibold"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escribí número de sticker (ej. 14) o serie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
                  {filteredAvailableEquipment.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No hay equipos disponibles que coincidan con la búsqueda.
                    </div>
                  ) : (
                    filteredAvailableEquipment.slice(0, 10).map((eq) => (
                      <button
                        key={eq.id_equipo}
                        type="button"
                        onClick={() => setSelectedEquipmentId(eq.id_equipo)}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          selectedEquipmentId === eq.id_equipo
                            ? 'bg-cpvs-blue text-white font-semibold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            selectedEquipmentId === eq.id_equipo ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                          }`}>
                            #{eq.numero_sticker || 'S/N'}
                          </span>
                          <span className="truncate">{eq.nombre_articulo}</span>
                        </div>
                        <span className={`font-mono text-[10px] shrink-0 ${
                          selectedEquipmentId === eq.id_equipo ? 'text-white/80' : 'text-slate-400'
                        }`}>
                          {eq.numero_serie}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PASO 2: Selección de Destino */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>2. Habitación o Servicio de Destino</span>
              <span className="text-[10px] text-slate-400 font-normal">Requerido</span>
            </label>
            <div className="relative">
              <select
                value={selectedLocationId || ''}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue cursor-pointer"
                required
              >
                <option value="">Selecciona la cama o servicio de destino...</option>
                <optgroup label="── Camas de Internación General ──">
                  {groupedLocations.habitaciones.map(loc => (
                    <option key={loc.id_ubicacion} value={loc.id_ubicacion}>
                      {loc.nombre} {loc.sector_piso ? `(${loc.sector_piso})` : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="── Servicios Clínicos / Quirófanos ──">
                  {groupedLocations.servicios.map(loc => (
                    <option key={loc.id_ubicacion} value={loc.id_ubicacion}>
                      {loc.nombre}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Observaciones Operativas (Opcional) */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Observaciones (Opcional - ej. "Paciente post-op")
            </label>
            <input
              type="text"
              placeholder="Sin datos clínicos de paciente necesarios..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue"
            />
          </div>

          {/* Tarjeta de Reconocimiento Visual (Heurística 6 de Nielsen) */}
          {currentEquipment && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium text-slate-500">Servicio Propietario:</span>
                <span className="font-semibold text-slate-800">{currentEquipment.nombre_servicio_propietario}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium text-slate-500">Plazo Preventivo:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                  <Clock className="w-3 h-3" />
                  Alerta retorno en 48 hs
                </span>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading || !selectedEquipmentId || !selectedLocationId}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cpvs-blue to-cpvs-cyan hover:from-blue-700 hover:to-teal-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Préstamo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
