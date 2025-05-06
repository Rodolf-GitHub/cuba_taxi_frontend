import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Aquí se agregarán más rutas cuando se creen las páginas correspondientes */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
