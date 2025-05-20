
import React from 'react';
import { useNavigate } from 'react-router-dom';
const PacienteDashboard: React.FC = () => {
  const navigate = useNavigate();




  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Panel  de Pacientes</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-person-plus fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Agendar Cita</h5>
              <p className="card-text">Agenda cita con el Medico de tu preferencia</p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => navigate('/Paciente/InicioPaciente')}
              >
                Agendar ahora
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-star fs-1 text-warning mb-3"></i>
              <h5 className="card-title">Calificaciones</h5>
              <p className="card-text">Puedes Calificar el Medico que te atendió</p>
              <button 
                className="btn btn-warning mt-3"
                onClick={() => navigate('/Paciente/')}
              >
                Calificar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PacienteDashboard;
