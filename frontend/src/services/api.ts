import { DashboardSummary, Equipment, Location, Movement, CreateLoanDTO, CreateReturnDTO } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE_URL}/dashboard/resumen`);
    if (!res.ok) throw new Error('Error al obtener métricas del dashboard');
    const json = await res.json();
    return json.data;
  },

  async getAllEquipment(filters?: { estado?: string; categoria?: string; deposito_id?: number }): Promise<Equipment[]> {
    const params = new URLSearchParams();
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.categoria) params.append('categoria', filters.categoria);
    if (filters?.deposito_id) params.append('deposito_id', filters.deposito_id.toString());

    const res = await fetch(`${API_BASE_URL}/equipos?${params.toString()}`);
    if (!res.ok) throw new Error('Error al cargar inventario de equipos');
    const json = await res.json();
    return json.data;
  },

  async searchEquipment(query: string): Promise<Equipment[]> {
    const res = await fetch(`${API_BASE_URL}/equipos/buscar?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Error en búsqueda de equipo');
    const json = await res.json();
    return json.data;
  },

  async getAllLocations(filters?: { tipo?: string }): Promise<Location[]> {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);

    const res = await fetch(`${API_BASE_URL}/ubicaciones?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener catálogo de ubicaciones');
    const json = await res.json();
    return json.data;
  },

  async createLoan(dto: CreateLoanDTO): Promise<{ success: boolean; message: string; data: Movement }> {
    const res = await fetch(`${API_BASE_URL}/movimientos/prestamo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Error al registrar el préstamo del equipo');
    }
    return json;
  },

  async createReturn(dto: CreateReturnDTO): Promise<{ success: boolean; message: string; data: Movement }> {
    const res = await fetch(`${API_BASE_URL}/movimientos/retorno`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Error al registrar el reingreso con bioseguridad LT8');
    }
    return json;
  },

  async getActiveMovements(): Promise<Movement[]> {
    const res = await fetch(`${API_BASE_URL}/movimientos/activos`);
    if (!res.ok) throw new Error('Error al obtener préstamos activos');
    const json = await res.json();
    return json.data;
  },

  async getMovementHistory(id_equipo?: number): Promise<Movement[]> {
    const url = id_equipo 
      ? `${API_BASE_URL}/movimientos/historial?id_equipo=${id_equipo}`
      : `${API_BASE_URL}/movimientos/historial`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener historial de movimientos');
    const json = await res.json();
    return json.data;
  },

  async getActiveMovementByEquipment(id_equipo: number): Promise<Movement | null> {
    const res = await fetch(`${API_BASE_URL}/movimientos/equipo/${id_equipo}`);
    if (!res.ok) throw new Error('Error al consultar estado de préstamo');
    const json = await res.json();
    return json.data;
  }
};
