import React, { useState } from 'react';
import { 
  Syringe, 
  Wind, 
  MapPin, 
  QrCode, 
  Building, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Filter
} from 'lucide-react';
import { Equipment, EstadoOperativo } from '../../types';

interface EquipmentTableProps {
  equipment: Equipment[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectEquipment?: (eq: Equipment) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectEquipment
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filtrado reactivo en memoria
  const filteredEquipment = equipment.filter((item) => {
    if (selectedCategory === 'BOMBA_INFUSION' && item.categoria !== 'BOMBA_INFUSION') return false;
    if (selectedCategory === 'RESPIRADOR' && item.categoria !== 'RESPIRADOR') return false;

    if (selectedStatus !== 'ALL' && item.estado_operativo !== selectedStatus) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSticker = item.numero_sticker?.toLowerCase().includes(q);
      const matchSerial = item.numero_serie.toLowerCase().includes(q);
      const matchQR = item.codigo_qr.toLowerCase().includes(q);
      const matchUbicacion = item.nombre_ubicacion_actual.toLowerCase().includes(q);
      const matchServicio = item.nombre_servicio_propietario.toLowerCase().includes(q);
      return matchSticker || matchSerial || matchQR || matchUbicacion || matchServicio;
    }

    return true;
  });

  const getStatusBadge = (status: EstadoOperativo) => {
    switch (status) {
      case 'DISPONIBLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disponible
          </span>
        );
      case 'EN_USO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            En Paciente
          </span>
        );
      case 'EN_MANTENIMIENTO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Wrench className="w-3 h-3 text-amber-600" />
            En Taller
          </span>
        );
      case 'DE_BAJA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            De Baja
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-cpvs overflow-hidden">
      {/* Header con Filtros Rápidos */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-cpvs-blue uppercase tracking-tight flex items-center gap-1.5">
              <span>Inventario y Trazabilidad en Tiempo Real</span>
              <span className="text-xs normal-case font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                {filteredEquipment.length} equipos
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identificación Dual: Número de Sticker Visible + Número de Serie de Fábrica
            </p>
          </div>

          {/* Selector de Categorías (Chips) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-cpvs-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todos ({equipment.length})
            </button>
            <button
              onClick={() => setSelectedCategory('BOMBA_INFUSION')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
                selectedCategory === 'BOMBA_INFUSION'
                  ? 'bg-cpvs-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Syringe className="w-3 h-3 text-cpvs-cyan" />
              Bombas (42)
            </button>
            <button
              onClick={() => setSelectedCategory('RESPIRADOR')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
                selectedCategory === 'RESPIRADOR'
                  ? 'bg-cpvs-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Wind className="w-3 h-3 text-cpvs-cyan" />
              Respiradores (22)
            </button>
          </div>
        </div>

        {/* Filtros de Estado */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Estado:
          </span>
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'DISPONIBLE', label: 'Disponibles' },
            { id: 'EN_USO', label: 'En Paciente' },
            { id: 'EN_MANTENIMIENTO', label: 'En Taller' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                selectedStatus === st.id
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Equipos: Vista Móvil (Cards) y Vista Desktop (Tabla) */}
      
      {/* Vista Móvil (Cards Táctiles para Alejandra caminando) */}
      <div className="block lg:hidden divide-y divide-slate-100">
        {filteredEquipment.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No se encontraron equipos biomédicos para el filtro seleccionado.
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <div 
              key={item.id_equipo} 
              onClick={() => onSelectEquipment?.(item)}
              className="p-4 hover:bg-slate-50 active:bg-blue-50 transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded bg-cpvs-blue text-white flex items-center justify-center font-black text-sm tracking-tight shadow-sm shrink-0">
                    {item.numero_sticker || 'S/N'}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.nombre_articulo}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      SN: {item.numero_serie}
                    </p>
                  </div>
                </div>
                {getStatusBadge(item.estado_operativo)}
              </div>

              {/* Ubicación Actual destacada */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                  <span className="truncate">{item.nombre_ubicacion_actual}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Building className="w-3 h-3" />
                  <span>{item.nombre_servicio_propietario}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vista Desktop (Tabla Completa para Alejandra en la PC) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 text-center">Sticker</th>
              <th className="py-2.5 px-3">Equipo / Modelo</th>
              <th className="py-2.5 px-3">N° Serie Fábrica</th>
              <th className="py-2.5 px-3">Servicio Base</th>
              <th className="py-2.5 px-3">Ubicación Actual en Vivo</th>
              <th className="py-2.5 px-3 text-center">Estado</th>
              <th className="py-2.5 px-3 text-center">QR Token</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                  No se encontraron equipos biomédicos para el filtro seleccionado.
                </td>
              </tr>
            ) : (
              filteredEquipment.map((item) => (
                <tr 
                  key={item.id_equipo}
                  onClick={() => onSelectEquipment?.(item)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded font-black text-xs bg-cpvs-blue text-white shadow-xs">
                      {item.numero_sticker || 'S/N'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {item.categoria === 'BOMBA_INFUSION' ? (
                        <Syringe className="w-3.5 h-3.5 text-cpvs-blue shrink-0" />
                      ) : (
                        <Wind className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                      )}
                      <span>{item.nombre_articulo}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 font-medium">
                    {item.numero_serie}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{item.nombre_servicio_propietario}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                      <span>{item.nombre_ubicacion_actual}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {getStatusBadge(item.estado_operativo)}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                      <QrCode className="w-3 h-3 text-slate-500" />
                      {item.codigo_qr.substring(0, 12)}...
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
