import React from 'react';
import { Activity, User, Search, Building2, Monitor, ArrowLeftRight } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'equipos' | 'traslados' | 'ubicaciones';
  setActiveTab: (tab: 'dashboard' | 'equipos' | 'traslados' | 'ubicaciones') => void;
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
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
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('dashboard')}>
            <img 
              src="/logo-cpvs.png" 
              alt="Clínica Privada Vélez Sarsfield" 
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="border-l border-slate-200 pl-3">
              <h1 className="text-sm font-bold text-cpvs-blue leading-tight uppercase tracking-tight">
                Trazabilidad Biomédica
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Gestión y Bioseguridad de Equipos
              </p>
            </div>
          </div>

          {/* Buscador Rápido (US-06) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por N° Equipo o N° de Serie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cpvs-blue/20 focus:border-cpvs-blue focus:bg-white transition-all shadow-xs placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <div className="absolute right-2.5 top-2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                    Ctrl K
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Navegación por Pestañas (Segmented Control moderno) */}
          <nav className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-cpvs-blue shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Activity className="w-4 h-4 text-cpvs-blue" />
              <span>Tablero</span>
            </button>

            <button
              onClick={() => setActiveTab('equipos')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'equipos'
                  ? 'bg-white text-cpvs-blue shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Monitor className="w-4 h-4 text-cpvs-blue" />
              <span>Inventario</span>
            </button>

            <button
              onClick={() => setActiveTab('traslados')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'traslados'
                  ? 'bg-white text-cpvs-blue shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-cpvs-blue" />
              <span>Traslados</span>
            </button>

            <button
              onClick={() => setActiveTab('ubicaciones')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ubicaciones'
                  ? 'bg-white text-cpvs-blue shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Building2 className="w-4 h-4 text-cpvs-blue" />
              <span>Sectores</span>
            </button>
          </nav>
        </div>

        {/* Buscador Rápido Mobile (Visible solo en smartphones) */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por N° Equipo o N° de Serie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cpvs-blue focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
