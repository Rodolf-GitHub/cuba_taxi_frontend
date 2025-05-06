import type { Drivers } from '../types/drivers';
import api from './axios.config';

export const getDrivers = async (): Promise<Drivers[]> => {
  try {
    const { data } = await api.get<Drivers[]>('/api/users');
    return data;
  } catch (error) {
    console.error('Error en getDrivers:', error);
    throw error;
  }
};

// Aquí se pueden agregar más funciones relacionadas con conductores
// Por ejemplo:
// export const getDriverById = async (id: number): Promise<Drivers> => { ... }
// export const createDriver = async (driver: Omit<Drivers, 'id'>): Promise<Drivers> => { ... }
// export const updateDriver = async (id: number, driver: Partial<Drivers>): Promise<Drivers> => { ... }
// export const deleteDriver = async (id: number): Promise<void> => { ... } 