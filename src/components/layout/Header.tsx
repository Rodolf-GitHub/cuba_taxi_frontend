import { Link } from 'react-router-dom';
import { Car, Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Conductores
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Registrarse como Conductor
            </Link>
          </div>
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
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-center shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse como Conductor
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 