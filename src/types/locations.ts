export interface Provincia {
  id: string;
  nombre: string;
}

export interface Municipio {
  id: string;
  nombre: string;
  provincia_id: string;
}

export interface LocationFilters {
  provincia_id?: string;
  municipio_id?: string;
  tipo_vehiculo?: string;
  nombre?: string;
} 