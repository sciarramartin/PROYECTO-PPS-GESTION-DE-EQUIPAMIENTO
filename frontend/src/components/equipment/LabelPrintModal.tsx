import React, { useState, useEffect, useMemo } from 'react';
import { X, Printer, Tag, Layers, Search, Check, RefreshCw } from 'lucide-react';
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
  const [printMode, setPrintMode] = useState<'single' | 'batch'>('single');
  const [selectedSingleEquipment, setSelectedSingleEquipment] = useState<Equipment | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [labelsWithQR, setLabelsWithQR] = useState<EquipmentWithQR[]>([]);
  const [loadingQRs, setLoadingQRs] = useState<boolean>(true);
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');

  // Inicializar estado al abrir el modal
  useEffect(() => {
    if (isOpen) {
      if (equipment) {
        setPrintMode('single');
        setSelectedSingleEquipment(equipment);
      } else if (batchEquipment.length > 0) {
        setPrintMode('batch');
        setSelectedSingleEquipment(batchEquipment[0]);
      }
      setSearchFilter('');
    }
  }, [isOpen, equipment, batchEquipment]);

  // Lista base para búsqueda
  const fullList = allEquipment.length > 0 ? allEquipment : batchEquipment;

  // Filtrado de equipos para selección individual
  const searchedEquipmentList = useMemo(() => {
    if (!searchFilter.trim()) return fullList;
    const term = searchFilter.toLowerCase().trim();
    return fullList.filter(eq => 
      eq.numero_sticker?.toLowerCase().includes(term) ||
      eq.numero_serie.toLowerCase().includes(term) ||
      eq.nombre_articulo.toLowerCase().includes(term)
    );
  }, [fullList, searchFilter]);

  // Generar QRs de alta densidad
  useEffect(() => {
    if (!isOpen) return;

    const generateQRs = async () => {
      setLoadingQRs(true);
      const listToRender = printMode === 'single'
        ? (selectedSingleEquipment ? [selectedSingleEquipment] : [])
        : batchEquipment;

      const itemsWithQR: EquipmentWithQR[] = await Promise.all(
        listToRender.map(async (eq) => {
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

      setLabelsWithQR(itemsWithQR);
      setLoadingQRs(false);
    };

    generateQRs();
  }, [isOpen, printMode, selectedSingleEquipment, batchEquipment]);

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

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Estilos específicos de impresión */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-labels-area, #printable-labels-area * {
            visibility: visible;
          }
          #printable-labels-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 8mm;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 6mm;
            size: auto;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 no-print">
        <div 
          className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Modal */}
          <div className="bg-gradient-to-r from-slate-900 via-cpvs-navy to-cpvs-blue p-4 sm:p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Tag className="w-5 h-5 text-cpvs-cyan" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Rotulación Física Oficial
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  Generador e Impresión de Etiquetas (Sticker + QR)
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

          {/* Barra de Controles y Selección */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Selector de Modo */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setPrintMode('single')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    printMode === 'single'
                      ? 'bg-cpvs-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Etiqueta Individual (Reimpresión)
                </button>
                <button
                  type="button"
                  onClick={() => setPrintMode('batch')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    printMode === 'batch'
                      ? 'bg-cpvs-blue text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Lote Completo ({batchEquipment.length})</span>
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

            {/* Botón Imprimir */}
            <button
              onClick={handlePrint}
              disabled={loadingQRs || labelsWithQR.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-cpvs-cyan" />
              <span>Imprimir {labelsWithQR.length === 1 ? 'Etiqueta' : `${labelsWithQR.length} Etiquetas`}</span>
            </button>
          </div>

          {/* En modo individual: Buscador de Reimpresión de Emergencia */}
          {printMode === 'single' && (
            <div className="p-3 sm:px-6 bg-blue-50/60 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cpvs-blue shrink-0" />
                <span className="font-semibold text-slate-800">
                  ¿Se borró o despegó un sticker? Buscá el equipo por serie o número para reimprimirlo:
                </span>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Ej. 14, LX-2024-014..."
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
              {searchedEquipmentList.slice(0, 5).map(eq => (
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

          {/* Área de Visualización e Impresión de Etiquetas */}
          <div className="p-6 overflow-y-auto bg-slate-100/60 flex-1">
            {loadingQRs ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-cpvs-blue/30 border-t-cpvs-blue rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Generando códigos QR vectoriales...</p>
              </div>
            ) : labelsWithQR.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No hay equipos seleccionados para imprimir.
              </div>
            ) : (
              <div 
                id="printable-labels-area"
                className={`grid gap-4 ${
                  labelsWithQR.length === 1 
                    ? 'max-w-md mx-auto grid-cols-1'
                    : labelSize === 'standard'
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {labelsWithQR.map((item) => (
                  <div
                    key={item.id_equipo}
                    className="bg-white border-2 border-black rounded-xl p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between break-inside-avoid print:shadow-none print:border-2 print:border-black"
                    style={{ minHeight: labelSize === 'standard' ? '150px' : '125px' }}
                  >
                    {/* 1. Header Oficial CPVS (Limpio) */}
                    <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src="/logo-cpvs.png" 
                          alt="CPVS" 
                          className="h-4 object-contain brightness-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[11px] font-black uppercase tracking-wider text-black">
                          CLÍNICA VÉLEZ SARSFIELD
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-black border border-black px-1.5 py-0.2 rounded">
                        BIOMÉDICO
                      </span>
                    </div>

                    {/* 2. Cuerpo Primordial: NÚMERO GIGANTE + QR GRANDE */}
                    <div className="flex items-center justify-between gap-4 flex-1">
                      {/* Número Gigante */}
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                          N° DE EQUIPO
                        </span>
                        <div className="px-3.5 py-1 rounded-xl bg-black text-white font-mono font-black text-4xl sm:text-5xl tracking-tight leading-none my-1 shadow-xs print:bg-black print:text-white">
                          {item.numero_sticker || '—'}
                        </div>
                        <span className="text-[10px] font-mono text-black font-bold">
                          SN: {item.numero_serie}
                        </span>
                      </div>

                      {/* QR Grande de Alta Densidad */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        {item.qrDataUrl ? (
                          <img 
                            src={item.qrDataUrl} 
                            alt={`QR ${item.codigo_qr}`} 
                            className="w-24 h-24 object-contain border border-black rounded p-0.5 bg-white print:w-24 print:h-24"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                            QR
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. Pie Técnico Compacto (Sin micro-textos) */}
                    <div className="border-t border-slate-300 pt-1.5 mt-2 flex items-center justify-between text-[10px] text-black font-medium">
                      <span className="font-bold truncate max-w-[180px]">
                        {item.nombre_articulo}
                      </span>
                      <span className="text-slate-600 truncate max-w-[130px] text-right font-medium">
                        {item.nombre_servicio_propietario}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer del Modal */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
            <span className="text-[11px]">
              {printMode === 'single'
                ? `Imprimiendo etiqueta de repuesto para equipo #${selectedSingleEquipment?.numero_sticker || '—'}`
                : `Plancha de ${batchEquipment.length} etiquetas listas para imprimir.`
              }
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
