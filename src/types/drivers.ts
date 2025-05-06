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
