import React from 'react';
import { useNavigate } from 'react-router-dom';
const AdminInicio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Panel de Administración</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-person-plus fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Alta de Médicos</h5>
              <p className="card-text">Gestiona la información de los médicos del sistema</p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => navigate('/Administrador/altaMedico')}
              >
                Administrar Médicos
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check fs-1 text-success mb-3"></i>
              <h5 className="card-title">Citas Realizadas</h5>
              <p className="card-text">Consulta el historial de citas completadas</p>
              <button 
                className="btn btn-success mt-3"
                onClick={() => navigate('/Administrador/reportesCitas')}
              >
                Ver Historial
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-star fs-1 text-warning mb-3"></i>
              <h5 className="card-title">Calificaciones</h5>
              <p className="card-text">Revisa las calificaciones de los médicos</p>
              <button 
                className="btn btn-warning mt-3"
                onClick={() => navigate('/Administrador/calificacionDoctores')}
              >
                Ver Calificaciones
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check fs-1 text-success mb-3"></i>
              <h5 className="card-title">Todas las Cuentas</h5>
              <p className="card-text">Elimina o edita las cuentas</p>
              <button 
                className="btn btn-secondary mt-3"
                onClick={() => navigate('/Administrador/gestionCuentas')}
              >
                Ver Cuentas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminInicio;