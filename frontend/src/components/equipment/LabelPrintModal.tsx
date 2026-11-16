import React, { useState, useEffect, useMemo } from 'react';
import { X, Printer, Tag, Layers, Search, Check, RefreshCw, CheckSquare, Square, Filter } from 'lucide-react';
import QRCode from 'qrcode';
import { Equipment } from '../../types';

interface LabelPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  batchEquipment?: Equipment[];
  allEquipment?: Equipment[];
}

interface EquipmentWithQR extends Equipment {
  qrDataUrl: string;
}

export const LabelPrintModal: React.FC<LabelPrintModalProps> = ({
  isOpen,
  onClose,
  equipment,
  batchEquipment = [],
  allEquipment = []
}) => {
  // Modos: 'category' (por tipo), 'custom' (selección manual con checkboxes), 'single' (reimpresión individual)
  const [printMode, setPrintMode] = useState<'category' | 'custom' | 'single'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSingleEquipment, setSelectedSingleEquipment] = useState<Equipment | null>(null);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<Set<number>>(new Set());
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [labelsWithQR, setLabelsWithQR] = useState<EquipmentWithQR[]>([]);
  const [loadingQRs, setLoadingQRs] = useState<boolean>(true);
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');

  // Lista base unificada
  const fullList = useMemo(() => {
    return allEquipment.length > 0 ? allEquipment : batchEquipment;
  }, [allEquipment, batchEquipment]);

  // Familias únicas disponibles
  const availableCategories = useMemo(() => {
    const map = new Map<string, { key: string; name: string; count: number }>();
    fullList.forEach(eq => {
      const cat = eq.categoria || 'OTRO';
      const name = cat === 'BOMBA_INFUSION' ? 'Bombas de Infusión' :
                   cat === 'RESPIRADOR' ? 'Respiradores Volumétricos' :
                   'Otros Equipos';
      if (!map.has(cat)) {
        map.set(cat, { key: cat, name, count: 0 });
      }
      map.get(cat)!.count++;
    });
    return Array.from(map.values());
  }, [fullList]);

  // Inicializar estado al abrir el modal
  useEffect(() => {
    if (isOpen) {
      if (equipment) {
        setPrintMode('single');
        setSelectedSingleEquipment(equipment);
        setSelectedEquipmentIds(new Set([equipment.id_equipo]));
      } else {
        setPrintMode('category');
        setSelectedCategory('ALL');
        setSelectedEquipmentIds(new Set(fullList.map(e => e.id_equipo)));
      }
      setSearchFilter('');
    }
  }, [isOpen, equipment, fullList]);

  // Lista de equipos a imprimir según el modo activo
  const targetEquipmentList = useMemo(() => {
    if (printMode === 'single') {
      return selectedSingleEquipment ? [selectedSingleEquipment] : [];
    }

    if (printMode === 'category') {
      if (selectedCategory === 'ALL') return fullList;
      return fullList.filter(eq => (eq.categoria || 'OTRO') === selectedCategory);
    }

    if (printMode === 'custom') {
      return fullList.filter(eq => selectedEquipmentIds.has(eq.id_equipo));
    }

    return fullList;
  }, [printMode, selectedCategory, selectedSingleEquipment, selectedEquipmentIds, fullList]);

  // Generar QRs vectoriales de alta densidad
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const generateQRs = async () => {
      setLoadingQRs(true);
      const itemsWithQR: EquipmentWithQR[] = await Promise.all(
        targetEquipmentList.map(async (eq) => {
          try {
            const qrDataUrl = await QRCode.toDataURL(eq.codigo_qr, {
              width: 220,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#ffffff'
              }
            });
            return { ...eq, qrDataUrl };
          } catch (e) {
            console.error('Error generando QR para', eq.codigo_qr, e);
            return { ...eq, qrDataUrl: '' };
          }
        })
      );

      if (isMounted) {
        setLabelsWithQR(itemsWithQR);
        setLoadingQRs(false);
      }
    };

    generateQRs();
    return () => { isMounted = false; };
  }, [isOpen, targetEquipmentList]);

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

  // Control de checkboxes para modo Selección Personalizada
  const toggleSelectEquipment = (id: number) => {
    const updated = new Set(selectedEquipmentIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedEquipmentIds(updated);
  };

  const selectAll = () => {
    setSelectedEquipmentIds(new Set(fullList.map(e => e.id_equipo)));
  };

  const deselectAll = () => {
    setSelectedEquipmentIds(new Set());
  };

  // Filtrado para búsqueda en modo custom o single
  const filteredSearchList = useMemo(() => {
    if (!searchFilter.trim()) return fullList;
    const term = searchFilter.toLowerCase().trim();
    return fullList.filter(eq =>
      eq.numero_sticker?.toLowerCase().includes(term) ||
      eq.numero_serie.toLowerCase().includes(term) ||
      eq.nombre_articulo.toLowerCase().includes(term)
    );
  }, [fullList, searchFilter]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Estilos específicos de impresión */}
      <style>{`
        @media print {
          @page {
            margin: 5mm;
            size: A4 portrait;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-labels-area, #printable-labels-area * {
            visibility: visible !important;
          }
          #printable-labels-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            display: grid !important;
            grid-template-columns: ${labelsWithQR.length === 1 ? '100mm' : labelSize === 'compact' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'} !important;
            gap: 3.5mm !important;
          }
          .no-print {
            display: none !important;
          }
          .label-print-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-sizing: border-box !important;
            border: 1.5px solid #000000 !important;
            border-radius: 6px !important;
            padding: 3mm !important;
            height: ${labelSize === 'compact' ? '40mm' : '52mm'} !important;
            max-height: ${labelSize === 'compact' ? '40mm' : '52mm'} !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background-color: #ffffff !important;
          }
        }
      `}</style>

      {/* Contenedor Modal: SIN no-print en el padre para permitir renderizado en print */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 print:static print:p-0 print:bg-white print:z-auto print:block"
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-4xl w-full overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none print:block print:p-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Modal (Oculto en Impresión) */}
          <div className="bg-gradient-to-r from-slate-900 via-cpvs-navy to-cpvs-blue p-4 sm:p-5 text-white flex items-center justify-between no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Tag className="w-5 h-5 text-cpvs-cyan" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Rotulación Física Oficial CPVS
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  Impresión y Generación de Etiquetas
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

          {/* Barra de Modos de Impresión (Oculto en Impresión) */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
            {/* Selector de Modos Solicitados por el Usuario */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                {/* 1. Por Categoría / Tipo de Equipo */}
                <button
                  type="button"
                  onClick={() => setPrintMode('category')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    printMode === 'category'
                      ? 'bg-cpvs-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Por Categoría ({availableCategories.length})</span>
                </button>

                {/* 2. Selección Manual de Etiquetas */}
                <button
                  type="button"
                  onClick={() => setPrintMode('custom')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    printMode === 'custom'
                      ? 'bg-cpvs-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Seleccionar ({selectedEquipmentIds.size})</span>
                </button>

                {/* 3. Reimpresión Individual */}
                <button
                  type="button"
                  onClick={() => setPrintMode('single')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    printMode === 'single'
                      ? 'bg-cpvs-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Individual / Repuesto</span>
                </button>
              </div>

              {/* Selector de Tamaño */}
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600">
                <span className="text-[11px] font-medium text-slate-400">Tamaño:</span>
                <button
                  type="button"
                  onClick={() => setLabelSize('standard')}
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                    labelSize === 'standard' ? 'bg-slate-100 text-cpvs-blue' : 'hover:text-slate-900'
                  }`}
                >
                  70x40 mm
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setLabelSize('compact')}
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                    labelSize === 'compact' ? 'bg-slate-100 text-cpvs-blue' : 'hover:text-slate-900'
                  }`}
                >
                  50x30 mm
                </button>
              </div>
            </div>

            {/* Botón Principal Imprimir */}
            <button
              onClick={handlePrint}
              disabled={loadingQRs || targetEquipmentList.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-cpvs-cyan" />
              <span>Imprimir</span>
            </button>
          </div>

          {/* Subpanel Específico según Modo (Oculto en Impresión) */}
          <div className="no-print">
            {/* Subpanel 1: Categorías / Tipos de Equipo */}
            {printMode === 'category' && (
              <div className="p-3 sm:px-6 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600">Filtrar Lote por Tipo:</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-cpvs-blue text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Todos los Equipos ({fullList.length})
                </button>
                {availableCategories.map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-cpvs-blue text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            )}

            {/* Subpanel 2: Selección Manual con Checkboxes */}
            {printMode === 'custom' && (
              <div className="p-3 sm:px-6 bg-blue-50/50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="font-bold text-cpvs-blue hover:underline cursor-pointer"
                  >
                    Marcar Todos
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="font-bold text-slate-600 hover:underline cursor-pointer"
                  >
                    Desmarcar Todos
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">
                    ({selectedEquipmentIds.size} de {fullList.length} seleccionados)
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filtrar por número, serie..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>
            )}

            {/* Lista desplegable de selección con checkboxes para modo Custom */}
            {printMode === 'custom' && (
              <div className="max-h-36 overflow-y-auto bg-slate-50 border-b border-slate-200 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                {filteredSearchList.map(eq => {
                  const isChecked = selectedEquipmentIds.has(eq.id_equipo);
                  return (
                    <div
                      key={eq.id_equipo}
                      onClick={() => toggleSelectEquipment(eq.id_equipo)}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/80 border-cpvs-blue/40 text-slate-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-cpvs-blue shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        #{eq.numero_sticker || '—'}
                      </span>
                      <span className="truncate">{eq.nombre_articulo}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Subpanel 3: Buscador de Reimpresión de Emergencia (Single) */}
            {printMode === 'single' && (
              <div className="p-3 sm:px-6 bg-blue-50/60 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cpvs-blue shrink-0" />
                  <span className="font-semibold text-slate-800">
                    Buscá el equipo por serie o número para reimprimir su etiqueta dañada:
                  </span>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Ej. 14, R-01, LX-2024-014..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue/30 focus:border-cpvs-blue"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>
            )}

            {/* Lista de selección de equipo para reimpresión individual si se buscó */}
            {printMode === 'single' && searchFilter.trim() !== '' && (
              <div className="max-h-32 overflow-y-auto bg-slate-50 border-b border-slate-200 p-2 space-y-1">
                {filteredSearchList.slice(0, 5).map(eq => (
                  <button
                    key={eq.id_equipo}
                    type="button"
                    onClick={() => {
                      setSelectedSingleEquipment(eq);
                      setSearchFilter('');
                    }}
                    className="w-full text-left p-1.5 px-3 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-bold text-slate-800">#{eq.numero_sticker} - {eq.nombre_articulo}</span>
                    <span className="font-mono text-[11px] text-slate-500">SN: {eq.numero_serie}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Área de Visualización e Impresión de Etiquetas */}
          <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100/60 flex-1 print:p-0 print:bg-white print:overflow-visible">
            {loadingQRs ? (
              <div className="py-16 text-center space-y-3 no-print">
                <div className="w-8 h-8 border-3 border-cpvs-blue/30 border-t-cpvs-blue rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Generando códigos QR vectoriales...</p>
              </div>
            ) : labelsWithQR.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs no-print">
                No hay equipos seleccionados para imprimir.
              </div>
            ) : (
              <div 
                id="printable-labels-area"
                className={`grid gap-4 print:gap-4 ${
                  labelsWithQR.length === 1 
                    ? 'max-w-md mx-auto grid-cols-1'
                    : labelSize === 'standard'
                      ? 'grid-cols-1 md:grid-cols-2 print:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3'
                }`}
              >
                {labelsWithQR.map((item) => (
                  <div
                    key={item.id_equipo}
                    className="label-print-card bg-white border-2 border-black rounded-xl p-3 shadow-sm relative overflow-hidden flex flex-col justify-between break-inside-avoid print:shadow-none print:border-2 print:border-black"
                  >
                    {/* 1. Header Oficial CPVS */}
                    <div className="flex items-center justify-between border-b-2 border-black pb-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src="/logo-cpvs.png" 
                          alt="CPVS" 
                          className="h-3.5 object-contain brightness-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-black">
                          CLÍNICA VÉLEZ SARSFIELD
                        </span>
                      </div>
                      <span className="text-[8px] font-mono font-bold tracking-widest text-black border border-black px-1.5 py-0.2 rounded">
                        GESTIÓN Y TRAZABILIDAD
                      </span>
                    </div>

                    {/* 2. Cuerpo Primordial: NÚMERO DE ALTO CONTRASTE + QR */}
                    <div className="flex items-center justify-between gap-3 flex-1">
                      {/* Número Físico con Tinta Negra Pura de Alto Contraste (Cero lavado en impresión) */}
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                          N° DE EQUIPO
                        </span>
                        <div className="px-2.5 py-0.5 rounded-lg border-2 border-black bg-slate-100 text-black font-mono font-black text-3xl sm:text-4xl tracking-tight leading-none my-1 print:bg-white print:text-black print:border-2 print:border-black">
                          {item.numero_sticker || '—'}
                        </div>
                        <span className="text-[9.5px] font-mono text-black font-bold">
                          SN: {item.numero_serie}
                        </span>
                      </div>

                      {/* QR Vectorial Proporcionado */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        {item.qrDataUrl ? (
                          <img 
                            src={item.qrDataUrl} 
                            alt={`QR ${item.codigo_qr}`} 
                            className="w-20 h-20 object-contain border border-black rounded p-0.5 bg-white print:w-20 print:h-20"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                            QR
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. Pie Técnico Compacto */}
                    <div className="border-t border-slate-300 pt-1 mt-1.5 flex items-center justify-between text-[9px] text-black font-medium">
                      <span className="font-bold truncate max-w-[160px]">
                        {item.nombre_articulo}
                      </span>
                      <span className="text-slate-800 truncate max-w-[120px] text-right font-semibold">
                        {item.nombre_servicio_propietario}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer del Modal (Oculto en Impresión) */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
            <span className="text-[11px] font-medium">
              {labelsWithQR.length} etiquetas listas para imprimir en formato {labelSize === 'standard' ? '70x40 mm' : '50x30 mm'}.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
