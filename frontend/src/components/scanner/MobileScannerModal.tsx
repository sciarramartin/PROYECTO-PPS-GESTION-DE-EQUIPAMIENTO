import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  Flashlight, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Equipment } from '../../types';
import { formatEquipmentCode } from '../equipment/EquipmentTable';

interface MobileScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onEquipmentDetected: (equipment: Equipment) => void;
}

export const MobileScannerModal: React.FC<MobileScannerModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  onEquipmentDetected
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [detectedEquipment, setDetectedEquipment] = useState<Equipment | null>(null);

  // Reproducir beep suave hospitalario al detectar código
  const playScanChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
      }
    } catch {
      // AudioContext blocked or not available
    }
  };

  // Inicializar cámara trasera
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setDetectedEquipment(null);
      setManualCode('');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('El navegador no soporta acceso directo a la cámara.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      // Comprobar soporte de linterna (Torch)
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : null;
      if (capabilities && (capabilities as unknown as { torch?: boolean }).torch) {
        setTorchSupported(true);
      }
    } catch (err: unknown) {
      console.warn('Cámara física no disponible o permiso denegado:', err);
      setCameraError('No se pudo acceder a la cámara física (o estás en un emulador). Podés usar el simulador rápido táctil debajo.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as unknown as MediaTrackConstraintSet]
      });
      setTorchOn(!torchOn);
    } catch {
      // Torch not supported
    }
  };

  // Procesar código detectado (sea por cámara, pistola o simulador)
  const handleCodeFound = (code: string) => {
    const clean = code.trim().toLowerCase();
    if (!clean) return;

    // Buscar en equipmentList por sticker, código qr, o serie
    const found = equipmentList.find(eq => {
      const sticker = (eq.numero_sticker || '').toLowerCase();
      const qr = (eq.codigo_qr || '').toLowerCase();
      const serie = (eq.numero_serie || '').toLowerCase();
      const formatted = formatEquipmentCode(eq.numero_sticker).toLowerCase();

      return (
        sticker === clean ||
        qr === clean ||
        serie === clean ||
        formatted === clean ||
        clean.includes(sticker) ||
        clean.includes(qr) ||
        clean.includes(serie)
      );
    });

    if (found) {
      playScanChime();
      setDetectedEquipment(found);
    } else {
      setCameraError(`Código "${code}" no registrado en el parque biomédico.`);
    }
  };

  const confirmAction = () => {
    if (detectedEquipment) {
      const eq = detectedEquipment;
      stopCamera();
      onClose();
      onEquipmentDetected(eq);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-200">
      {/* Barra Superior con Controles Táctiles */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cpvs-blue flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Escáner Móvil de Equipos</h2>
            <p className="text-[10px] text-slate-400">Apuntá al sticker o código QR pegado en la máquina</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {torchSupported && (
            <button
              onClick={toggleTorch}
              className={`p-2 rounded-full border transition-all ${
                torchOn ? 'bg-amber-400 text-black border-amber-300' : 'bg-white/10 text-white border-white/20'
              }`}
              title="Linterna"
            >
              <Flashlight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            aria-label="Cerrar escáner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visor de Cámara Central */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        {/* Elemento de Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Marco Cuadrado de Enfoque con Línea Láser Animada */}
        <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/50 rounded-2xl flex flex-col items-center justify-between p-3 shadow-2xl backdrop-blur-[1px]">
          {/* Esquinas Marcadoras Hospitalarias */}
          <div className="w-full flex justify-between">
            <div className="w-6 h-6 border-t-4 border-l-4 border-cpvs-cyan rounded-tl-lg" />
            <div className="w-6 h-6 border-t-4 border-r-4 border-cpvs-cyan rounded-tr-lg" />
          </div>

          {/* Línea Láser de Escaneo */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cpvs-cyan to-transparent animate-pulse shadow-[0_0_12px_#14b8a6]" />

          <div className="w-full flex justify-between">
            <div className="w-6 h-6 border-b-4 border-l-4 border-cpvs-cyan rounded-bl-lg" />
            <div className="w-6 h-6 border-b-4 border-r-4 border-cpvs-cyan rounded-br-lg" />
          </div>

          {/* Guía en el centro del marco */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <QrCode className="w-16 h-16 text-white/20" />
          </div>
        </div>

        {/* Notificación de Error o Modo Emulador */}
        {cameraError && (
          <div className="absolute top-4 inset-x-4 z-20 p-3 rounded-xl bg-amber-500/90 text-black text-xs font-semibold backdrop-blur-md flex items-center gap-2 shadow-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>

      {/* Ficha Flotante de Detección Inmediata */}
      {detectedEquipment ? (
        <div className="p-4 bg-slate-900 border-t border-white/10 space-y-3 animate-in slide-in-from-bottom-6 duration-200">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-cpvs-blue font-mono font-black text-base text-white shadow-md">
                {formatEquipmentCode(detectedEquipment.numero_sticker)}
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">{detectedEquipment.nombre_articulo}</h4>
                <p className="text-[11px] font-mono text-slate-400">SN: {detectedEquipment.numero_serie}</p>
                <p className="text-[11px] text-cpvs-cyan font-medium">Ubicación: {detectedEquipment.nombre_ubicacion_actual}</p>
              </div>
            </div>

            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              detectedEquipment.estado_operativo === 'DISPONIBLE'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : detectedEquipment.estado_operativo === 'EN_USO'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {detectedEquipment.estado_operativo === 'DISPONIBLE' ? 'Listo p/ Sala' :
               detectedEquipment.estado_operativo === 'EN_USO' ? 'En Paciente' : 'En Taller'}
            </span>
          </div>

          {/* Botón de Acción Automático según Estado del Equipo */}
          {detectedEquipment.estado_operativo === 'DISPONIBLE' && (
            <button
              onClick={confirmAction}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Continuar con: Asignar equipo a sala</span>
            </button>
          )}

          {detectedEquipment.estado_operativo === 'EN_USO' && (
            <button
              onClick={confirmAction}
              className="w-full py-3 px-4 bg-cpvs-blue hover:bg-blue-600 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Continuar con: Reingreso</span>
            </button>
          )}

          {detectedEquipment.estado_operativo === 'EN_MANTENIMIENTO' && (
            <button
              onClick={confirmAction}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Ver Ficha en Taller / Mantenimiento</span>
            </button>
          )}
        </div>
      ) : (
        /* Panel Rápido: Acceso Manual y Simulador de Guardia Móvil */
        <div className="p-4 bg-slate-900 border-t border-white/10 space-y-3">
          {/* Ingreso manual de número o código si no hay cámara */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ingresá N° sticker (ej. 09, R-01, 14)..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCodeFound(manualCode);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cpvs-cyan"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              onClick={() => handleCodeFound(manualCode)}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold text-white rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Detectar
            </button>
          </div>

          {/* Atajos Rápidos de Demostración para F12 / Pruebas */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Simular escaneo de sticker físico (Tocar para probar):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleCodeFound('09')}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-white block">#09 (En Uso)</span>
                  <span className="text-[10px] text-slate-400">Bomba Lexx en Hab. 101</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </button>

              <button
                type="button"
                onClick={() => handleCodeFound('R-01')}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-white block">R-01 (Libre)</span>
                  <span className="text-[10px] text-slate-400">Respirador UTI</span>
                </div>
                <Zap className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
