import { Link } from 'react-router-dom';
import { Car, Menu, UserCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Car className="w-8 h-8 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              CubaTaxi
            </span>
          </Link>

          {/* Menú móvil */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Conductores
            </Link>
            {!isAuthenticated && (
              <>
                <div className="h-6 w-px bg-gray-200"></div>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
             
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
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
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Conductores
              </Link>
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 