import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Car, MapPin, Lock } from 'lucide-react';
import { getMunicipiosByProvincia, getProvincias } from '../../services/locations.service';
import type { Provincia, Municipio } from '../../types/locations';
import type { AxiosError } from 'axios';
import { register } from '../../services/auth.service';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  telefono: string;
  tipo_vehiculo: string;
  capacidad_pasajeros: string;
  municipio_id: string;
}

const vehicleTypes = ['TAXI', 'MOTOCICLETA', 'CAMION', 'FURGONETA', 'COCHE', 'OTRO'] as const;
type VehicleType = typeof vehicleTypes[number];

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    telefono: '',
    tipo_vehiculo: 'TAXI',
    capacidad_pasajeros: '4',
    municipio_id: ''
  });

  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Cargar provincias al montar el componente
  useEffect(() => {
    const loadProvincias = async () => {
      setLoadingProvincias(true);
      try {
        const data = await getProvincias();
        setProvincias(data);
      } catch (err) {
        console.error('Error al cargar provincias:', err);
        setError('Error al cargar las provincias');
      } finally {
        setLoadingProvincias(false);
      }
    };

    loadProvincias();
  }, []);

  // Cargar municipios cuando cambia la provincia
  useEffect(() => {
    const loadMunicipios = async () => {
      if (!selectedProvincia) {
        setMunicipios([]);
        return;
      }

      setLoadingMunicipios(true);
      try {
        const data = await getMunicipiosByProvincia(selectedProvincia);
        setMunicipios(data);
      } catch (err) {
        console.error('Error al cargar municipios:', err);
        setError('Error al cargar los municipios');
      } finally {
        setLoadingMunicipios(false);
      }
    };

    loadMunicipios();
  }, [selectedProvincia]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        telefono: formData.telefono,
        tipo_vehiculo: formData.tipo_vehiculo as VehicleType,
        capacidad_pasajeros: Number(formData.capacidad_pasajeros),
        disponibilidad: 'DISPONIBLE',
        municipio_id: formData.municipio_id
      };

      await register(registerData);
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinciaId = e.target.value;
    setSelectedProvincia(provinciaId);
    setFormData(prev => ({
      ...prev,
      municipio_id: ''
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">
            RutaDirecta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a nuestra red de transporte y mensajería
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-xl p-8 border-t-4 border-yellow-400">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nombre de usuario
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Apellidos
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="tel"
                      name="telefono"
                      id="telefono"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Vehículo */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Información del Vehículo</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="tipo_vehiculo" className="block text-sm font-medium text-gray-700">
                    Tipo de Vehículo
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-yellow-500" />
                    </div>
                    <select
                      name="tipo_vehiculo"
                      id="tipo_vehiculo"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.tipo_vehiculo}
                      onChange={handleChange}
                    >
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="capacidad_pasajeros" className="block text-sm font-medium text-gray-700">
                    Capacidad de Pasajeros
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="number"
                      name="capacidad_pasajeros"
                      id="capacidad_pasajeros"
                      required
                      min="1"
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.capacidad_pasajeros}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Ubicación</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="provincia" className="block text-sm font-medium text-gray-700">
                    Provincia
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-yellow-500" />
                    </div>
                    <select
                      id="provincia"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm ${loadingProvincias ? 'bg-gray-100' : ''}`}
                      value={selectedProvincia}
                      onChange={handleProvinciaChange}
                      disabled={loadingProvincias}
                    >
                      <option value="">Seleccione provincia</option>
                      {provincias.map(provincia => (
                        <option key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="municipio_id" className="block text-sm font-medium text-gray-700">
                    Municipio
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-yellow-500" />
                    </div>
                    <select
                      name="municipio_id"
                      id="municipio_id"
                      required
                      className={`appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm ${loadingMunicipios ? 'bg-gray-100' : ''}`}
                      value={formData.municipio_id}
                      onChange={handleChange}
                      disabled={!selectedProvincia || loadingMunicipios}
                    >
                      <option value="">Seleccione municipio</option>
                      {municipios.map(municipio => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Seguridad</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrarse'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

