import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

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

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  getProfile: () => Promise<User>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  updateProfilePicture: (file: File) => Promise<User>;
  updateVehiclePicture: (file: File) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const updateUser = (userData: Partial<User>) => {
    setUser(currentUser => 
      currentUser ? { ...currentUser, ...userData } : null
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const getProfile = async (): Promise<User> => {
    const response = await axios.get('/api/users/me');
    const userData = response.data;
    setUser(userData);
    return userData;
  };

  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    const response = await axios.put('/api/users/me', data);
    const userData = response.data;
    setUser(userData);
    return userData;
  };

  const updateProfilePicture = async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.put('/api/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const userData = response.data;
    setUser(userData);
    return userData;
  };

  const updateVehiclePicture = async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('foto_vehiculo', file);

    const response = await axios.put('/api/users/me/vehicle-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const userData = response.data;
    setUser(userData);
    return userData;
  };

  const value = {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    updateUser,
    logout,
    getProfile,
    updateProfile,
    updateProfilePicture,
    updateVehiclePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};