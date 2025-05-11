import axios from 'axios';
import type { Drivers, DriverDetails } from '../types/drivers';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-ruta-directa.e-comcuba.com';

export const getDrivers = async (): Promise<Drivers[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/users`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener conductores:', error);
    throw error;
  }
};

export const getDriverDetails = async (userId: number): Promise<DriverDetails> => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles del conductor:', error);
    throw error;
  }
};

// Aquí se pueden agregar más funciones relacionadas con conductores
// Por ejemplo:
// export const getDriverById = async (id: number): Promise<Drivers> => { ... }
// export const createDriver = async (driver: Omit<Drivers, 'id'>): Promise<Drivers> => { ... }
// export const updateDriver = async (id: number, driver: Partial<Drivers>): Promise<Drivers> => { ... }
// export const deleteDriver = async (id: number): Promise<void> => { ... } 