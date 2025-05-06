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