import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-ruta-directa.e-comcuba.com';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      const errorMessage = typeof error.response.data === 'object' && error.response.data !== null
        ? (error.response.data as { message?: string }).message
        : 'Error en la respuesta del servidor';
      throw new Error(errorMessage);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de petición:', error.request);
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error:', error.message);
      throw new Error('Error al realizar la petición');
    }
  }
);

export default api; 