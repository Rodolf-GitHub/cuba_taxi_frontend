import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Car, MapPin, Phone, Mail, Calendar, Clock } from 'lucide-react';
import type { DriverDetails } from '../types/drivers';
import { getDriverDetails } from '../services/drivers.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DriverDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getDriverDetails(Number(id));
        setDriver(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar detalles del conductor:', err);
        setError('Error al cargar los detalles del conductor. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-blue-200 rounded-full mx-auto"></div>
          <div className="h-4 w-48 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-red-600 mb-4">{error || 'Conductor no encontrado'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Botón Volver */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a la lista
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cabecera con foto de perfil */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-full bg-white shadow-lg overflow-hidden">
                {driver.profile_picture ? (
                  <img 
                    src={`${API_URL}${driver.profile_picture}`}
                    alt={driver.username}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/100?text=Usuario";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-100">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{driver.first_name} {driver.last_name}</h1>
                <p className="text-blue-100">@{driver.username}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {driver.disponibilidad}
                </div>
              </div>
            </div>
          </div>

          {/* Información del conductor */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información de contacto */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Información de contacto</h2>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>{driver.telefono}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{driver.municipio_nombre}, {driver.provincia_nombre}</span>
                </div>
              </div>

              {/* Información del vehículo */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Información del vehículo</h2>
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span>{driver.tipo_vehiculo}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>{driver.capacidad_pasajeros} pasajeros</span>
                </div>
                {driver.foto_vehiculo && (
                  <div className="mt-4">
                    <img 
                      src={`${API_URL}${driver.foto_vehiculo}`}
                      alt="Vehículo"
                      className="rounded-lg shadow-md max-h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/400x200?text=Vehículo";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Última actualización */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Última actualización: {new Date(driver.ultima_disponibilidad).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsPage; 