import { useState, useEffect } from 'react';
import { Car, User, Star, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Drivers } from '../types/drivers';
import { getDrivers } from '../services/drivers.service';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const driversPerPage = 4;
  const totalPages = Math.ceil(drivers.length / driversPerPage);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await getDrivers();
        setDrivers(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los conductores. Por favor, intente nuevamente.');
        console.error('Error al cargar conductores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const nextPage = () => {
    setDirection('right');
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setDirection('left');
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleDrivers = drivers.slice(
    currentPage * driversPerPage,
    (currentPage + 1) * driversPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando conductores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <main className="w-full mx-auto py-6 px-4">
        <h1 className="text-3xl text-center font-bold mb-8">Conductores</h1>

        {/* Filtros en fila */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Buscador */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Nombre del conductor" 
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tipo de vehículo */}
            <div className="w-[200px]">
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todos los vehículos</option>
                <option value="standard">Estándar</option>
                <option value="classic">Clásico</option>
                <option value="premium">Premium</option>
                <option value="van">Van</option>
              </select>
            </div>

            {/* Provincia */}
            <div className="w-[200px]">
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todas las provincias</option>
                <option value="1">La Habana</option>
                <option value="2">Artemisa</option>
                <option value="3">Mayabeque</option>
                <option value="4">Matanzas</option>
                <option value="5">Cienfuegos</option>
                <option value="6">Villa Clara</option>
                <option value="7">Sancti Spíritus</option>
                <option value="8">Ciego de Ávila</option>
                <option value="9">Camagüey</option>
                <option value="10">Las Tunas</option>
                <option value="11">Holguín</option>
                <option value="12">Granma</option>
                <option value="13">Santiago de Cuba</option>
                <option value="14">Guantánamo</option>
                <option value="15">Isla de la Juventud</option>
              </select>
            </div>

            {/* Municipio */}
            <div className="w-[200px]">
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todos los municipios</option>
                <option value="1">La Habana Vieja</option>
                <option value="2">Centro Habana</option>
                <option value="3">Plaza de la Revolución</option>
                <option value="4">Vedado</option>
                <option value="5">Miramar</option>
                <option value="6">Playa</option>
                <option value="7">Marianao</option>
                <option value="8">Boyeros</option>
                <option value="9">Diez de Octubre</option>
                <option value="10">Arroyo Naranjo</option>
                <option value="11">San Miguel del Padrón</option>
                <option value="12">Cotorro</option>
                <option value="13">Guanabacoa</option>
                <option value="14">Regla</option>
                <option value="15">Habana del Este</option>
              </select>
            </div>

            {/* Botón de filtros */}
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap">
              <Filter className="mr-2 h-4 w-4" />
              Aplicar filtros
            </button>
          </div>
        </div>

        {/* Lista de Conductores */}
        <div className="w-full">
          {drivers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay conductores disponibles en este momento.</p>
            </div>
          ) : (
            <>
              <div className="relative px-16 overflow-visible">
                {/* Flecha Izquierda */}
                <button 
                  onClick={prevPage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>

                {/* Grid de Conductores */}
                <div 
                  key={currentPage}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                    direction === 'right' 
                      ? 'animate-slide-right' 
                      : 'animate-slide-left'
                  }`}
                >
                  {visibleDrivers.map((driver) => (
                    <div 
                      key={driver.id} 
                      className="bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            {driver.profile_picture ? (
                              <img 
                                src={driver.profile_picture} 
                                alt={driver.username}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-8 w-8 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{driver.username}</h3>
                            <div className="flex items-center text-yellow-500">
                              <Star className="fill-yellow-500 h-4 w-4" />
                              <span className="ml-1">4.8</span>
                              <span className="text-gray-500 ml-1">(124 viajes)</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Car className="h-4 w-4 mr-2" />
                            <span>{driver.tipo_vehiculo}</span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({driver.capacidad_pasajeros} pasajeros)
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Disponible en: {driver.municipio_nombre}, {driver.provincia_nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            Estado: {driver.disponibilidad}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <div className="text-sm text-gray-500">Precio base</div>
                            <div className="font-bold">Desde 500 CUP</div>
                          </div>
                          {driver.telefono && (
                            <a 
                              href={`tel:${driver.telefono}`}
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                            >
                              Contactar
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flecha Derecha */}
                <button 
                  onClick={nextPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Indicador de Página */}
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentPage ? 'right' : 'left');
                      setCurrentPage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentPage === index ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home; 