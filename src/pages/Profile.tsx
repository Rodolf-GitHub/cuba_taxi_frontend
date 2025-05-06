import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Camera, Loader2, MapPin, Car, Phone, Mail, UserCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { getProfile, updateProfile, updateProfilePicture, updateVehiclePicture } from '../services/profile.service';
import { getProvincias, getMunicipiosByProvincia } from '../services/locations.service';
import type { Provincia, Municipio } from '../types/locations';
import type { User, VehicleType, DisponibilidadType } from '../types/user';

const vehicleTypes: VehicleType[] = ['TAXI', 'MOTOCICLETA', 'CAMION', 'FURGONETA', 'COCHE', 'OTRO'];
const disponibilidadTypes: DisponibilidadType[] = ['DISPONIBLE', 'NO_DISPONIBLE', 'OCUPADO'];

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telefono: '',
    tipo_vehiculo: 'TAXI',
    capacidad_pasajeros: 4,
    disponibilidad: 'DISPONIBLE',
    municipio_id: ''
  });

  // Cargar datos del perfil
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await getProfile();
        console.log('Datos del perfil cargados:', userData);
        setUser(userData);
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          telefono: userData.telefono,
          tipo_vehiculo: userData.tipo_vehiculo,
          capacidad_pasajeros: userData.capacidad_pasajeros,
          disponibilidad: userData.disponibilidad,
          municipio_id: userData.municipio_id
        });
        setSelectedProvincia(userData.provincia_id);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, navigate]);

  // Cargar provincias
  useEffect(() => {
    const loadProvincias = async () => {
      setLoadingProvincias(true);
      try {
        const provinciasData = await getProvincias();
        console.log('Provincias cargadas:', provinciasData);
        setProvincias(provinciasData);
      } catch (error) {
        console.error('Error al cargar provincias:', error);
        setError('Error al cargar las provincias');
        setProvincias([]);
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
        const municipiosData = await getMunicipiosByProvincia(selectedProvincia);
        console.log('Municipios cargados:', municipiosData);
        setMunicipios(municipiosData);
      } catch (error) {
        console.error('Error al cargar municipios:', error);
        setError('Error al cargar los municipios');
        setMunicipios([]);
      } finally {
        setLoadingMunicipios(false);
      }
    };

    loadMunicipios();
  }, [selectedProvincia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad_pasajeros' ? parseInt(value) : value
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

  const showSuccessMessage = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedUserData = await updateProfile(formData);
      setUser(updatedUserData);
      showSuccessMessage('Perfil actualizado correctamente');
      console.log('Perfil actualizado:', updatedUserData);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setLoading(true);
    try {
      const updatedUserData = await updateProfilePicture(e.target.files[0]);
      setUser(updatedUserData);
      showSuccessMessage('Foto de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      setError('Error al actualizar la foto de perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleVehiclePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setLoading(true);
    try {
      const updatedUserData = await updateVehiclePicture(e.target.files[0]);
      setUser(updatedUserData);
      showSuccessMessage('Foto del vehículo actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la foto del vehículo:', error);
      setError('Error al actualizar la foto del vehículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Mensajes de éxito y error */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-t-lg text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-t-lg text-red-700">
              {error}
            </div>
          )}

          {/* Header con fotos */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Foto de perfil */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>

              {/* Foto del vehículo */}
              <div className="relative">
                <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                  {user.foto_vehiculo ? (
                    <img
                      src={user.foto_vehiculo}
                      alt="Foto del vehículo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleVehiclePictureChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Información Personal */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
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
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.last_name}
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
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.email}
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
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="telefono"
                      id="telefono"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
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
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="tipo_vehiculo"
                      id="tipo_vehiculo"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
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
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="capacidad_pasajeros"
                      id="capacidad_pasajeros"
                      required
                      min="1"
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.capacidad_pasajeros}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="disponibilidad" className="block text-sm font-medium text-gray-700">
                    Disponibilidad
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="disponibilidad"
                      id="disponibilidad"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.disponibilidad}
                      onChange={handleChange}
                    >
                      {disponibilidadTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="provincia"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                      value={selectedProvincia}
                      onChange={handleProvinciaChange}
                      disabled={loadingProvincias}
                    >
                      <option value="">Seleccione una provincia</option>
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
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="municipio_id"
                      id="municipio_id"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                      value={formData.municipio_id}
                      onChange={handleChange}
                      disabled={!selectedProvincia || loadingMunicipios}
                    >
                      <option value="">Seleccione un municipio</option>
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

            {/* Botón de guardar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
