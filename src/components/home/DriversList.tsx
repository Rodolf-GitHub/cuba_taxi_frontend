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
  Info
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
      <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 w-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Sin resultados
  if (drivers.length === 0) {
    return (
      <div className="text-center py-12 bg-white shadow-sm mt-1 rounded-lg">
        <div className="inline-flex h-16 w-16 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Car className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-600">No hay conductores disponibles con los filtros seleccionados.</p>
        {hasFilters && (
          <button 
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Limpiar filtros
          </button>
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
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
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
                    <User className="h-7 w-7 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{driver.username}</h3>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getStatusIcon(driver.disponibilidad)}
                    {driver.disponibilidad}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-gray-700">
                  <Car className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium">{driver.tipo_vehiculo}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({driver.capacidad_pasajeros} pasajeros)
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{driver.municipio_nombre}, {driver.provincia_nombre}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-3">
                {driver.telefono && (
                  <a 
                    href={`tel:${driver.telefono}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-sm"
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
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
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
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-800">{driver.username}</span>
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-800">{driver.tipo_vehiculo}</div>
                    <div className="text-sm text-gray-500">{driver.capacidad_pasajeros} pasajeros</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-gray-800">{driver.municipio_nombre}, {driver.provincia_nombre}</span>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getStatusIcon(driver.disponibilidad)}
                  {driver.disponibilidad}
                </div>
              </div>
              
              <div className="col-span-1 flex justify-center space-x-2">
                {driver.telefono && (
                  <a 
                    href={`tel:${driver.telefono}`}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-sm hover:scale-110"
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
            <Calendar className="inline-block h-4 w-4 mr-1 text-blue-500" />
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