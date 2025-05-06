import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { LocationFilters } from '../../types/locations';
import type { Provincia, Municipio } from '../../types/locations';
import { getMunicipiosByProvincia } from '../../services/locations.service';

interface DriversFilterProps {
  onApplyFilters: (filters: LocationFilters) => void;
  onResetFilters: () => void;
  provincias: Provincia[];
  municipios: Municipio[];
  tiposVehiculo: string[];
  isLoading?: boolean;
}

const DriversFilter: React.FC<DriversFilterProps> = ({
  onApplyFilters,
  onResetFilters,
  provincias,
  tiposVehiculo,
  isLoading = false
}) => {
  // Estado local para manejar los valores de los filtros
  const [filters, setFilters] = useState<LocationFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Cargar municipios cuando cambia la provincia
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (filters.provincia_id) {
        setLoadingMunicipios(true);
        try {
          const data = await getMunicipiosByProvincia(filters.provincia_id);
          if (Array.isArray(data)) {
            setMunicipios(data);
          } else {
            console.error('La respuesta de municipios no es un array:', data);
            setMunicipios([]);
          }
        } catch (err) {
          console.error('Error al cargar municipios:', err);
          setMunicipios([]);
        } finally {
          setLoadingMunicipios(false);
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [filters.provincia_id]);

  // Manejador para los cambios en los campos de filtro
  const handleFilterChange = (field: keyof LocationFilters, value: string) => {
    if (field === 'provincia_id' && value !== filters.provincia_id) {
      // Si cambia la provincia, resetear el municipio
      setFilters(prev => ({ ...prev, [field]: value, municipio_id: undefined }));
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  // Manejador para aplicar los filtros
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear objeto de filtros con el término de búsqueda incluido
    const finalFilters: LocationFilters = { ...filters };
    if (searchQuery.trim()) {
      finalFilters.nombre = searchQuery.trim();
    }
    
    console.log('Aplicando filtros:', finalFilters);
    onApplyFilters(finalFilters);
  };

  // Manejador para resetear los filtros
  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setMunicipios([]);
    onResetFilters();
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <form onSubmit={handleApplyFilters} className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4">
        {/* Buscador */}
        <div className="lg:col-span-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre de conductor"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filtro de tipo de vehículo */}
        <div className="lg:col-span-2">
          <select 
            className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={filters.tipo_vehiculo || ''}
            onChange={(e) => handleFilterChange('tipo_vehiculo', e.target.value)}
            disabled={isLoading}
          >
            <option value="">Tipo de vehículo</option>
            {tiposVehiculo.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Filtro de provincia */}
        <div className="lg:col-span-2">
          <select 
            className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={filters.provincia_id || ''}
            onChange={(e) => handleFilterChange('provincia_id', e.target.value)}
            disabled={isLoading}
          >
            <option value="">Todas las provincias</option>
            {provincias.map((provincia) => (
              <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtro de municipio */}
        <div className="lg:col-span-2">
          <select 
            className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-700 ${(!filters.provincia_id || loadingMunicipios) ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={filters.municipio_id || ''}
            onChange={(e) => handleFilterChange('municipio_id', e.target.value)}
            disabled={!filters.provincia_id || loadingMunicipios}
          >
            <option value="">Todos los municipios</option>
            {loadingMunicipios ? (
              <option value="" disabled>Cargando municipios...</option>
            ) : (
              municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>{municipio.nombre}</option>
              ))
            )}
          </select>
        </div>

        {/* Botones de acción */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-2">
          <button 
            type="submit"
            className={`w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-sm flex items-center justify-center font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
            disabled={isLoading}
          >
            <Filter className="mr-2 h-4 w-4" />
            <span>Filtrar</span>
          </button>
          <button 
            type="button"
            className={`w-full px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 shadow-sm flex items-center justify-center font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
            onClick={handleResetFilters}
            disabled={isLoading}
          >
            <span>Limpiar</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriversFilter;