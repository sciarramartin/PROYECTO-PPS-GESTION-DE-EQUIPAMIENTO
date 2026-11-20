import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Building, 
  QrCode, 
  ChevronDown,
  Zap,
  RotateCcw,
  Tag,
  Printer,
  ShieldCheck,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { Equipment, EstadoOperativo } from '../../types';

export const formatEquipmentCode = (sticker: string | null | undefined): string => {
  if (!sticker) return '—';
  if (sticker.startsWith('R-') || sticker.startsWith('B-') || sticker.startsWith('#')) return sticker;
  return /^\d+$/.test(sticker) ? `#${sticker.padStart(2, '0')}` : sticker;
};

interface EquipmentTableProps {
  equipment: Equipment[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectEquipment?: (eq: Equipment) => void;
  onOpenLoanModal?: (eq?: Equipment) => void;
  onOpenReturnModal?: (eq: Equipment) => void;
  onOpenLabelModal?: (eq?: Equipment, batch?: Equipment[]) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectEquipment,
  onOpenLoanModal,
  onOpenReturnModal,
  onOpenLabelModal
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [isMobileFilterExpanded, setIsMobileFilterExpanded] = useState<boolean>(false);

  const activeDropdownCount = (selectedCategory !== 'ALL' ? 1 : 0) + 
                              (selectedStatus !== 'ALL' ? 1 : 0) + 
                              (selectedService !== 'ALL' ? 1 : 0);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Disponible
          </span>
        );
      case 'EN_USO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            En Paciente
          </span>
        );
      case 'EN_MANTENIMIENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            En Taller
          </span>
        );
      case 'DE_BAJA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            De Baja
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* ======================================================== */}
      {/* BARRA DE HERRAMIENTAS Y ACCIONES RÁPIDAS                 */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Título y Conteo */}
          <div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Inventario Maestro de Equipos
              </h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0">
                {filteredEquipment.length} de {equipment.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identificación dual (Sticker + QR) con trazabilidad y bioseguridad en tiempo real.
            </p>
          </div>

          {/* Botones de Acción Global Rápida */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenLabelModal?.(undefined, filteredEquipment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:text-cpvs-blue shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Generar e imprimir etiquetas físicas para los equipos filtrados"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={() => onOpenLoanModal?.()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cpvs-blue to-cpvs-cyan hover:from-blue-700 hover:to-teal-600 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Asignar equipo a sala</span>
            </button>
          </div>
        </div>

        {/* Controles de Filtrado */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Fila Exclusiva Mobile (sm:hidden): Buscador Principal + Botón Compacto de Filtros */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar código, serie, sala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterExpanded(!isMobileFilterExpanded)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
                isMobileFilterExpanded || activeDropdownCount > 0
                  ? 'bg-cpvs-blue text-white border-cpvs-blue shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {activeDropdownCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-cpvs-blue text-[10px] flex items-center justify-center font-black">
                  {activeDropdownCount}
                </span>
              )}
            </button>
          </div>

          {/* Menú Colapsable de Filtros para Mobile (Ocupa mínimo espacio cuando se abre) */}
          {isMobileFilterExpanded && (
            <div className="sm:hidden grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-100">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-2 pr-6 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Familias (Todas)</option>
                  {uniqueCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none pl-2 pr-6 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Estados (Todos)</option>
                  <option value="DISPONIBLE">● Disponibles</option>
                  <option value="EN_USO">● En Paciente</option>
                  <option value="EN_MANTENIMIENTO">● En Taller</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>

              <div className="relative col-span-2">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full appearance-none pl-2 pr-6 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none truncate"
                >
                  <option value="ALL">Todos los Servicios Propietarios</option>
                  {uniqueServices.map(svc => (
                    <option key={svc} value={svc}>{svc}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Controles Desktop (sm:flex): Barra horizontal elegante */}
          <div className="hidden sm:flex sm:items-center justify-between gap-2">
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
                  className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue cursor-pointer transition-all truncate max-w-[200px]"
                >
                  <option value="ALL">Todos los Servicios</option>
                  {uniqueServices.map(svc => (
                    <option key={svc} value={svc}>{svc}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Buscador Integrado Desktop */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código, serie, sala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-60 pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue focus:bg-white transition-all"
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
            <span className="text-slate-400 font-medium text-[11px]">Filtros activos:</span>

            {selectedCategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-cpvs-blue border border-blue-200 text-[11px] font-semibold">
                Familia: {uniqueCategories.find(c => c.id === selectedCategory)?.label || selectedCategory}
                <button onClick={() => setSelectedCategory('ALL')} className="hover:text-blue-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedStatus !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Estado: {selectedStatus === 'DISPONIBLE' ? 'Libre' : selectedStatus === 'EN_USO' ? 'En Paciente' : 'En Taller'}
                <button onClick={() => setSelectedStatus('ALL')} className="hover:text-slate-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedService !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Servicio: {selectedService}
                <button onClick={() => setSelectedService('ALL')} className="hover:text-slate-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Búsqueda: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-slate-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold underline ml-1 cursor-pointer"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA MOBILE: LISTA COMPACTA CON BOTÓN A LA DERECHA      */}
      {/* ======================================================== */}
      <div className="lg:hidden divide-y divide-slate-100 bg-white">
        {filteredEquipment.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron equipos para los filtros seleccionados.
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <div
              key={item.id_equipo}
              className="p-3 sm:p-3.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 transition-colors"
            >
              {/* Izquierda: Código / Sticker + Nombre + Ubicación */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg font-mono font-bold text-xs bg-slate-900 text-white shrink-0 shadow-2xs">
                  {formatEquipmentCode(item.numero_sticker)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.nombre_articulo}
                    </h4>
                    {getStatusBadge(item.estado_operativo)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-cpvs-cyan shrink-0" />
                    <span className="truncate">{item.nombre_ubicacion_actual}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">SN: {item.numero_serie}</span>
                  </div>
                </div>
              </div>

              {/* Derecha: Botón de Acción Directo en Formato Lista */}
              <div className="flex items-center gap-1.5 shrink-0">
                {item.estado_operativo === 'DISPONIBLE' && (
                  <button
                    onClick={() => onOpenLoanModal?.(item)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    title="Asignar a Sala"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Asignar</span>
                  </button>
                )}
                {item.estado_operativo === 'EN_USO' && (
                  <button
                    onClick={() => onOpenReturnModal?.(item)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-cpvs-blue bg-blue-50 hover:bg-blue-100 border border-blue-200/60 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    title="Reingreso Sanitario LT8"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reingreso</span>
                  </button>
                )}
                {item.estado_operativo === 'EN_MANTENIMIENTO' && (
                  <span className="px-2 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-md">
                    Taller
                  </span>
                )}
                <button
                  onClick={() => onOpenLabelModal?.(item)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Ver Etiqueta y QR"
                >
                  <Tag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* VISTA DESKTOP (Tabla con Acciones Directas en Fila)       */}
      {/* ======================================================== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
              <th className="py-3 px-4 text-center w-28">N° / Código</th>
              <th className="py-3 px-4">Equipo Biomédico</th>
              <th className="py-3 px-4">N° Serie</th>
              <th className="py-3 px-4">Servicio Base</th>
              <th className="py-3 px-4">Ubicación Actual</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center w-36">Acción Directa</th>
              <th className="py-3 px-4 text-center w-16">Etiqueta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                  No se encontraron equipos biomédicos para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredEquipment.map((item) => (
                <tr 
                  key={item.id_equipo}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-100 group-hover:bg-cpvs-blue group-hover:text-white transition-colors text-slate-700">
                      {formatEquipmentCode(item.numero_sticker)}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-cpvs-blue transition-colors">
                    {item.nombre_articulo}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {item.numero_serie}
                  </td>

                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {item.nombre_servicio_propietario.replace('Taller Bioingeniería / Mantenimiento', 'Taller / Mantenimiento')}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cpvs-cyan shrink-0" />
                      <span>{item.nombre_ubicacion_actual}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(item.estado_operativo)}
                  </td>

                  {/* Acciones Directas en Fila (Heurística 7: Eficiencia de Uso) */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {item.estado_operativo === 'DISPONIBLE' && (
                      <button
                        onClick={() => onOpenLoanModal?.(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[11px] border border-emerald-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Asignar y trasladar este equipo a una sala"
                      >
                        <Zap className="w-3 h-3 text-emerald-600 group-hover:text-white" />
                        <span>Asignar</span>
                      </button>
                    )}

                    {item.estado_operativo === 'EN_USO' && (
                      <button
                        onClick={() => onOpenReturnModal?.(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-cpvs-blue hover:bg-cpvs-blue hover:text-white font-bold text-[11px] border border-blue-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Reingreso del equipo al servicio base"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Reingreso</span>
                      </button>
                    )}

                    {item.estado_operativo === 'EN_MANTENIMIENTO' && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                        En Taller
                      </span>
                    )}
                  </td>

                  {/* Icono de Etiqueta y QR */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onOpenLabelModal?.(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Ver / Imprimir etiqueta física autoadhesiva"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
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
