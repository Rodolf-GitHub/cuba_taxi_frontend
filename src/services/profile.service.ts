import axios from 'axios';
import type { User } from '../types/user';

export const getProfile = async (): Promise<User> => {
  const response = await axios.get('/api/users/me');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
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