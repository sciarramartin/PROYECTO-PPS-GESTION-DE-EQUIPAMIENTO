import React, { useState, useEffect, useMemo } from 'react';
import { X, Zap, MapPin, Building, Clock, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
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

const formatEquipmentCode = (sticker: string | null | undefined): string => {
  if (!sticker) return '—';
  if (sticker.startsWith('R-') || sticker.startsWith('B-') || sticker.startsWith('#')) return sticker;
  return /^\d+$/.test(sticker) ? `#${sticker.padStart(2, '0')}` : sticker;
};

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
  const [equipmentSearch, setEquipmentSearch] = useState<string>('');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<string>('ALL');
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
      setEquipmentSearch('');
      setLocationSearch('');
      setSelectedFloorFilter('ALL');
      setObservaciones('');
      setError(null);
    }
  }, [isOpen, preselectedEquipment]);

  // Manejar tecla ESC para cerrar
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

  // Ubicación actualmente seleccionada
  const currentLocation = useMemo(() => {
    return locationList.find(l => l.id_ubicacion === selectedLocationId) || null;
  }, [locationList, selectedLocationId]);

  // Filtrado de equipos por término de búsqueda
  const filteredAvailableEquipment = useMemo(() => {
    if (!equipmentSearch.trim()) return availableEquipment;
    const term = equipmentSearch.toLowerCase().trim();
    return availableEquipment.filter(eq => 
      eq.numero_sticker?.toLowerCase().includes(term) ||
      eq.numero_serie.toLowerCase().includes(term) ||
      eq.nombre_articulo.toLowerCase().includes(term)
    );
  }, [availableEquipment, equipmentSearch]);

  // Filtrado de destinos por buscador y chips de piso
  const filteredLocations = useMemo(() => {
    return locationList.filter(loc => {
      if (!loc.activo || loc.tipo_ubicacion === 'TALLER') return false;

      // Filtro de Piso / Sector
      if (selectedFloorFilter !== 'ALL') {
        if (selectedFloorFilter === 'PISO_1' && !loc.nombre.includes('Piso 1') && loc.sector_piso !== 'Piso 1 - Internación General') return false;
        if (selectedFloorFilter === 'PISO_2' && !loc.nombre.includes('Piso 2') && loc.sector_piso !== 'Piso 2 - Quirúrgica') return false;
        if (selectedFloorFilter === 'PISO_3' && !loc.nombre.includes('Piso 3') && loc.sector_piso !== 'Piso 3 - Cuidados Especiales') return false;
        if (selectedFloorFilter === 'CERRADOS' && loc.tipo_ubicacion === 'HABITACION') return false;
      }

      // Buscador de texto (ej. "101", "UTI")
      if (locationSearch.trim() !== '') {
        const term = locationSearch.toLowerCase().trim();
        const matchName = loc.nombre.toLowerCase().includes(term);
        const matchSector = loc.sector_piso?.toLowerCase().includes(term);
        return matchName || matchSector;
      }

      return true;
    });
  }, [locationList, selectedFloorFilter, locationSearch]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentId || !selectedLocationId) {
      setError('Por favor selecciona el equipo biomédico y la habitación de destino.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.createLoan({
        id_equipo: selectedEquipmentId,
        ubicacion_destino_id: selectedLocationId,
        observaciones: observaciones.trim() || undefined
      });

      onSuccess(`Traslado registrado: ${res.data.nombre_articulo} (#${res.data.numero_sticker}) asignado a ${res.data.nombre_ubicacion_destino}.`);
      onClose();
    } catch (err: any) {
      console.error('Error al registrar traslado:', err);
      setError(err.message || 'No se pudo registrar el traslado del equipo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-cpvs-navy via-cpvs-blue to-cpvs-cyan p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Gestión de Salas</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Asignar Equipo a Sala / Cama
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* PASO 1: Equipo a Trasladar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>1. Equipo Biomédico</span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {availableEquipment.length} libres
              </span>
            </label>

            {/* Ficha Visual Destacada si ya está seleccionado */}
            {currentEquipment ? (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono font-black text-lg shadow-2xs">
                    {formatEquipmentCode(currentEquipment.numero_sticker)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{currentEquipment.nombre_articulo}</h4>
                    <p className="text-[11px] font-mono text-slate-500">SN: {currentEquipment.numero_serie}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                      <Building className="w-3 h-3 text-cpvs-blue" />
                      <span>Sale de: <strong>{currentEquipment.nombre_servicio_propietario.replace('Taller Bioingeniería / Mantenimiento', 'Taller / Mantenimiento')}</strong></span>
                    </div>
                  </div>
                </div>
                {!preselectedEquipment && (
                  <button
                    type="button"
                    onClick={() => setSelectedEquipmentId(null)}
                    className="text-xs text-cpvs-blue hover:underline font-semibold cursor-pointer shrink-0"
                  >
                    Cambiar
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscá por código (ej. #09, R-01), serie o modelo..."
                    value={equipmentSearch}
                    onChange={(e) => setEquipmentSearch(e.target.value)}
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
                            {formatEquipmentCode(eq.numero_sticker)}
                          </span>
                          <span className="truncate">{eq.nombre_articulo}</span>
                        </div>
                        <span className={`font-mono text-[10px] shrink-0 ${
                          selectedEquipmentId === eq.id_equipo ? 'text-white/80' : 'text-slate-400'
                        }`}>
                          {eq.nombre_servicio_propietario.replace('Taller Bioingeniería / Mantenimiento', 'Taller / Mantenimiento')}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PASO 2: Selección de Destino Interactiva */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                2. Habitación o Servicio de Destino
              </label>
              {currentLocation && (
                <span className="text-[11px] font-bold text-cpvs-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Elegido: {currentLocation.nombre}
                </span>
              )}
            </div>

            {/* Chips Rápidos de Filtrado por Piso */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'PISO_1', label: 'Piso 1' },
                { id: 'PISO_2', label: 'Piso 2' },
                { id: 'PISO_3', label: 'Piso 3' },
                { id: 'CERRADOS', label: 'Servicios' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedFloorFilter(chip.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedFloorFilter === chip.id
                      ? 'bg-cpvs-blue text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Buscador de Destino Específico */}
            <div className="relative">
              <input
                type="text"
                placeholder="Escribí número de cama o habitación (ej. 101, 204, UTI)..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Cuadrícula de Destinos Filtrados */}
            <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {filteredLocations.length === 0 ? (
                <div className="col-span-2 p-3 text-center text-xs text-slate-400">
                  No se encontraron habitaciones para el filtro seleccionado.
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isSelected = selectedLocationId === loc.id_ubicacion;
                  return (
                    <button
                      key={loc.id_ubicacion}
                      type="button"
                      onClick={() => setSelectedLocationId(loc.id_ubicacion)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cpvs-blue text-white border-cpvs-blue shadow-xs font-semibold'
                          : 'bg-white hover:bg-slate-100 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <span className="block truncate">{loc.nombre}</span>
                        {loc.sector_piso && (
                          <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {loc.sector_piso}
                          </span>
                        )}
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Observaciones Operativas */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Observaciones (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Paciente en recuperación post-quirúrgica"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue"
            />
          </div>

          {/* Alerta de Rotación Preventiva */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px] text-slate-500">Plazo de Rotación:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
              <Clock className="w-3 h-3" />
              Alerta de revisión en 48 hs
            </span>
          </div>

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
                  <span>Asignando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Asignación</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
