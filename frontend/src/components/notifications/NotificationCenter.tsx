import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onNotificationClick: (notif: AppNotification) => void;
  onMarkAllAsRead: () => void;
  onRequestPushPermission: () => void;
  onSimulateNotification: () => void;
  permissionStatus: NotificationPermission | 'unsupported';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onMarkAllAsRead,
  onRequestPushPermission,
  onSimulateNotification,
  permissionStatus
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-right-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cpvs-navy to-cpvs-blue p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-cpvs-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Centro de Alertas Hospitalarias</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px]">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">Guardia 24/7 y stock crítico en tiempo real</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Controles y Estado Push */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          {permissionStatus === 'granted' ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Push Activo en este móvil
            </span>
          ) : (
            <button
              onClick={onRequestPushPermission}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-cpvs-blue hover:underline cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Activar Notificaciones en Celular</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateNotification}
              className="px-2 py-1 bg-white hover:bg-blue-50 text-cpvs-blue border border-slate-200 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 shadow-2xs active:scale-95"
              title="Disparar notificación de prueba de guardia"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Probar Push</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-slate-500 hover:text-slate-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Leídas</span>
              </button>
            )}
          </div>
        </div>

        {/* Lista de Notificaciones */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Sin alertas pendientes de guardia</p>
              <p className="text-[11px] text-slate-400">Todos los equipos y stocks operan con normalidad.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick(notif)}
                className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-2 ${
                  !notif.read 
                    ? 'bg-blue-50/70 border border-blue-200/80 shadow-2xs' 
                    : 'bg-white hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${
                      notif.type === 'WARNING' || notif.type === 'ALERT'
                        ? 'bg-amber-100 text-amber-800'
                        : notif.type === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-cpvs-blue'
                    }`}>
                      {notif.type === 'WARNING' || notif.type === 'ALERT' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                  {notif.message}
                </p>

                {/* Botón de Acción en Fila */}
                <div className="pl-7 pt-1 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cpvs-blue hover:text-blue-700">
                    <span>
                      {notif.actionType === 'OPEN_RETURN' ? 'Proceder a Reingreso' :
                       notif.actionType === 'OPEN_LOAN' ? 'Asignar Equipo para Cubrir Guardia' :
                       notif.actionType === 'VIEW_EQUIPMENT' ? 'Ver Ficha del Equipo' :
                       'Ir a Traslados'}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Clínica Privada Vélez Sarsfield • Alertas 24/7</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
