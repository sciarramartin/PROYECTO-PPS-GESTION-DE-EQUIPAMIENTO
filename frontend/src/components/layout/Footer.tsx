import React from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cpvs-dark text-slate-300 text-xs border-t-4 border-t-cpvs-blue mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identidad Institucional */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-cpvs-cyan" />
              <span className="font-bold text-white text-sm tracking-wide">
                CLÍNICA PRIVADA VÉLEZ SARSFIELD
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Sistema de Gestión, Trazabilidad y Bioseguridad de Equipamiento Biomédico Crítico.
              Desarrollado en el marco del programa de Práctica Profesional Supervisada (PPS) de la Universidad Tecnológica Nacional (UTN - FRC).
            </p>
          </div>

          {/* Sede y Contacto */}
          <div className="space-y-1.5 text-[11px]">
            <span className="font-bold text-white text-xs block mb-1">Sede Central</span>
            <p>Naciones Unidas 984 - Barrio Parque Vélez Sarsfield</p>
            <p>Córdoba Capital, República Argentina</p>
            <p className="text-cpvs-cyan">Gestión de Equipamiento • Alejandra</p>
          </div>

          {/* Estado de Seguridad y Regulatorio */}
          <div className="space-y-1.5 text-[11px]">
            <span className="font-bold text-white text-xs block mb-1">Conformidad Sanitaria</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Protocolo de Bioseguridad LT8 (5 min)</span>
            </div>
            <p className="text-slate-400">
              Compatible con Dirección General de Regulación Sanitaria (Ministerio de Salud de Córdoba).
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
          <p>© 2026 Servicios Médicos S.R.L. - Todos los derechos reservados.</p>
          <p className="font-mono">Martín Sciarra • Legajo 69650 UTN FRC</p>
        </div>
      </div>
    </footer>
  );
};
