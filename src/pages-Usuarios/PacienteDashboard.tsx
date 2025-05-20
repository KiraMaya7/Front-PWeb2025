import React from 'react';
import { useNavigate } from 'react-router-dom';

const PacienteDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold">Panel de Pacientes</h1>

      <div className="row justify-content-center g-4">
        {/* Tarjeta: Agendar Cita */}
        <div className="col-md-5 col-lg-4">
          <div className="card h-100 shadow rounded-4 border-0">
            <div className="card-body text-center p-4">
              <i className="bi bi-person-plus fs-1 text-primary mb-3"></i>
              <h5 className="card-title fw-semibold mb-2">Agendar Cita</h5>
              <p className="card-text text-secondary">
                Agenda una cita con el médico de tu preferencia de forma rápida y sencilla.
              </p>
              <button
                className="btn btn-primary mt-3 px-4 rounded-pill"
                onClick={() => navigate('/Paciente/InicioPaciente')}
              >
                <i className="bi bi-calendar-plus me-2"></i> Agendar ahora
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta: Calificaciones */}
        <div className="col-md-5 col-lg-4">
          <div className="card h-100 shadow rounded-4 border-0">
            <div className="card-body text-center p-4">
              <i className="bi bi-star fs-1 text-warning mb-3"></i>
              <h5 className="card-title fw-semibold mb-2">Calificaciones</h5>
              <p className="card-text text-secondary">
                Comparte tu experiencia calificando al médico que te atendió.
              </p>
              <button
                className="btn btn-warning text-white mt-3 px-4 rounded-pill"
                onClick={() => navigate('/Paciente/CalificacionesPacientes')}
              >
                <i className="bi bi-pencil-square me-2"></i> Calificar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacienteDashboard;
