import { Car, Users, Clock, MapPin, Phone, Shield } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a RutaDirecta
          </h1>
          <p className="text-xl text-gray-600">
            Tu solución integral para encontrar transporte de manera rápida y segura
          </p>
        </div>

        {/* Sección principal */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            ¿Qué es RutaDirecta?
          </h2>
          <p className="text-gray-600 mb-6">
            RutaDirecta es una plataforma diseñada para conectar a pasajeros con conductores de confianza en Cuba. 
            Nuestra misión es facilitar el transporte diario, haciendo que sea más fácil encontrar un vehículo 
            cuando lo necesites.
          </p>
        </div>

        {/* Características principales */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Para Pasajeros</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Encuentra vehículos disponibles en tiempo real</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <span>Visualiza conductores en tu municipio</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span>Contacta directamente con los conductores</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Car className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Para Conductores</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Gestiona tu disponibilidad fácilmente</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-500" />
                <span>Aumenta tu visibilidad con los clientes</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-500" />
                <span>Mantén tu perfil actualizado y verificado</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Beneficios de usar RutaDirecta
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ahorra Tiempo</h3>
              <p className="text-gray-600">Encuentra transporte rápidamente sin necesidad de esperar</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguridad</h3>
              <p className="text-gray-600">Conductores verificados y sistema de perfiles confiable</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Comunidad</h3>
              <p className="text-gray-600">Conecta con conductores locales de tu municipio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 