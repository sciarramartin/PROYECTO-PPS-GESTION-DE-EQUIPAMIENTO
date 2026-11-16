import React from 'react';
import { Activity, User, Search, Building2, Monitor } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'equipos' | 'ubicaciones';
  setActiveTab: (tab: 'dashboard' | 'equipos' | 'ubicaciones') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearchSubmit
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-cpvs-header">
      {/* Barra Superior con Sesión de Usuario (Color Oficial #07599b) */}
      <div className="bg-cpvs-blue text-white text-xs px-4 sm:px-8 py-1 flex justify-end items-center">
        <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-0.5 rounded text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <User className="w-3.5 h-3.5 text-blue-200" />
          <span className="font-semibold text-white tracking-wide">
            Alejandra
          </span>
          <span className="text-blue-200 text-[10px] hidden sm:inline">(Admin / Guardia 24/7)</span>
        </div>
      </div>

      {/* Barra Principal de Navegación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logotipo Oficial */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img 
              src="/logo-cpvs.png" 
              alt="Clínica Privada Vélez Sarsfield" 
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="border-l border-slate-300 pl-3">
              <h1 className="text-sm font-bold text-cpvs-blue leading-tight uppercase tracking-tight">
                Trazabilidad Biomédica
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Gestión y Bioseguridad de Equipos
              </p>
            </div>
          </div>

          {/* Buscador Rápido (US-06: Localización en <2 seg) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por Sticker (ej. 14) o N° de Serie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-10 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-cpvs-cyan focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Navegación por Pestañas */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-cpvs-cyan text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-cpvs-blue'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Tablero Stock</span>
            </button>

            <button
              onClick={() => setActiveTab('equipos')}
              className={`px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'equipos'
                  ? 'bg-cpvs-cyan text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-cpvs-blue'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Inventario (64)</span>
            </button>

            <button
              onClick={() => setActiveTab('ubicaciones')}
              className={`px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'ubicaciones'
                  ? 'bg-cpvs-cyan text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-cpvs-blue'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Ubicaciones (17)</span>
            </button>
          </nav>
        </div>

        {/* Buscador Rápido Mobile (Visible solo en smartphones) */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar Sticker (1..32) o Serie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-cpvs-cyan focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>
    </header>
  );
};
