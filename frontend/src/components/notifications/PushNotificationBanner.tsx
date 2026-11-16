import React, { useEffect } from 'react';
import { Bell, X, ArrowRight, ShieldCheck, Zap, AlertTriangle, Info } from 'lucide-react';
import { AppNotification } from '../../types';

interface PushNotificationBannerProps {
  notification: AppNotification | null;
  onDismiss: () => void;
  onAction: (notification: AppNotification) => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  notification,
  onDismiss,
  onAction
}) => {
  // Auto-cerrar luego de 8 segundos si no interactúa
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'SUCCESS':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-cpvs-blue" />;
    }
  };

  return (
    <div className="fixed top-2 sm:top-4 inset-x-2 sm:inset-x-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-top-4 duration-200">
      <div 
        onClick={() => onAction(notification)}
        className="bg-slate-900/95 backdrop-blur-md text-white border border-white/20 rounded-2xl p-3.5 shadow-2xl cursor-pointer hover:bg-slate-900 transition-all group"
      >
        {/* Cabecera Tipo Push iOS/Android */}
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
            <div className="w-4 h-4 rounded bg-cpvs-blue flex items-center justify-center">
              <Bell className="w-2.5 h-2.5 text-white" />
            </div>
            <span>Clínica Vélez Sarsfield • Guardia 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Ahora</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-0.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cuerpo de la Notificación */}
        <div className="pt-2 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/10 shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white group-hover:text-cpvs-cyan transition-colors">
              {notification.title}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Botón de Acción Directo */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cpvs-cyan font-bold">
          <span className="flex items-center gap-1 group-hover:underline">
            Tocar para ir directamente a la acción
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
