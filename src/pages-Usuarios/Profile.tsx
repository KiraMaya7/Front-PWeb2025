import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.jpg';
interface LoginResponse {
  token: string;
  rol: number;
  nombre: string;
  idUsuario: number;
}

const LoginUsuario: React.FC = () => {
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleGoToRegister = () => {
    navigate('/Registro');
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await api.post<LoginResponse>('/Login', {
      username: usuario,
      password: password
    });

    const data = response.data;
    console.log('Respuesta del backend:', response.data);

    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', data.rol.toString());
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('idUsuario', data.idUsuario.toString());

    // Trigger navbar update
    window.dispatchEvent(new Event('storage'));

    switch (data.rol) {
      case 1:
        navigate('/Administrador');
        break;
      case 2:
        navigate('/Doctor');
        break;
      default:
        navigate('/Home');
        break;
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Usuario o contraseña incorrectos');
  }
};

  return (
    <div className="container-fluid vh-100 gradient-custom">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-5 text-center">
              
              <h1 className="mb-4">Acceso de Usuarios</h1>

              <div className="mb-4">
              <img src={logo} className="img-fluid" style={{ width: '250px', height: '150px' }} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    id="floatingInput" 
                    placeholder="nombre_usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Usuario</label>
                </div>

                <div className="form-floating mb-3">
                  <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    id="floatingPassword" 
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Contraseña</label>
                </div>

                <div className="d-flex justify-content-between mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="rememberMe" 
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Recordar cuenta
                    </label>
                  </div>
                  <button 
                    className="btn btn-primary w-20 mb-0"
                    onClick={handleGoToRegister}
                    type="button"
                  >
                    Registrarse
                  </button>
                </div>

                <button 
                  className="btn btn-primary btn-lg w-100 mb-3"
                  type="submit"
                >
                  Iniciar Sesión
                </button>

                <p className="mt-4 text-muted">
                  <br/>
                  <small>Health Care S.A C.V</small>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUsuario;