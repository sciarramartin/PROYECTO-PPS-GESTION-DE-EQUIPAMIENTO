import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MetricCards } from './components/dashboard/MetricCards';
import { ServiceStockBreakdownView } from './components/dashboard/ServiceStockBreakdown';
import { EquipmentTable } from './components/equipment/EquipmentTable';
import { LocationList } from './components/locations/LocationList';
import { Footer } from './components/layout/Footer';
import { api } from './services/api';
import { DashboardSummary, Equipment, Location } from './types';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipos' | 'ubicaciones'>('dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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

  const handleSelectService = (_depositoId: number) => {
    setActiveTab('equipos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cpvs-ice font-sans">
      {/* Barra de Navegación Institucional CPVS */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner de Bienvenida y Acciones de Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-cpvs">
          <div>
            <span className="text-[11px] font-bold text-cpvs-cyan tracking-wider uppercase">
              Día 1 de PPS • Período 16/11/2026 al 18/01/2027
            </span>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Control de Stock y Trazabilidad en Tiempo Real
            </h1>
            <p className="text-xs text-slate-500">
              Gestión centralizada para Alejandra y Supervisión de Guardia 24/7.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors border border-slate-300"
              title="Actualizar datos en vivo"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cpvs-blue' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Notificación de Error si la API no responde */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-l-cpvs-danger rounded text-xs text-red-800 flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-cpvs-danger shrink-0 mt-0.5" />
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

            {/* Vista Rápida del Inventario */}
            <div className="pt-2">
              <EquipmentTable
                equipment={equipment}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
        )}

        {/* Vista: Inventario Completo (US-02, US-06) */}
        {activeTab === 'equipos' && (
          <div className="space-y-4">
            <EquipmentTable
              equipment={equipment}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
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
    </div>
  );
};
export default App;
