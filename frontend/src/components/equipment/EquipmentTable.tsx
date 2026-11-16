import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  Building, 
  QrCode, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
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
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectEquipment
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');

  // Obtener categorías únicas dinámicamente de los datos reales
  const uniqueCategories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    equipment.forEach(item => {
      const catId = item.categoria || 'OTRO';
      const label = catId === 'BOMBA_INFUSION' ? 'Bombas de Infusión' :
                    catId === 'RESPIRADOR' ? 'Respiradores Volumétricos' :
                    item.nombre_articulo;
      const current = map.get(catId) || { id: catId, label, count: 0 };
      current.count += 1;
      map.set(catId, current);
    });
    return Array.from(map.values());
  }, [equipment]);

  // Obtener servicios únicos dinámicamente
  const uniqueServices = useMemo(() => {
    const set = new Set<string>();
    equipment.forEach(e => {
      if (e.nombre_servicio_propietario) set.add(e.nombre_servicio_propietario);
    });
    return Array.from(set).sort();
  }, [equipment]);

  // Filtrado reactivo multidimensional
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      // Filtro de Categoría
      if (selectedCategory !== 'ALL' && item.categoria !== selectedCategory) return false;

      // Filtro de Estado
      if (selectedStatus !== 'ALL' && item.estado_operativo !== selectedStatus) return false;

      // Filtro de Servicio Propietario
      if (selectedService !== 'ALL' && item.nombre_servicio_propietario !== selectedService) return false;

      // Búsqueda de texto (Sticker, Serial, QR, Habitación, Servicio)
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
  }, [equipment, selectedCategory, selectedStatus, selectedService, searchQuery]);

  const hasActiveFilters = selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedService !== 'ALL' || searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedService('ALL');
    setSearchQuery('');
  };

  const getStatusBadge = (status: EstadoOperativo) => {
    switch (status) {
      case 'DISPONIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Disponible
          </span>
        );
      case 'EN_USO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            En Paciente
          </span>
        );
      case 'EN_MANTENIMIENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            En Taller
          </span>
        );
      case 'DE_BAJA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            De Baja
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* ======================================================== */}
      {/* BARRA DE HERRAMIENTAS Y FILTROS UNIFICADA                */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Título y Conteo */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Inventario Maestro de Equipos
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {filteredEquipment.length} de {equipment.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identificación dual (Sticker + QR) con trazabilidad de ubicación en tiempo real.
            </p>
          </div>

          {/* Controles de Filtrado en Fila */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Selector de Familia / Categoría */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue cursor-pointer transition-all"
              >
                <option value="ALL">Todas las Familias ({equipment.length})</option>
                {uniqueCategories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* 2. Selector de Estado Operativo */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue cursor-pointer transition-all"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="DISPONIBLE">● Disponibles</option>
                <option value="EN_USO">● En Paciente</option>
                <option value="EN_MANTENIMIENTO">● En Taller</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* 3. Selector de Servicio Propietario */}
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue cursor-pointer transition-all max-w-[180px] truncate"
              >
                <option value="ALL">Todos los Servicios</option>
                {uniqueServices.map(svc => (
                  <option key={svc} value={svc}>{svc}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Buscador Integrado */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por serie, sticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue focus:bg-white transition-all w-44 sm:w-52"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Filtros Activos (Chips removibles) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs flex-wrap">
            <span className="text-slate-400 font-medium text-[11px]">Filtros aplicados:</span>

            {selectedCategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-cpvs-blue border border-blue-200 text-[11px] font-semibold">
                Familia: {uniqueCategories.find(c => c.id === selectedCategory)?.label || selectedCategory}
                <button onClick={() => setSelectedCategory('ALL')} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedStatus !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Estado: {selectedStatus === 'DISPONIBLE' ? 'Libre' : selectedStatus === 'EN_USO' ? 'En Paciente' : 'En Taller'}
                <button onClick={() => setSelectedStatus('ALL')} className="hover:text-slate-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedService !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Servicio: {selectedService}
                <button onClick={() => setSelectedService('ALL')} className="hover:text-slate-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Búsqueda: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-slate-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 font-semibold ml-auto transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA MOBILE (Tarjetas Táctiles Grandes para Alejandra)   */}
      {/* ======================================================== */}
      <div className="block lg:hidden divide-y divide-slate-100">
        {filteredEquipment.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No se encontraron equipos para los filtros seleccionados.
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <div 
              key={item.id_equipo} 
              onClick={() => onSelectEquipment?.(item)}
              className="p-4 hover:bg-slate-50 active:bg-blue-50/50 transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-cpvs-blue text-white flex items-center justify-center font-black text-sm tracking-tight shadow-xs shrink-0 font-mono">
                    {item.numero_sticker || '—'}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.nombre_articulo}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      SN: {item.numero_serie}
                    </p>
                  </div>
                </div>
                {getStatusBadge(item.estado_operativo)}
              </div>

              {/* Ubicación Actual */}
              <div className="flex items-center justify-between text-xs bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
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

      {/* ======================================================== */}
      {/* VISTA DESKTOP (Tabla Compacta para Alejandra en la PC)   */}
      {/* ======================================================== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 text-center w-20">Sticker</th>
              <th className="py-3 px-4">Equipo / Modelo Biomédico</th>
              <th className="py-3 px-4">N° Serie Fábrica</th>
              <th className="py-3 px-4">Servicio Base</th>
              <th className="py-3 px-4">Ubicación Actual en Vivo</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">QR Token</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  No se encontraron equipos biomédicos para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredEquipment.map((item) => (
                <tr 
                  key={item.id_equipo}
                  onClick={() => onSelectEquipment?.(item)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 group-hover:bg-cpvs-blue group-hover:text-white transition-colors text-slate-700">
                      {item.numero_sticker || '—'}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-cpvs-blue transition-colors">
                    {item.nombre_articulo}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500">
                    {item.numero_serie}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {item.nombre_servicio_propietario}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                      <span>{item.nombre_ubicacion_actual}</span>
                      {item.sector_piso && (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-normal">
                          {item.sector_piso}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(item.estado_operativo)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                      <QrCode className="w-3 h-3 text-slate-400" />
                      {item.codigo_qr.substring(0, 10)}...
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
