import type { Provincia, Municipio } from '../types/locations';
import api from './axios.config';

/**
 * Obtiene el listado de todas las provincias
 */
export const getProvincias = async (): Promise<Provincia[]> => {
  try {
    const { data } = await api.get<Record<string, string>>('/api/locations/provincias');
    // La API devuelve un objeto { "01": "Pinar del Río", "02": "Artemisa", ... }
    // Necesitamos transformarlo a un array de objetos { id: "01", nombre: "Pinar del Río" }
    if (typeof data === 'object' && data !== null) {
      // Transformar a formato esperado por el frontend
      const provincias: Provincia[] = Object.entries(data).map(([id, nombre]) => ({
        id,
        nombre
      }));
      return provincias;
    } else {
      console.error('La respuesta de provincias no tiene el formato esperado:', data);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    return [];
  }
};

/**
 * Obtiene una provincia específica por su ID
 */
export const getProvincia = async (id: string): Promise<Provincia> => {
  try {
    const { data } = await api.get<Provincia>(`/api/locations/provincias/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener la provincia con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene los municipios de una provincia específica
 */
export const getMunicipiosByProvincia = async (provinciaId: string): Promise<Municipio[]> => {
  try {
    const { data } = await api.get<Record<string, string>>(`/api/locations/municipios/provincia/${provinciaId}`);
    // La API probablemente también devuelva los municipios como objeto
    // { "101": "Plaza de la Revolución", "102": "Centro Habana", ... }
    if (typeof data === 'object' && data !== null) {
      // Transformar a formato esperado por el frontend
      const municipios: Municipio[] = Object.entries(data).map(([id, nombre]) => ({
        id,
        nombre,
        provincia_id: provinciaId
      }));
      return municipios;
    } else if (Array.isArray(data)) {
      // Si por alguna razón ya viene como array, verificar su formato
      return data;
    } else {
      console.error(`La respuesta de municipios para la provincia ${provinciaId} no tiene el formato esperado:`, data);
      return [];
    }
  } catch (error) {
    console.error(`Error al obtener municipios de la provincia ${provinciaId}:`, error);
    return [];
  }
};

/**
 * Obtiene un municipio específico por su ID
 */
export const getMunicipio = async (id: string): Promise<Municipio> => {
  try {
    const { data } = await api.get<Municipio>(`/api/locations/municipios/${id}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener el municipio con ID ${id}:`, error);
    throw error;
  }
}; 