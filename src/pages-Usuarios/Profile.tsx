import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Registro from './Registro';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoToRegister = () => {
    navigate('/Registro');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/Login', {
        usuario: email, 
        contraseña: password,
      });

      const data = response.data;

      // Guarda token y rol
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('nombre', data.nombre);

      // Redirige según rol
      switch (data.rol) {
        case 1: // Admin
          navigate('/Administrador');
          break;
        case 2: // Médico
          navigate('/Doctor');
          break;
        default: // Usuario
          navigate('/Paciente');
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
              
              <h1 className="mb-4">Iniciar Sesión</h1>

              <div className="mb-4">
                <img 
                  src="/LoginMedicos.jpg"
                  alt="Logo Médico" 
                  className="img-fluid"
                  style={{ width: '250px', height: '150px'}}
                />
              </div>

              {/* Formulario con onSubmit */}
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    id="floatingInput" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Usuario Médico</label>
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
                  className="btn btn-primary btn w-20 mb-0"
                  onClick={handleGoToRegister}
                  type="submit"
                >
                  Crear Cuenta
                </button>
                </div>

                <button 
                  className="btn btn-primary btn-lg w-100 mb-3"
                  type="submit"
                >
                  Ingresar al Sistema
                </button>

                <p className="mt-4 text-muted">
                  Sistema de Citas Médicas 
                  <br/>
                  <small>Proyecto Escolar - Desarrollo de Software</small>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

