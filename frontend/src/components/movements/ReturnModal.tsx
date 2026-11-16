import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Building, MapPin, Sparkles, AlertTriangle } from 'lucide-react';
import { Equipment } from '../../types';
import { api } from '../../services/api';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onSuccess: (message: string) => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onSuccess
}) => {
  const [desinfeccionRealizada, setDesinfeccionRealizada] = useState<boolean>(false);
  const [observaciones, setObservaciones] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDesinfeccionRealizada(false);
      setObservaciones('');
      setError(null);
    }
  }, [isOpen, equipment]);

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

  if (!isOpen || !equipment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desinfeccionRealizada) {
      setError('Protocolo Sanitario Obligatorio: Debes certificar la desinfección con producto LT8 antes de retornar el equipo.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.createReturn({
        id_equipo: equipment.id_equipo,
        desinfeccion_realizada: true,
        observaciones: observaciones.trim() || undefined
      });

      onSuccess(`Reingreso sanitario exitoso: ${equipment.nombre_articulo} (#${equipment.numero_sticker}) restituido a ${equipment.nombre_servicio_propietario} como DISPONIBLE.`);
      onClose();
    } catch (err: any) {
      console.error('Error al reingresar equipo:', err);
      setError(err.message || 'No se pudo registrar el reingreso del equipo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-lg w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Bioseguridad Hospitalaria</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Reingreso y Certificación LT8
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

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Ficha del Equipo que se Reingresa */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-800 text-white">
                  #{equipment.numero_sticker || 'S/N'}
                </span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{equipment.nombre_articulo}</span>
              </div>
              <span className="text-xs font-mono text-slate-500">SN: {equipment.numero_serie}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Ubicación Actual (Retiro):</span>
                <div className="flex items-center gap-1 text-slate-700 font-semibold mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{equipment.nombre_ubicacion_actual}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Servicio Destino (Restitución):</span>
                <div className="flex items-center gap-1 text-slate-700 font-semibold mt-0.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{equipment.nombre_servicio_propietario}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caja Informativa del Protocolo Sanitario LT8 */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Protocolo Sanitario Oficial CPVS (Producto LT8)</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              El producto <strong>LT8</strong> (Amonio Cuaternario de 5ta generación) requiere un tiempo mínimo de acción de <strong>5 minutos</strong> sobre la carcasa plástica, panel táctil y cables del equipo para eliminar patógenos hospitalarios antes de reintegrarlo a disponibilidad.
            </p>
          </div>

          {/* Tilde Obligatorio de Bioseguridad (Heurística 5: Prevención de errores) */}
          <div className={`p-4 rounded-xl border transition-all ${
            desinfeccionRealizada 
              ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20' 
              : 'bg-amber-50/50 border-amber-200'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={desinfeccionRealizada}
                onChange={(e) => setDesinfeccionRealizada(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                required
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  Certifico desinfección conforme con producto LT8 (5 min)
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  El equipo queda sanitizado, seco y apto para ser conectado inmediatamente a un nuevo paciente.
                </span>
              </div>
            </label>
          </div>

          {/* Observaciones al Retorno */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Observaciones del estado físico (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Equipo limpio, accesorios completos, sin daños visibles"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
            />
          </div>

          {/* Botones de Acción */}
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
              disabled={loading || !desinfeccionRealizada}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
              title={!desinfeccionRealizada ? 'Debes certificar la desinfección con LT8 para habilitar el botón' : ''}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certificar y Retornar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
