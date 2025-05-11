import { Link } from 'react-router-dom';
import { Car, Menu, UserCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-ruta-directa.e-comcuba.com';

// Función para construir la URL completa de las imágenes
const getFullImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  // Procesar la URL de la imagen de perfil
  const profilePictureUrl = getFullImageUrl(user?.profile_picture);

  return (
    <header className="bg-white shadow-lg border-b-4 border-yellow-400 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Car className="w-8 h-8 text-yellow-500" />
            <span className="text-gray-900">
              RutaDirecta
            </span>
          </Link>

          {/* Menú móvil */}
          <div className="flex items-center gap-4 md:hidden">
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
              >
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8" />
                )}
              </Link>
            )}
            <button 
              className="p-2 rounded-lg hover:bg-yellow-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menú"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-yellow-600 transition-colors font-medium"
            >
              Conductores
            </Link>
            <Link 
              to="/help" 
              className="text-gray-600 hover:text-yellow-600 transition-colors font-medium"
            >
              Ayuda
            </Link>
            {!isAuthenticated && (
              <>
                <div className="h-6 w-px bg-gray-200"></div>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-yellow-600 transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          {/* Perfil desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
              >
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8" />
                )}
                <span className="ml-2 text-sm font-medium">
                  {user?.first_name || user?.username}
                </span>
              </Link>
              
              <button 
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Menú móvil expandido */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {isAuthenticated && (
                <div className="flex items-center justify-between px-2 py-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {profilePictureUrl ? (
                      <img 
                        src={profilePictureUrl} 
                        alt="Perfil"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-10 h-10 text-gray-600" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {user?.first_name || user?.username}
                      </span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <Link 
                to="/" 
                className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Conductores
              </Link>
              
              <Link 
                to="/help" 
                className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ayuda
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 