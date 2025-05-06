import axios from 'axios';
import type { User } from '../stores/authStore';

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

export const getProfile = async (): Promise<User> => {
  const response = await axios.get('/api/users/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await axios.put('/api/users/me', data);
  return response.data;
};

export const updateProfilePicture = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('profile_picture', file);

  const response = await axios.put('/api/users/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateVehiclePicture = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('foto_vehiculo', file);

  const response = await axios.put('/api/users/me/vehicle-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}; 