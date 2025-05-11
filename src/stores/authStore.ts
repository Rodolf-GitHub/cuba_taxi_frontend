// src/stores/authStore.ts
import api from '../services/axios.config';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-ruta-directa.e-comcuba.com';

export type VehicleType = 'TAXI' | 'MOTOCICLETA' | 'CAMION' | 'FURGONETA' | 'COCHE' | 'OTRO';
export type DisponibilidadType = 'DISPONIBLE' | 'NO_DISPONIBLE' | 'OCUPADO';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  profile_picture: string | null;
  foto_vehiculo: string | null;
  tipo_vehiculo: VehicleType;
  capacidad_pasajeros: number;
  disponibilidad: DisponibilidadType;
  ultima_disponibilidad: string;
  municipio_id: string;
  municipio_nombre: string;
  provincia_id: string;
  provincia_nombre: string;
}

interface UpdateProfileData {
  tipo_vehiculo: string;
  capacidad_pasajeros: number;
  disponibilidad: string;
  telefono: string;
  municipio_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

class AuthStore {
  private static instance: AuthStore;
  private _user: User | null = null;
  private _token: string | null = null;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    // Inicializar desde localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser) this._user = JSON.parse(savedUser);
    if (savedToken) {
      this._token = savedToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  get user() { return this._user; }
  get token() { return this._token; }
  get isAuthenticated() { return !!(this._user && this._token); }

  setUser(user: User | null) {
    this._user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.notify();
  }

  setToken(token: string | null) {
    this._token = token;
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
    this.notify();
  }

  updateUser(userData: Partial<User>) {
    if (this._user) {
      this.setUser({ ...this._user, ...userData });
    }
  }

  logout() {
    this.setUser(null);
    this.setToken(null);
  }

  async getProfile(): Promise<User> {
    try {
      console.log('Obteniendo perfil desde:', `${API_URL}/api/users/me`);
      const response = await api.get(`${API_URL}/api/users/me`);
      const userData = response.data;
      this.setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put(`${API_URL}/api/users/me`, data);
    const userData = response.data;
    this.setUser(userData);
    return userData;
  }

  async updateProfilePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await api.put(`${API_URL}/api/users/me/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const userData = response.data;
    this.setUser(userData);
    return userData;
  }

  async updateVehiclePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('foto_vehiculo', file);

    const response = await api.put(`${API_URL}/api/users/me/vehicle-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const userData = response.data;
    this.setUser(userData);
    return userData;
  }
}

export const authStore = AuthStore.getInstance();

// Hook para usar en componentes de React
export function useAuthStore() {
  const [, setUpdate] = useState({});

  useEffect(() => {
    return authStore.subscribe(() => setUpdate({}));
  }, []);

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    setUser: authStore.setUser.bind(authStore),
    setToken: authStore.setToken.bind(authStore),
    updateUser: authStore.updateUser.bind(authStore),
    logout: authStore.logout.bind(authStore),
    getProfile: authStore.getProfile.bind(authStore),
    updateProfile: authStore.updateProfile.bind(authStore),
    updateProfilePicture: authStore.updateProfilePicture.bind(authStore),
    updateVehiclePicture: authStore.updateVehiclePicture.bind(authStore)
  };
}