import { useState, useEffect } from 'react';
import { Users, Shield } from 'lucide-react';
import type { Drivers } from '../types/drivers';
import type { Provincia, Municipio, LocationFilters } from '../types/locations';
import { getDrivers } from '../services/drivers.service';
import { getProvincias, getMunicipiosByProvincia } from '../services/locations.service';
import DriversFilter from '../components/filters/DriversFilter';
import DriversList from '../components/home/DriversList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Home = () => {
  // Estados para la lista de conductores y paginación
  const [allDrivers, setAllDrivers] = useState<Drivers[]>([]); // Lista completa de conductores
  const [filteredDrivers, setFilteredDrivers] = useState<Drivers[]>([]); // Lista filtrada
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [filters, setFilters] = useState<LocationFilters>({});
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  // Constantes
  const driversPerPage = 10;
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const tiposVehiculo = ['TAXI', 'MOTOCICLETA', 'CAMION', 'FURGONETA', 'COCHE', 'OTRO'];

  // Cargar todos los conductores al inicio
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await getDrivers();
        setAllDrivers(data);
        setFilteredDrivers(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar conductores:', err);
        setError('Error al cargar los conductores. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Cargar provincias al inicio
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const data = await getProvincias();
        if (Array.isArray(data)) {
          setProvincias(data);
        } else {
          console.error('La respuesta de provincias no es un array:', data);
          setProvincias([]);
        }
      } catch (err) {
        console.error('Error al cargar provincias:', err);
        setProvincias([]);
      }
    };

    fetchProvincias();
  }, []);

  // Cargar municipios cuando cambia la provincia
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (filters.provincia_id) {
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
        }
      } else {
        setMunicipios([]);
      }
    };

    fetchMunicipios();
  }, [filters.provincia_id]);

  // Función para aplicar los filtros localmente
  const applyFilters = (newFilters: LocationFilters) => {
    console.log('Aplicando filtros localmente:', newFilters);
    
    let filtered = [...allDrivers];

    // Filtrar por nombre
    if (newFilters.nombre) {
      const searchTerm = newFilters.nombre.toLowerCase();
      filtered = filtered.filter(driver => 
        driver.username.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por tipo de vehículo
    if (newFilters.tipo_vehiculo) {
      filtered = filtered.filter(driver => 
        driver.tipo_vehiculo === newFilters.tipo_vehiculo
      );
    }

    // Filtrar por provincia
    if (newFilters.provincia_id) {
      filtered = filtered.filter(driver => 
        driver.provincia_id === newFilters.provincia_id
      );
    }

    // Filtrar por municipio
    if (newFilters.municipio_id) {
      filtered = filtered.filter(driver => 
        driver.municipio_id === newFilters.municipio_id
      );
    }

    setFilteredDrivers(filtered);
    setCurrentPage(0); // Resetear la página al aplicar filtros
    setFilters(newFilters);
  };

  // Manejador para resetear los filtros
  const handleResetFilters = () => {
    setFilters({});
    setMunicipios([]);
    setFilteredDrivers(allDrivers);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Renderizado condicional para estados de carga y error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <div className="inline-flex h-14 w-14 rounded-full bg-red-100 items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-full">
        {/* Cabecera */}
        <div className="bg-white border-b">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold py-4 px-2 flex items-center">
              <Users className="mr-3 text-blue-600 h-7 w-7" />
              Conductores Disponibles
            </h1>
          </div>
        </div>

        {/* Filtros */}
        <div className="container mx-auto py-4">
          <DriversFilter 
            onApplyFilters={applyFilters}
            onResetFilters={handleResetFilters}
            provincias={provincias}
            municipios={municipios}
            tiposVehiculo={tiposVehiculo}
            isLoading={loading}
          />
                        </div>

        {/* Lista de conductores */}
        <div className="container mx-auto py-4">
          <DriversList 
            drivers={filteredDrivers}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onResetFilters={handleResetFilters}
            apiUrl={API_URL}
            hasFilters={Object.keys(filters).length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Home; 