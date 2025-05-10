import axios from 'axios';
import { authStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  telefono: string;
  tipo_vehiculo: string;
  capacidad_pasajeros: number;
  disponibilidad: string;
  municipio_id: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, data);
    // Actualizar el store con el token y obtener el perfil
    authStore.setToken(response.data.access_token);
    await authStore.getProfile(); // Esto actualizará el usuario en el store
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

export const logout = () => {
  authStore.logout();
};