export interface Drivers {
  id: number;
  username: string;
  tipo_vehiculo: string;
  capacidad_pasajeros: number;
  disponibilidad: string;
  telefono: string | null;
  municipio_id: string;
  profile_picture: string | null;
  municipio_nombre: string;
  provincia_id: string;
  provincia_nombre: string;
}

export interface DriverDetails {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  profile_picture: string;
  foto_vehiculo: string;
  tipo_vehiculo: string;
  capacidad_pasajeros: number;
  disponibilidad: string;
  ultima_disponibilidad: string;
  municipio_id: string;
  municipio_nombre: string;
  provincia_id: string;
  provincia_nombre: string;
}
