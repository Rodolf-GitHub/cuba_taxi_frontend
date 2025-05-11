import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  MapPin,
  Info,
  Search
} from 'lucide-react';
import type { Drivers } from '../../types/drivers';

interface DriversListProps {
  drivers: Drivers[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onResetFilters: () => void;
  apiUrl: string;
  hasFilters: boolean;
}

const DriversList: React.FC<DriversListProps> = ({
  drivers,
  loading,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onResetFilters,
  apiUrl,
  hasFilters
}) => {
  const navigate = useNavigate();
  // Calcular conductores visibles en la página actual
  const driversPerPage = 10;
  const startIndex = currentPage * driversPerPage;
  const visibleDrivers = drivers.slice(startIndex, startIndex + driversPerPage);

  // Función para mostrar el icono según el estado del conductor
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'disponible':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'ocupado':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'inactivo':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  // Estado de carga
  if (loading && drivers.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Sin resultados
  if (drivers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-14 w-14 rounded-full bg-yellow-100 items-center justify-center mb-4">
          <Search className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron conductores</h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasFilters ? 'Prueba con diferentes filtros' : 'No hay conductores registrados aún'}
        </p>
        {hasFilters && (
          <div className="mt-6">
            <button
              onClick={onResetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Encabezado responsivo - solo visible en pantallas grandes */}
      <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 border-b font-medium text-gray-600">
        <div className="col-span-3">Conductor</div>
        <div className="col-span-3">Vehículo</div>
        <div className="col-span-3">Ubicación</div>
        <div className="col-span-2">Estado</div>
        <div className="col-span-1 text-center">Acciones</div>
      </div>

      {/* Lista de conductores */}
      <div className="divide-y">
        {visibleDrivers.map((driver) => (
          <div 
            key={driver.id} 
            className="hover:bg-gray-50 transition-all duration-200"
          >
            {/* Vista móvil - formato tarjeta */}
            <div className="block md:hidden p-4">
              <div className="flex items-center mb-3">
                <div className="h-14 w-14 rounded-full bg-yellow-100 flex items-center justify-center mr-3 shadow-sm">
                  {driver.profile_picture ? (
                    <img 
                      src={`${apiUrl}${driver.profile_picture}`} 
                      alt={driver.username}
                      className="h-14 w-14 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/100?text=Usuario";
                      }}
                    />
                  ) : (
                    <User className="h-7 w-7 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{driver.username}</h3>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {getStatusIcon(driver.disponibilidad)}
                    {driver.disponibilidad}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-gray-700">
                  <Car className="h-5 w-5 mr-2 text-yellow-500" />
                  <span className="font-medium">{driver.tipo_vehiculo}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({driver.capacidad_pasajeros} pasajeros)
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>{driver.municipio_nombre}, {driver.provincia_nombre}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-3">
                {driver.telefono && (
                  <a 
                    href={`tel:${driver.telefono}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-300 shadow-sm"
                  >
                    <Phone className="h-4 w-4 mr-2" /> 
                    Llamar
                  </a>
                )}
                <button
                  onClick={() => navigate(`/driver/${driver.id}`)}
                  className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300 shadow-sm"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Ver detalles
                </button>
              </div>
            </div>
            
            {/* Vista desktop - formato de fila */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 items-center">
              <div className="col-span-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 shadow-sm">
                    {driver.profile_picture ? (
                      <img 
                        src={`${apiUrl}${driver.profile_picture}`} 
                        alt={driver.username}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://via.placeholder.com/100?text=Usuario";
                        }}
                      />
                    ) : (
                      <User className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-800">{driver.username}</span>
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-yellow-500" />
                  <div>
                    <div className="font-medium text-gray-800">{driver.tipo_vehiculo}</div>
                    <div className="text-sm text-gray-500">{driver.capacidad_pasajeros} pasajeros</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-yellow-500" />
                  <span className="text-gray-800">{driver.municipio_nombre}, {driver.provincia_nombre}</span>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {getStatusIcon(driver.disponibilidad)}
                  {driver.disponibilidad}
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center space-x-2">
                {driver.telefono && (
                  <a 
                    href={`tel:${driver.telefono}`}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-300 shadow-sm hover:scale-110"
                    title="Llamar al conductor"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                )}
                <button
                  onClick={() => navigate(`/driver/${driver.id}`)}
                  className="inline-flex items-center justify-center p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300 shadow-sm hover:scale-110"
                  title="Ver detalles"
                >
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {drivers.length > driversPerPage && (
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button 
            onClick={onPrevPage}
            disabled={currentPage === 0}
            className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Anterior
          </button>
          
          <div className="text-sm text-gray-600">
            <Calendar className="inline-block h-4 w-4 mr-1 text-yellow-500" />
            Página {currentPage + 1} de {Math.max(1, totalPages)}
          </div>
          
          <button 
            onClick={onNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Siguiente
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DriversList;