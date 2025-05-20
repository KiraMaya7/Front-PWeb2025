import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Cita {
  idCita: number;
  idUsuario: number;
  fechaHora: string;
  nombrePaciente: string;
  estadoNombre: string;
  estadoCita: number;
  notas: string;
}

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  edad: number;
  telefono: string;
  direccion: string;
  estado: string;
  ciudad: string;
  correo: string;
  usuario: string;
  rol: number;
}

const CitasPacientes: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Usuario | null>(null);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const idUsuario = localStorage.getItem('idUsuario');
        
        const doctorResponse = await api.get(`/Doctores/Usuario/${idUsuario}`);
        const idDoctor = doctorResponse.data.idDoctor;
        localStorage.setItem('idDoctor', idDoctor.toString());
        
        const citasResponse = await api.get(`/Citas/Doctor/${idDoctor}`);
        setCitas(citasResponse.data);
      } catch (error) {
        console.error('Error al cargar citas:', error);
        setError('No se pudieron cargar las citas. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const handleVerPerfil = async (idUsuario: number) => {
    try {
      setLoadingPaciente(true);
      const response = await api.get(`/Cuenta/${idUsuario}`);
      
      setSelectedPaciente(response.data);
      setShowPerfilModal(true);
    } catch (error) {
      console.error('Error al cargar datos del paciente:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'status' in (error as any).response &&
        (error as any).response.status === 403
      ) {
        setError('No tiene permisos para ver el perfil de este paciente.');
      } else {
        setError('No se pudo cargar la información del paciente.');
      }
    } finally {
      setLoadingPaciente(false);
    }
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPaciente(null);
  };

  const handleVerHistorial = (idUsuario: number) => {
    navigate(`/HistorialMedico/Paciente/${idUsuario}`);
  };
  const getBadgeColor = (estadoCita: number) => {
    switch (estadoCita) {
      case 0: return 'bg-warning text-dark'; 
      case 1: return 'bg-primary'; 
      case 2: return 'bg-danger'; 
      case 3: return 'bg-success'; 
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Panel de Doctor</h1>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Citas Programadas</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando citas...</p>
            </div>
          ) : citas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>ID Usuario</th>
                    <th>Fecha y Hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map(cita => (
                    <tr key={cita.idCita}>
                      <td>{cita.nombrePaciente}</td>
                      <td>{cita.idUsuario}</td>
                      <td>{new Date(cita.fechaHora).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getBadgeColor(cita.estadoCita)}`}>
                          {cita.estadoNombre}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleVerPerfil(cita.idUsuario)}
                          >
                            Ver Perfil
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleVerHistorial(cita.idUsuario)}
                          >
                            Historial Médico
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No hay citas programadas</p>
          )}
        </div>
      </div>

      {/* Modal para Ver Perfil de Paciente */}
      {showPerfilModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Perfil del Paciente</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClosePerfilModal}></button>
              </div>
              <div className="modal-body">
                {loadingPaciente ? (
                  <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando información del paciente...</p>
                  </div>
                ) : selectedPaciente ? (
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h3 className="card-title mb-3">{selectedPaciente.nombre} {selectedPaciente.apellidos}</h3>
                          <div className="row">
                            <div className="col-md-6">
                              <p><strong>ID de Usuario:</strong> {selectedPaciente.idUsuario}</p>
                              <p><strong>Edad:</strong> {selectedPaciente.edad} años</p>
                              <p><strong>Teléfono:</strong> {selectedPaciente.telefono}</p>
                              <p><strong>Correo Electrónico:</strong> {selectedPaciente.correo}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Dirección:</strong> {selectedPaciente.direccion}</p>
                              <p><strong>Ciudad:</strong> {selectedPaciente.ciudad}</p>
                              <p><strong>Estado:</strong> {selectedPaciente.estado}</p>
                              <p><strong>Nombre de Usuario:</strong> {selectedPaciente.usuario}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 text-end">
                      <button 
                        className="btn btn-info"
                        onClick={() => {
                          handleClosePerfilModal();
                          handleVerHistorial(selectedPaciente.idUsuario);
                        }}
                      >
                        Ver Historial Médico
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-danger">No se pudo cargar la información del paciente</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClosePerfilModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitasPacientes;