import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import DriverDetails from './pages/DriverDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Help from './pages/Help';


function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/driver/:id" element={<DriverDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          {/* Aquí se agregarán más rutas cuando se creen las páginas correspondientes */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
