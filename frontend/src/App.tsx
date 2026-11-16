import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MetricCards } from './components/dashboard/MetricCards';
import { ServiceStockBreakdownView } from './components/dashboard/ServiceStockBreakdown';
import { EquipmentTable } from './components/equipment/EquipmentTable';
import { LocationList } from './components/locations/LocationList';
import { MovementsView } from './components/movements/MovementsView';
import { Footer } from './components/layout/Footer';
import { LoanModal } from './components/movements/LoanModal';
import { ReturnModal } from './components/movements/ReturnModal';
import { LabelPrintModal } from './components/equipment/LabelPrintModal';
import { MobileScannerModal } from './components/scanner/MobileScannerModal';
import { PushNotificationBanner } from './components/notifications/PushNotificationBanner';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { Toast, ToastMessage } from './components/common/Toast';
import { api } from './services/api';
import { DashboardSummary, Equipment, Location, AppNotification } from './types';
import { RefreshCw, AlertCircle, Zap, Camera } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipos' | 'traslados' | 'ubicaciones'>('dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modales de Acción (US-05, US-07, US-03)
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(false);
  const [loanPreselectedEquipment, setLoanPreselectedEquipment] = useState<Equipment | null>(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const [returnEquipment, setReturnEquipment] = useState<Equipment | null>(null);

  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);
  const [labelEquipment, setLabelEquipment] = useState<Equipment | null>(null);
  const [labelBatchEquipment, setLabelBatchEquipment] = useState<Equipment[]>([]);

  // Escáner Móvil por Cámara (FAB)
  const [isMobileScannerOpen, setIsMobileScannerOpen] = useState<boolean>(false);

  // Centro de Notificaciones Hospitalarias Push (Android / iPhone)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [bannerNotification, setBannerNotification] = useState<AppNotification | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'WARNING',
      title: 'Bomba #09 superó 17 hs en Habitación',
      message: 'Conectada a paciente en Piso 1 - Hab. 101 Cama A. Tocar para reingresar o certificar protocolo LT8.',
      timestamp: 'Hace 10 min',
      read: false,
      actionType: 'OPEN_RETURN',
      actionPayload: { equipmentId: 9, equipmentCode: '9' }
    },
    {
      id: 'notif-2',
      type: 'ALERT',
      title: 'Stock Crítico en UTI Adultos',
      message: 'Solo quedan 2 bombas de infusión libres en depósito. Se sugiere traslado preventivo.',
      timestamp: 'Hace 45 min',
      read: false,
      actionType: 'OPEN_LOAN',
      actionPayload: { tab: 'dashboard' }
    },
    {
      id: 'notif-3',
      type: 'INFO',
      title: 'Equipo en Service: Respirador R-05',
      message: 'Ingresó a Taller / Mantenimiento hace 5 días. Requiere calibración de volumen.',
      timestamp: 'Hace 2 horas',
      read: true,
      actionType: 'VIEW_EQUIPMENT',
      actionPayload: { tab: 'equipos', equipmentCode: 'R-05' }
    }
  ]);

  // Verificar soporte y estado de notificaciones Push del navegador
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
  }, []);

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermissionStatus(result);
        if (result === 'granted') {
          showToast('success', 'Notificaciones Habilitadas', 'Recibirás avisos de guardia y stock crítico directamente en tu dispositivo.');
          // Disparar notificación nativa de bienvenida
          try {
            new Notification('Clínica Vélez Sarsfield • Guardia 24/7', {
              body: 'Trazabilidad biomédica activa en tu móvil. Se notificarán movimientos y stock.',
              icon: '/logo-cpvs.png'
            });
          } catch {}
        }
      } catch (e) {
        console.error('Error solicitando permisos push:', e);
      }
    }
  };

  const simulateGuardAlert = () => {
    const newNotif: AppNotification = {
      id: `alert-${Date.now()}`,
      type: 'WARNING',
      title: 'Alerta de Guardia: Bomba #10 superó 24 hs',
      message: 'Equipo operando en Piso 1 - Hab. 101 Cama B desde ayer. Tocar para proceder al reingreso sanitario LT8.',
      timestamp: 'Ahora',
      read: false,
      actionType: 'OPEN_RETURN',
      actionPayload: { equipmentId: 10, equipmentCode: '10' }
    };

    setNotifications(prev => [newNotif, ...prev]);
    setBannerNotification(newNotif);

    // Intentar también notificación nativa del OS en Android / iOS si hay permiso
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/logo-cpvs.png'
        });
      } catch {}
    }
  };

  const handleNotificationAction = (notif: AppNotification) => {
    // Marcar como leída
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setBannerNotification(null);
    setIsNotificationCenterOpen(false);

    // Despachar acción al módulo correspondiente
    if (notif.actionType === 'OPEN_RETURN') {
      const eq = equipment.find(e => 
        e.id_equipo === notif.actionPayload?.equipmentId || 
        e.numero_sticker === notif.actionPayload?.equipmentCode
      );
      if (eq) {
        handleOpenReturn(eq);
      } else {
        setActiveTab('traslados');
      }
    } else if (notif.actionType === 'OPEN_LOAN') {
      handleOpenLoan();
    } else if (notif.actionType === 'VIEW_EQUIPMENT') {
      setActiveTab('equipos');
      if (notif.actionPayload?.equipmentCode) {
        setSearchQuery(notif.actionPayload.equipmentCode);
      }
    } else if (notif.actionType === 'NAVIGATE_TAB') {
      setActiveTab(notif.actionPayload?.tab || 'traslados');
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleEquipmentDetected = (detected: Equipment) => {
    setIsMobileScannerOpen(false);
    if (detected.estado_operativo === 'DISPONIBLE') {
      handleOpenLoan(detected);
    } else if (detected.estado_operativo === 'EN_USO') {
      handleOpenReturn(detected);
    } else {
      setActiveTab('equipos');
      setSearchQuery(detected.numero_serie);
      showToast('info', 'Equipo en Mantenimiento', `${detected.nombre_articulo} (${detected.numero_serie}) se encuentra actualmente en Taller.`);
    }
  };

  // Sistema de Notificaciones Toast (Heurística 1 de Nielsen)
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      message
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryData, equipmentData, locationData] = await Promise.all([
        api.getDashboardSummary(),
        api.getAllEquipment(),
        api.getAllLocations()
      ]);
      setSummary(summaryData);
      setEquipment(equipmentData);
      setLocations(locationData);
    } catch (err: any) {
      console.error('Error al cargar datos:', err);
      setError('No se pudo conectar con el servidor de base de datos. Verifica que el backend esté corriendo en http://localhost:3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== '') {
      setActiveTab('equipos');
    }
  };

  const handleFilterCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('equipos');
  };

  const handleSelectService = (depositoId: number) => {
    const svc = summary?.desglose_por_servicio.find(s => s.deposito_id === depositoId);
    if (svc) {
      setSearchQuery(svc.nombre_servicio);
    }
    setActiveTab('equipos');
  };

  // Handlers para abrir modales
  const handleOpenLoan = (eq?: Equipment) => {
    setLoanPreselectedEquipment(eq || null);
    setIsLoanModalOpen(true);
  };

  const handleOpenReturn = (eq: Equipment) => {
    setReturnEquipment(eq);
    setIsReturnModalOpen(true);
  };

  const handleOpenLabel = (eq?: Equipment, batch?: Equipment[]) => {
    setLabelEquipment(eq || null);
    setLabelBatchEquipment(batch || (eq ? [eq] : equipment));
    setIsLabelModalOpen(true);
  };

  const handleMovementSuccess = (message: string) => {
    showToast('success', 'Movimiento Registrado', message);
    loadData(); // Actualización inmediata de contadores en vivo
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7ff] font-sans antialiased">
      {/* Barra de Navegación Institucional CPVS */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-6 pb-28 md:pb-12">
        {/* Encabezado de Página Editorial */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-cpvs-blue tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/80">
                Clínica Privada Vélez Sarsfield
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Gestión y Trazabilidad
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {activeTab === 'dashboard' ? 'Tablero General' :
               activeTab === 'equipos' ? 'Inventario de Equipos Biomédicos' :
               activeTab === 'traslados' ? 'Traslados y Préstamos a Salas' :
               'Catálogo de Sectores y Camas'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Botón Principal Destacado: Asignar Equipo a Sala */}
            <button
              onClick={() => handleOpenLoan()}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cpvs-blue via-blue-600 to-cpvs-cyan hover:from-blue-700 hover:to-teal-600 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              title="Asignar y trasladar equipo a una habitación"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>+ Asignar a Sala</span>
            </button>

            {/* Sincronización */}
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-cpvs-blue transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Sincronizar datos con la base de datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cpvs-blue' : ''}`} />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>
          </div>
        </div>

        {/* Notificación de Error si la API no responde */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-l-rose-500 rounded-xl text-xs text-rose-800 flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error de Conexión:</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Vista: Tablero Principal (US-01) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <MetricCards 
              summary={summary} 
              onFilterCategory={handleFilterCategory}
            />

            <ServiceStockBreakdownView 
              services={summary?.desglose_por_servicio || []} 
              onSelectService={handleSelectService}
            />
          </div>
        )}

        {/* Vista: Inventario Completo (US-02, US-03, US-06) */}
        {activeTab === 'equipos' && (
          <div className="space-y-4">
            <EquipmentTable
              equipment={equipment}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onOpenLoanModal={handleOpenLoan}
              onOpenReturnModal={handleOpenReturn}
              onOpenLabelModal={handleOpenLabel}
            />
          </div>
        )}

        {/* Vista: Traslados y Préstamos a Salas (US-05, US-07) */}
        {activeTab === 'traslados' && (
          <div className="space-y-4">
            <MovementsView
              onOpenLoanModal={handleOpenLoan}
              onOpenReturnModal={handleOpenReturn}
              equipmentList={equipment}
            />
          </div>
        )}

        {/* Vista: Ubicaciones Unificadas (US-04) */}
        {activeTab === 'ubicaciones' && (
          <div className="space-y-4">
            <LocationList locations={locations} />
          </div>
        )}
      </main>

      {/* Footer Oficial */}
      <Footer />

      {/* BOTÓN FLOTANTE (FAB) PARA MÓVIL: ESCÁNER CON CÁMARA */}
      <div className="md:hidden fixed bottom-16 right-4 z-40">
        <button
          onClick={() => setIsMobileScannerOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cpvs-blue via-blue-600 to-cpvs-cyan text-white font-bold text-xs rounded-full shadow-2xl active:scale-90 transition-all border-2 border-white cursor-pointer ring-4 ring-cpvs-blue/20"
          title="Escanear sticker o código con la cámara del celular"
        >
          <Camera className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Escanear con Cámara</span>
        </button>
      </div>

      {/* Escáner Móvil de Cámara (Cámara Trasera + Retícula Láser) */}
      <MobileScannerModal
        isOpen={isMobileScannerOpen}
        onClose={() => setIsMobileScannerOpen(false)}
        equipmentList={equipment}
        onEquipmentDetected={handleEquipmentDetected}
      />

      {/* Banner Emergente Tipo Push (Android / iOS) */}
      <PushNotificationBanner
        notification={bannerNotification}
        onDismiss={() => setBannerNotification(null)}
        onAction={handleNotificationAction}
      />

      {/* Centro de Notificaciones Hospitalarias (Alertas 24/7 y Stock Crítico) */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationAction}
        onMarkAllAsRead={markAllNotificationsAsRead}
        onRequestPushPermission={requestPushPermission}
        onSimulateNotification={simulateGuardAlert}
        permissionStatus={permissionStatus}
      />

      {/* Modales de Flujos Operativos */}
      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        equipmentList={equipment}
        locationList={locations}
        preselectedEquipment={loanPreselectedEquipment}
        onSuccess={handleMovementSuccess}
      />

      <ReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        equipment={returnEquipment}
        onSuccess={handleMovementSuccess}
      />

      <LabelPrintModal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        equipment={labelEquipment}
        batchEquipment={labelBatchEquipment}
        allEquipment={equipment}
      />

      {/* Sistema de Notificaciones Reactivas Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default App;
