import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Car, MapPin, Phone, Mail, AlertTriangle, CheckCircle, XCircle, Users } from 'lucide-react';
import type { DriverDetails } from '../types/drivers';
import { getDriverDetails } from '../services/drivers.service';

export default function DriverDetails() {
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex h-14 w-14 rounded-full bg-red-100 items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Error al cargar el conductor</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </button>
            </div>
          </div>
        ) : driver ? (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                      {driver.profile_picture ? (
                        <img
                          src={driver.profile_picture}
                          alt={`${driver.first_name} ${driver.last_name}`}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-yellow-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {driver.first_name} {driver.last_name}
                      </h1>
                      <p className="text-gray-500">{driver.username}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      driver.disponibilidad === 'DISPONIBLE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.disponibilidad === 'DISPONIBLE' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {driver.disponibilidad}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Información de contacto</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-700">
                          <Mail className="h-5 w-5 text-yellow-500 mr-2" />
                          <span>{driver.email}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-5 w-5 text-yellow-500 mr-2" />
                          <a href={`tel:${driver.telefono}`} className="hover:text-yellow-600">
                            {driver.telefono}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                      <div className="mt-2 flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 text-yellow-500 mr-2" />
                        <span>{driver.municipio_nombre}, {driver.provincia_nombre}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Información del vehículo</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-700">
                          <Car className="h-5 w-5 text-yellow-500 mr-2" />
                          <span>{driver.tipo_vehiculo}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Users className="h-5 w-5 text-yellow-500 mr-2" />
                          <span>{driver.capacidad_pasajeros} pasajeros</span>
                        </div>
                        {driver.foto_vehiculo && (
                          <div className="mt-4">
                            <img
                              src={driver.foto_vehiculo}
                              alt="Foto del vehículo"
                              className="rounded-lg shadow-sm max-h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
} 