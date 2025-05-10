import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Camera, Loader2, MapPin, Car, Phone, UserCircle, Mail, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getProvincias, getMunicipiosByProvincia } from '../services/locations.service';
import type { Provincia, Municipio } from '../types/locations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type VehicleType = 'TAXI' | 'MOTOCICLETA' | 'CAMION' | 'FURGONETA' | 'COCHE' | 'OTRO';
type DisponibilidadType = 'DISPONIBLE' | 'NO_DISPONIBLE' | 'OCUPADO';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  profile_picture: string | null;
  foto_vehiculo: string | null;
  tipo_vehiculo: VehicleType;
  capacidad_pasajeros: number;
  disponibilidad: DisponibilidadType;
  ultima_disponibilidad: string;
  municipio_id: string;
  municipio_nombre: string;
  provincia_id: string;
  provincia_nombre: string;
  tiempo_disponibilidad_restante: number | null;
}

const vehicleTypes: VehicleType[] = ['TAXI', 'MOTOCICLETA', 'CAMION', 'FURGONETA', 'COCHE', 'OTRO'];
const disponibilidadTypes: DisponibilidadType[] = ['DISPONIBLE', 'NO_DISPONIBLE', 'OCUPADO'];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
    tipo_vehiculo: vehicleTypes[0],
    capacidad_pasajeros: 4,
    disponibilidad: disponibilidadTypes[0],
    municipio_id: ''
  });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [updatingDisponibilidad, setUpdatingDisponibilidad] = useState(false);

  // Función para construir la URL completa de las imágenes
  const getFullImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  // Cargar datos del perfil
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadUserProfile = async () => {
      try {
        console.log('Intentando obtener perfil de usuario...');
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = response.data;
        console.log('Datos del perfil cargados:', userData);
        
        // Actualizar las URLs de las imágenes con la URL base
        const userWithFullUrls = {
          ...userData,
          profile_picture: getFullImageUrl(userData.profile_picture),
          foto_vehiculo: getFullImageUrl(userData.foto_vehiculo)
        };
        
        setUser(userWithFullUrls);
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
        if (axios.isAxiosError(error)) {
          console.error('Status:', error.response?.status);
          console.error('Data:', error.response?.data);
        }
        setError('Error al cargar el perfil');
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

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

  // Actualizar el tiempo restante cada minuto
  useEffect(() => {
    if (user?.tiempo_disponibilidad_restante) {
      setTimeLeft(user.tiempo_disponibilidad_restante);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => prev !== null ? Math.max(0, prev - 1) : null);
      }, 60000); // Actualizar cada minuto

      return () => clearInterval(timer);
    }
  }, [user?.tiempo_disponibilidad_restante]);

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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        tipo_vehiculo: formData.tipo_vehiculo,
        capacidad_pasajeros: parseInt(formData.capacidad_pasajeros.toString(), 10),
        disponibilidad: formData.disponibilidad,
        telefono: formData.telefono.trim(),
        municipio_id: formData.municipio_id.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim()
      };

      // Validar que ningún campo esté vacío
      const emptyFields = Object.entries(data)
        .filter(([, value]) => value === '' || value === undefined || value === null)
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        setError(`Los siguientes campos son requeridos: ${emptyFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Crear FormData y añadir los datos como string JSON
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(data));

      console.log('Datos a enviar:', data);

      const response = await axios.put(`${API_URL}/api/users/me`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = {
        ...response.data,
        profile_picture: getFullImageUrl(response.data.profile_picture),
        foto_vehiculo: getFullImageUrl(response.data.foto_vehiculo)
      };
      setUser(updatedUser);
      showSuccessMessage('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        
        // Manejar el error de validación del backend
        if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail
            .map((err: { loc?: string[], msg?: string }) => {
              if (err.loc && err.loc.length > 1) {
                return `Campo ${err.loc[1]}: ${err.msg}`;
              }
              return err.msg;
            })
            .join('. ');
          setError(errorMessages);
        } else {
          setError(error.response?.data?.detail || 'Error al actualizar el perfil');
        }
      } else {
        setError('Error al actualizar el perfil');
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', e.target.files[0]);
    
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/users/me/profile-picture`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      const updatedUser = {
        ...response.data,
        profile_picture: getFullImageUrl(response.data.profile_picture),
        foto_vehiculo: getFullImageUrl(response.data.foto_vehiculo)
      };
      setUser(updatedUser);
      showSuccessMessage('Foto de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      setError('Error al actualizar la foto de perfil');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVehiclePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('foto_vehiculo', e.target.files[0]);
    
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/users/me/vehicle-picture`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      const updatedUser = {
        ...response.data,
        profile_picture: getFullImageUrl(response.data.profile_picture),
        foto_vehiculo: getFullImageUrl(response.data.foto_vehiculo)
      };
      setUser(updatedUser);
      showSuccessMessage('Foto del vehículo actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la foto del vehículo:', error);
      setError('Error al actualizar la foto del vehículo');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear el tiempo restante
  const formatTimeLeft = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Función para actualizar disponibilidad
  const handleUpdateDisponibilidad = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setUpdatingDisponibilidad(true);
    try {
      // Establecer inmediatamente 12 horas (720 minutos)
      setTimeLeft(720);
      showSuccessMessage('Disponibilidad actualizada a 12 horas');

      // Hacer la petición en segundo plano
      axios.post(
        `${API_URL}/api/users/set-disponible`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).catch(error => {
        console.error('Error al actualizar disponibilidad:', error);
      });
    } finally {
      setUpdatingDisponibilidad(false);
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
                {/* Username (no editable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de usuario
                  </label>
                  <div className="mt-1 p-2 border border-gray-300 rounded-lg bg-gray-50">
                    {user?.username}
                  </div>
                </div>

                {/* Nombre */}
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

                {/* Apellidos */}
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

                {/* Email */}
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

                {/* Teléfono */}
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
                  <div className="mt-1 space-y-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
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
                    
                    {formData.disponibilidad === 'DISPONIBLE' && (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-700">
                          <Clock className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            {timeLeft !== null ? `Tiempo restante: ${formatTimeLeft(timeLeft)}` : 'No disponible'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleUpdateDisponibilidad}
                          disabled={updatingDisponibilidad}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {updatingDisponibilidad ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <span className="ml-2">Actualizar</span>
                        </button>
                      </div>
                    )}
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
