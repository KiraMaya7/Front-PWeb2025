import { Link } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
// @ts-ignore
import '../src/routes/navbar.css';


export default function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">MiApp</Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/">Inicio</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/AreasMedicas">Servicios</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/Doctores">Doctores</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/contacto">Contacto</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/profile">Perfil</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link hover-effect" to="/Registro">Registro</Link>
              </li>
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