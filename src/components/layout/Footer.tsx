import { Car, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-yellow-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">
                RutaDirecta
              </span>
            </div>
            <p className="text-gray-600">
              Tu solución de transporte confiable. Conectamos pasajeros con conductores de confianza.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span>+53 59273495</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span>info@rutadirecta.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <span>Sancti-Spiritus, Cuba</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} RutaDirecta - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 