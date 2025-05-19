import { Link, useNavigate } from 'react-router-dom';
import AppRouter from '../src/routes/AppRouter';
import { getUserRole, isAuthenticated, logout} from './auth/authHelpers';

export default function App() {
  const role = getUserRole();
  const loggedIn = isAuthenticated();
  const navigate = useNavigate();

  const handleCloseSeccion = () => {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">MiApp</Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!loggedIn && (
                <>
                <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/">Inicio</Link>
               </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/AreasMedicas">Areas Medicas</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/Doctores">Doctores</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/Contacto">Contacto</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/login">Iniciar sesión</Link>
                  </li>
                   <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/Registro">Registro</Link>
                  </li>
                </>
              )}
              {loggedIn && role === 1 && (
                <li className="nav-item mx-2">
                  <Link className="nav-link hover-effect" to="/Administrador">Panel Admin</Link>
                </li>
              )}
              {loggedIn && role === 2 && (
                <li className="nav-item mx-2">
                  <Link className="nav-link hover-effect" to="/Doctor">Panel Doctor</Link>
                </li>
              )}
              {loggedIn && role === 3 && (
                 <>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/AreasMedicas">Áreas Médicas</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/Doctores">Doctores</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link hover-effect" to="/Contacto">Contacto</Link>
                  </li>
                </>
              )}
              {loggedIn && (
                <li className="nav-item mx-2">
                  <button 
                    onClick={handleCloseSeccion}
                    className="nav-link hover-effect btn btn-link"
                    style={{ cursor: 'pointer' }}
                  >
                    Cerrar sesión
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
