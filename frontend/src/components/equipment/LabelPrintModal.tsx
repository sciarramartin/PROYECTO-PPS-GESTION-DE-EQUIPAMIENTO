import React, { useState, useEffect } from 'react';
import { X, Printer, QrCode, Tag, Layers, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { Equipment } from '../../types';

interface LabelPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  batchEquipment?: Equipment[];
}

interface EquipmentWithQR extends Equipment {
  qrDataUrl: string;
}

export const LabelPrintModal: React.FC<LabelPrintModalProps> = ({
  isOpen,
  onClose,
  equipment,
  batchEquipment = []
}) => {
  const [printMode, setPrintMode] = useState<'single' | 'batch'>('single');
  const [labelsWithQR, setLabelsWithQR] = useState<EquipmentWithQR[]>([]);
  const [loadingQRs, setLoadingQRs] = useState<boolean>(true);
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');

  useEffect(() => {
    if (isOpen) {
      if (equipment) {
        setPrintMode('single');
      } else if (batchEquipment.length > 0) {
        setPrintMode('batch');
      }
    }
  }, [isOpen, equipment, batchEquipment]);

  // Generar QRs dinámicos
  useEffect(() => {
    if (!isOpen) return;

    const generateQRs = async () => {
      setLoadingQRs(true);
      const list = printMode === 'single' && equipment ? [equipment] : batchEquipment;

      const itemsWithQR: EquipmentWithQR[] = await Promise.all(
        list.map(async (eq) => {
          try {
            // El QR contiene el token único del equipo (que la app móvil escanea en 1 segundo)
            const qrDataUrl = await QRCode.toDataURL(eq.codigo_qr, {
              width: 180,
              margin: 1,
              color: {
                dark: '#0a192f',
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
  }, [isOpen, printMode, equipment, batchEquipment]);

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
      {/* Estilos específicos de impresión: Ocultar todo excepto el contenedor de etiquetas */}
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
            padding: 10mm;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 8mm;
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
                  Identificación Física Dual (US-03)
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  Generador de Etiquetas Autoadhesivas (Sticker + QR)
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

          {/* Barra de Controles de Impresión */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {/* Selector de Modo (Individual vs Lote) */}
              {batchEquipment.length > 1 && (
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
                    Equipo Actual
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
              )}

              {/* Selector de Tamaño de Etiqueta */}
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600">
                <span className="text-[11px] font-medium text-slate-400">Formato:</span>
                <button
                  type="button"
                  onClick={() => setLabelSize('standard')}
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                    labelSize === 'standard' ? 'bg-slate-100 text-cpvs-blue' : 'hover:text-slate-900'
                  }`}
                >
                  70x40mm
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setLabelSize('compact')}
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                    labelSize === 'compact' ? 'bg-slate-100 text-cpvs-blue' : 'hover:text-slate-900'
                  }`}
                >
                  50x30mm
                </button>
              </div>
            </div>

            <button
              onClick={handlePrint}
              disabled={loadingQRs || labelsWithQR.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-cpvs-cyan" />
              <span>Imprimir {labelsWithQR.length} {labelsWithQR.length === 1 ? 'Etiqueta' : 'Etiquetas'}</span>
            </button>
          </div>

          {/* Área de Visualización y Previsualización de Etiquetas */}
          <div className="p-6 overflow-y-auto bg-slate-100/60 flex-1">
            {loadingQRs ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-cpvs-blue/30 border-t-cpvs-blue rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Generando códigos QR de alta densidad...</p>
              </div>
            ) : labelsWithQR.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No hay equipos seleccionados para generar etiquetas.
              </div>
            ) : (
              <div 
                id="printable-labels-area"
                className={`grid gap-4 ${
                  labelSize === 'standard'
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {labelsWithQR.map((item) => (
                  <div
                    key={item.id_equipo}
                    className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between break-inside-avoid print:shadow-none print:border-2 print:border-black"
                    style={{ minHeight: labelSize === 'standard' ? '155px' : '130px' }}
                  >
                    {/* Header Institucional CPVS */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src="/logo-cpvs.png" 
                          alt="CPVS" 
                          className="h-4 object-contain brightness-0"
                          onError={(e) => {
                            // Fallback visual si la imagen tarda en cargar
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                          CLÍNICA VÉLEZ SARSFIELD
                        </span>
                      </div>
                      <span className="text-[8px] font-mono font-bold tracking-widest text-slate-600 bg-slate-100 px-1 py-0.5 rounded print:border print:border-slate-400">
                        BIOMÉDICO
                      </span>
                    </div>

                    {/* Cuerpo de la Etiqueta: Número Gigante + QR + Info */}
                    <div className="flex items-center justify-between gap-3 flex-1">
                      {/* Bloque Izquierdo: Número Visible Grande */}
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          N° DE STICKER
                        </span>
                        <div className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono font-black text-3xl sm:text-4xl tracking-tight leading-none my-1 shadow-xs print:bg-black print:text-white">
                          {item.numero_sticker || '—'}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 font-bold">
                          SN: {item.numero_serie}
                        </span>
                      </div>

                      {/* Bloque Derecho: QR de Alta Densidad */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        {item.qrDataUrl ? (
                          <img 
                            src={item.qrDataUrl} 
                            alt={`QR ${item.codigo_qr}`} 
                            className="w-20 h-20 object-contain border border-slate-300 rounded p-0.5 bg-white print:border-black"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                            QR
                          </div>
                        )}
                        <span className="text-[8px] font-mono text-slate-500 mt-0.5 truncate max-w-[90px]">
                          {item.codigo_qr}
                        </span>
                      </div>
                    </div>

                    {/* Pie de Etiqueta: Modelo y Servicio Propietario */}
                    <div className="border-t border-slate-200 pt-1.5 mt-2 flex items-center justify-between text-[9px] text-slate-700 font-medium">
                      <span className="font-bold truncate max-w-[160px] text-slate-900">
                        {item.nombre_articulo}
                      </span>
                      <span className="text-slate-500 truncate max-w-[120px] text-right">
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
              Formato optimizado para impresión térmica o papel autoadhesivo A4 troquelado.
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
