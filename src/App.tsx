import { Link } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { useEffect, useState } from 'react';
import logo from './img/logo.jpg';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);
    
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/"><img src={logo} className="img-fluid" style={{ width: '50px', height: '50px' }} /></Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-2"><Link className="nav-link hover-effect" to="/">Inicio</Link></li>
                  <li className="nav-item mx-2"><Link className="nav-link hover-effect" to="/AreasMedicas">Servicios</Link></li>
                  <li className="nav-item mx-2"><Link className="nav-link hover-effect" to="/Doctores">Doctores</Link></li>
                  <li className="nav-item mx-2"><Link className="nav-link hover-effect" to="/contacto">Contacto</Link></li>
                  <li className="nav-item mx-2"><Link className="nav-link hover-effect" to="/profile">Perfil</Link></li>
                  <li className="nav-item mx-2"><Link className="nav-link hover-effect" to="/Registro">Registro</Link></li>
                </>
              ) : (
                <li className="nav-item mx-2">
                  <button className="nav-link btn btn-link hover-effect" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5 pt-4">
        <AppRouter />
      </div>
    </div>
  );
}